/**
 * Mirrors `booking.caregiver_availability_blocks` (see prisma/schema.prisma).
 * One row = one blocked date range for a caregiver (holiday, personal time).
 */
export class AvailabilityBlockEntity {
  id!: string;
  caregiverId!: string;
  startDate!: Date;
  endDate!: Date;
  reason!: string | null;
  createdAt!: Date;
}
