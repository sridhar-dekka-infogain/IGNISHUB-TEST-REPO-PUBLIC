import { Injectable } from '@nestjs/common';
import { BookingAvailabilityPort, ConfirmedBooking } from '../ports/booking-availability.port';

/**
 * Stub implementation of `BookingAvailabilityPort`.
 *
 * Story 3.4 (single booking creation) introduces the real `booking`
 * read-model this will query. Until then this adapter returns no
 * confirmed bookings, which is a safe default (never blocks schedule
 * updates or block deletions). Replace with a real adapter backed by the
 * booking module's repository once it exists — `AvailabilityService`
 * only depends on the `BookingAvailabilityPort` interface, so no other
 * change is required.
 */
@Injectable()
export class InMemoryBookingAvailabilityAdapter implements BookingAvailabilityPort {
  async findConfirmedForCaregiver(_caregiverId: string): Promise<ConfirmedBooking[]> {
    return [];
  }

  async findConfirmedOverlappingRange(
    _caregiverId: string,
    _startDate: Date,
    _endDate: Date,
  ): Promise<ConfirmedBooking[]> {
    return [];
  }
}
