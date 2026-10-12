import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { AvailabilityBlockEntity } from '../entities/availability-block.entity';
import { AvailabilityBlockRepository, CreateBlockInput } from '../ports/availability-block.repository';

/**
 * In-memory reference implementation of `AvailabilityBlockRepository`.
 *
 * NOTE: Swap for a Prisma-backed implementation of the same port once the
 * `booking` schema persistence layer exists (see `prisma/schema.prisma`
 * `caregiver_availability_blocks` model).
 */
@Injectable()
export class InMemoryAvailabilityBlockRepository implements AvailabilityBlockRepository {
  private readonly blocksById = new Map<string, AvailabilityBlockEntity>();

  async create(input: CreateBlockInput): Promise<AvailabilityBlockEntity> {
    const entity: AvailabilityBlockEntity = {
      id: randomUUID(),
      caregiverId: input.caregiverId,
      startDate: input.startDate,
      endDate: input.endDate,
      reason: input.reason ?? null,
      createdAt: new Date(),
    };
    this.blocksById.set(entity.id, entity);
    return entity;
  }

  async findFutureByCaregiver(caregiverId: string, fromDate: Date): Promise<AvailabilityBlockEntity[]> {
    return [...this.blocksById.values()].filter(
      (block) => block.caregiverId === caregiverId && block.endDate.getTime() >= fromDate.getTime(),
    );
  }

  async findById(blockId: string): Promise<AvailabilityBlockEntity | null> {
    return this.blocksById.get(blockId) ?? null;
  }

  async delete(blockId: string): Promise<void> {
    this.blocksById.delete(blockId);
  }
}
