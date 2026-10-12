export const BOOKING_AVAILABILITY_PORT = Symbol('BOOKING_AVAILABILITY_PORT');

export interface ConfirmedBooking {
  id: string;
  caregiverId: string;
  scheduledStart: Date;
  scheduledEnd: Date;
}

/**
 * Port into the booking domain's CONFIRMED-booking data, used only for
 * conflict detection. `AvailabilityService` depends on this interface
 * rather than querying bookings directly, so module boundaries stay
 * intact (no cross-module direct DB access).
 */
export interface BookingAvailabilityPort {
  findConfirmedForCaregiver(caregiverId: string): Promise<ConfirmedBooking[]>;

  findConfirmedOverlappingRange(caregiverId: string, startDate: Date, endDate: Date): Promise<ConfirmedBooking[]>;
}
