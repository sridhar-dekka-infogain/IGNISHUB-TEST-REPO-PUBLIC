/**
 * Mirrors `booking.caregiver_availability_schedule` (see prisma/schema.prisma).
 * One row = one recurring weekly time slot for a caregiver.
 */
export class AvailabilityScheduleEntity {
  id: string;
  caregiverId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
}
