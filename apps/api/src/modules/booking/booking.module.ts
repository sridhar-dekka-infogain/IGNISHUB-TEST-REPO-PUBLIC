import { Module } from '@nestjs/common';
import { AvailabilityModule } from './availability/availability.module';

/**
 * Owns the `booking` schema domain. Story 3.1 introduces the
 * `AvailabilityModule` sub-module; future stories (3.2, 3.4, 3.5) add
 * search/booking sub-modules alongside it.
 */
@Module({
  imports: [AvailabilityModule],
  exports: [AvailabilityModule],
})
export class BookingModule {}
