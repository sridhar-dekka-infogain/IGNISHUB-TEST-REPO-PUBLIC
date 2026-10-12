import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { AvailabilityScheduleEntity } from '../entities/availability-schedule.entity';
import { AvailabilityScheduleRepository } from '../ports/availability-schedule.repository';
import { TimeSlotDto } from '../dto/update-schedule.dto';

/**
 * In-memory reference implementation of `AvailabilityScheduleRepository`.
 *
 * NOTE: This repo does not yet have a Prisma client wired up for the
 * `booking` schema. Swap this adapter for a Prisma-backed implementation
 * of the same `AvailabilityScheduleRepository` port (see
 * `prisma/schema.prisma` for the `caregiver_availability_schedule` model)
 * once the persistence layer is introduced, without touching
 * `AvailabilityService`.
 */
@Injectable()
export class InMemoryAvailabilityScheduleRepository implements AvailabilityScheduleRepository {
  private readonly slotsByCaregiver = new Map<string, AvailabilityScheduleEntity[]>();

  async findByCaregiver(caregiverId: string): Promise<AvailabilityScheduleEntity[]> {
    return [...(this.slotsByCaregiver.get(caregiverId) ?? [])];
  }

  async replaceAll(caregiverId: string, slots: TimeSlotDto[]): Promise<AvailabilityScheduleEntity[]> {
    const now = new Date();
    const entities: AvailabilityScheduleEntity[] = slots.map((slot) => ({
      id: randomUUID(),
      caregiverId,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      createdAt: now,
      updatedAt: now,
    }));
    this.slotsByCaregiver.set(caregiverId, entities);
    return entities;
  }
}
