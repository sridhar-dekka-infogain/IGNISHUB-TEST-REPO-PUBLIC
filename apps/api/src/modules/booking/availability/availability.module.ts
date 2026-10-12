import { Module } from '@nestjs/common';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { AuditLogService } from '../../../common/audit/audit-log.service';
import { AuditLogInterceptor } from '../../../common/interceptors/audit-log.interceptor';
import { AVAILABILITY_SCHEDULE_REPOSITORY } from './ports/availability-schedule.repository';
import { AVAILABILITY_BLOCK_REPOSITORY } from './ports/availability-block.repository';
import { BOOKING_AVAILABILITY_PORT } from './ports/booking-availability.port';
import { InMemoryAvailabilityScheduleRepository } from './adapters/in-memory-availability-schedule.repository';
import { InMemoryAvailabilityBlockRepository } from './adapters/in-memory-availability-block.repository';
import { InMemoryBookingAvailabilityAdapter } from './adapters/in-memory-booking-availability.adapter';

/**
 * Sub-module of `BookingModule`. Owns all caregiver availability
 * (recurring weekly schedule + date blocks) endpoints and business logic.
 *
 * Exports `AvailabilityService` so other booking sub-modules (e.g. the
 * Story 3.2 search module) can call `isAvailableOn()` instead of
 * querying availability tables directly.
 */
@Module({
  controllers: [AvailabilityController],
  providers: [
    AvailabilityService,
    AuditLogService,
    AuditLogInterceptor,
    { provide: AVAILABILITY_SCHEDULE_REPOSITORY, useClass: InMemoryAvailabilityScheduleRepository },
    { provide: AVAILABILITY_BLOCK_REPOSITORY, useClass: InMemoryAvailabilityBlockRepository },
    { provide: BOOKING_AVAILABILITY_PORT, useClass: InMemoryBookingAvailabilityAdapter },
  ],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
