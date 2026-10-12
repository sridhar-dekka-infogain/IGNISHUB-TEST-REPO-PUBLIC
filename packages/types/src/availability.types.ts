/**
 * Shared types for caregiver availability (weekly schedule + date blocks).
 * Story 3.1 — Caregiver Availability Calendar Management.
 *
 * These types are consumed by:
 * - apps/api (NestJS AvailabilityModule — DTO validation & responses)
 * - apps/mobile (React Native availability screens/components)
 */

/** 0 = Sunday ... 6 = Saturday */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** 24-hour 'HH:MM' formatted time string, e.g. '09:00', '17:30'. */
export type TimeString = string;

export interface TimeSlot {
  dayOfWeek: DayOfWeek;
  startTime: TimeString;
  endTime: TimeString;
}

/** Array of day slots representing a caregiver's recurring weekly availability. */
export type WeeklySchedule = TimeSlot[];

export interface AvailabilityScheduleResponse {
  schedule: WeeklySchedule;
  updatedAt: string;
}

/** 'YYYY-MM-DD' formatted calendar date string. */
export type DateString = string;

export interface AvailabilityBlock {
  blockId: string;
  startDate: DateString;
  endDate: DateString;
  reason?: string;
  createdAt: string;
}

export interface CreateAvailabilityBlockRequest {
  startDate: DateString;
  endDate: DateString;
  reason?: string;
}

export interface AvailabilityConflictError {
  conflictingBookingIds: string[];
  message: string;
}
