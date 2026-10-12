import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AvailabilityScheduleEntity } from './entities/availability-schedule.entity';
import { AvailabilityBlockEntity } from './entities/availability-block.entity';
import { UpdateScheduleDto, TimeSlotDto } from './dto/update-schedule.dto';
import { CreateBlockDto } from './dto/create-block.dto';
import {
  AVAILABILITY_SCHEDULE_REPOSITORY,
  AvailabilityScheduleRepository,
} from './ports/availability-schedule.repository';
import { AVAILABILITY_BLOCK_REPOSITORY, AvailabilityBlockRepository } from './ports/availability-block.repository';
import { BOOKING_AVAILABILITY_PORT, BookingAvailabilityPort } from './ports/booking-availability.port';

const MAX_BLOCK_DURATION_DAYS = 90;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface ScheduleConflictDetails {
  conflictingBookingIds: string[];
}

/** Thrown when a schedule update would leave CONFIRMED bookings outside the new availability. */
export class ScheduleConflictException extends ConflictException {
  constructor(public readonly details: ScheduleConflictDetails) {
    super({ message: 'You have confirmed bookings during these times. Please reschedule them first.', ...details });
  }
}

@Injectable()
export class AvailabilityService {
  constructor(
    @Inject(AVAILABILITY_SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: AvailabilityScheduleRepository,
    @Inject(AVAILABILITY_BLOCK_REPOSITORY)
    private readonly blockRepository: AvailabilityBlockRepository,
    @Inject(BOOKING_AVAILABILITY_PORT)
    private readonly bookingAvailabilityPort: BookingAvailabilityPort,
  ) {}

  async getSchedule(caregiverId: string): Promise<AvailabilityScheduleEntity[]> {
    return this.scheduleRepository.findByCaregiver(caregiverId);
  }

  async updateSchedule(caregiverId: string, dto: UpdateScheduleDto): Promise<AvailabilityScheduleEntity[]> {
    this.validateNoOverlaps(dto.schedule);

    const confirmedBookings = await this.bookingAvailabilityPort.findConfirmedForCaregiver(caregiverId);
    const conflicts = confirmedBookings.filter(
      (booking) => !this.isBookingWithinSchedule(booking.scheduledStart, booking.scheduledEnd, dto.schedule),
    );

    if (conflicts.length > 0) {
      throw new ScheduleConflictException({ conflictingBookingIds: conflicts.map((b) => b.id) });
    }

    return this.scheduleRepository.replaceAll(caregiverId, dto.schedule);
  }

  async createBlock(caregiverId: string, dto: CreateBlockDto): Promise<AvailabilityBlockEntity> {
    const startDate = this.parseDateOnly(dto.startDate);
    const endDate = this.parseDateOnly(dto.endDate);

    if (endDate.getTime() < startDate.getTime()) {
      throw new BadRequestException('endDate must be on or after startDate.');
    }

    const durationDays = Math.round((endDate.getTime() - startDate.getTime()) / MS_PER_DAY) + 1;
    if (durationDays > MAX_BLOCK_DURATION_DAYS) {
      throw new BadRequestException(`Block duration cannot exceed ${MAX_BLOCK_DURATION_DAYS} days.`);
    }

    return this.blockRepository.create({ caregiverId, startDate, endDate, reason: dto.reason });
  }

  async listFutureBlocks(caregiverId: string, now: Date = new Date()): Promise<AvailabilityBlockEntity[]> {
    return this.blockRepository.findFutureByCaregiver(caregiverId, now);
  }

  async deleteBlock(caregiverId: string, blockId: string): Promise<void> {
    const block = await this.blockRepository.findById(blockId);

    if (!block || block.caregiverId !== caregiverId) {
      throw new NotFoundException('Availability block not found.');
    }

    const overlappingConfirmedBookings = await this.bookingAvailabilityPort.findConfirmedOverlappingRange(
      caregiverId,
      block.startDate,
      block.endDate,
    );

    if (overlappingConfirmedBookings.length > 0) {
      throw new ConflictException({
        message: 'Deleting this block would expose a confirmed booking slot.',
        conflictingBookingIds: overlappingConfirmedBookings.map((b) => b.id),
      });
    }

    await this.blockRepository.delete(blockId);
  }

  /**
   * Used by SearchService (Story 3.2) to check caregiver availability.
   * Other modules must call this method rather than querying availability
   * tables directly.
   */
  async isAvailableOn(caregiverId: string, date: Date, startTime: string, endTime: string): Promise<boolean> {
    const dayOfWeek = date.getDay();
    const slots = await this.scheduleRepository.findByCaregiver(caregiverId);

    const hasScheduleSlot = slots.some(
      (slot) => slot.dayOfWeek === dayOfWeek && slot.startTime <= startTime && slot.endTime >= endTime,
    );
    if (!hasScheduleSlot) {
      return false;
    }

    const futureBlocks = await this.blockRepository.findFutureByCaregiver(caregiverId, date);
    const isBlocked = futureBlocks.some(
      (block) => block.startDate.getTime() <= date.getTime() && block.endDate.getTime() >= date.getTime(),
    );

    return !isBlocked;
  }

  private validateNoOverlaps(schedule: TimeSlotDto[]): void {
    for (const slot of schedule) {
      if (slot.startTime >= slot.endTime) {
        throw new BadRequestException(
          `Invalid slot for day ${slot.dayOfWeek}: startTime (${slot.startTime}) must be before endTime (${slot.endTime}).`,
        );
      }
    }

    const byDay = new Map<number, TimeSlotDto[]>();
    for (const slot of schedule) {
      const existing = byDay.get(slot.dayOfWeek) ?? [];
      existing.push(slot);
      byDay.set(slot.dayOfWeek, existing);
    }

    for (const [dayOfWeek, slots] of byDay) {
      const sorted = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].startTime < sorted[i - 1].endTime) {
          throw new BadRequestException(`Overlapping time slots found for day ${dayOfWeek}.`);
        }
      }
    }
  }

  private isBookingWithinSchedule(scheduledStart: Date, scheduledEnd: Date, schedule: TimeSlotDto[]): boolean {
    const dayOfWeek = scheduledStart.getDay();
    if (scheduledEnd.getDay() !== dayOfWeek) {
      // Bookings that span midnight can never fit a single day's schedule slot.
      return false;
    }

    const startTime = this.toTimeString(scheduledStart);
    const endTime = this.toTimeString(scheduledEnd);

    return schedule.some(
      (slot) => slot.dayOfWeek === dayOfWeek && slot.startTime <= startTime && slot.endTime >= endTime,
    );
  }

  private toTimeString(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private parseDateOnly(dateString: string): Date {
    const date = new Date(`${dateString}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid date: ${dateString}`);
    }
    return date;
  }
}
