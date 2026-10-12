import { AvailabilityScheduleEntity } from '../entities/availability-schedule.entity';
import { TimeSlotDto } from '../dto/update-schedule.dto';

export const AVAILABILITY_SCHEDULE_REPOSITORY = Symbol('AVAILABILITY_SCHEDULE_REPOSITORY');

/**
 * Persistence port for `booking.caregiver_availability_schedule`.
 * Implemented by a Prisma-backed adapter; injected via
 * `AVAILABILITY_SCHEDULE_REPOSITORY` so the service never touches the DB
 * client directly (keeps module boundaries clean + makes unit testing easy).
 */
export interface AvailabilityScheduleRepository {
  findByCaregiver(caregiverId: string): Promise<AvailabilityScheduleEntity[]>;

  /** Atomically deletes all existing slots for the caregiver and inserts the new ones. */
  replaceAll(caregiverId: string, slots: TimeSlotDto[]): Promise<AvailabilityScheduleEntity[]>;
}
