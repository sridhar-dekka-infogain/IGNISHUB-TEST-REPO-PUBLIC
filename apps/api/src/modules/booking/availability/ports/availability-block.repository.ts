import { AvailabilityBlockEntity } from '../entities/availability-block.entity';

export const AVAILABILITY_BLOCK_REPOSITORY = Symbol('AVAILABILITY_BLOCK_REPOSITORY');

export interface CreateBlockInput {
  caregiverId: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
}

/**
 * Persistence port for `booking.caregiver_availability_blocks`.
 */
export interface AvailabilityBlockRepository {
  create(input: CreateBlockInput): Promise<AvailabilityBlockEntity>;

  /** Blocks for the caregiver whose end date is on/after `fromDate`. */
  findFutureByCaregiver(caregiverId: string, fromDate: Date): Promise<AvailabilityBlockEntity[]>;

  findById(blockId: string): Promise<AvailabilityBlockEntity | null>;

  delete(blockId: string): Promise<void>;
}
