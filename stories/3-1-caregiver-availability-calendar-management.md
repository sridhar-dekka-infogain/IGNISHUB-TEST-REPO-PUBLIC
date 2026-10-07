---
story_id: "3.1"
story_key: "3-1-caregiver-availability-calendar-management"
epic: 3
title: Caregiver Availability Calendar Management
status: ready-for-dev
priority: critical
effort: L
depends_on: ["2.3", "2.8"]
blocks: ["3.2", "3.4", "3.5"]
frs: ["FR10"]
nfrs: ["NFR3", "NFR4", "NFR12"]
project: care-giver-app
date: 2026-09-03
---

# Story 3.1 — Caregiver Availability Calendar Management

## Story Statement

**As an** approved caregiver,
**I want** to configure my weekly availability schedule and block specific dates/times as unavailable,
**So that** care seekers can only book me during times I am genuinely available, preventing double-bookings and scheduling conflicts.

---

## Background & Context

This is the **first story in Epic 3** and a critical prerequisite for all booking stories (3.2, 3.4, 3.5). Without availability data, the search and booking flows cannot filter by caregiver availability.

**Availability model:**
- **Recurring weekly schedule** — e.g., "Available Mon–Fri 8am–6pm, Sat 9am–1pm"
- **Blocked dates** — specific dates/ranges the caregiver is unavailable (holidays, personal time)
- **Booking-derived unavailability** — when a booking is CONFIRMED, those time slots become unavailable automatically (handled by the booking service, not this story)

**What this story does NOT cover:**
- Availability display to care seekers (Story 3.2 — search filters)
- Booking conflict detection (Story 3.4 — single booking creation)
- Recurring booking schedule management (Story 3.5)

**Architecture note:** Availability data lives in the `booking` schema. The `CaregiverApprovedGuard` from Epic 2 (Story 2.3) must be applied to all availability endpoints — only APPROVED caregivers can set availability.

---

## Acceptance Criteria

### AC1 — Weekly Availability Schedule API
- [ ] `PUT /api/v1/caregivers/me/availability/schedule` endpoint
- [ ] Accepts: `{ schedule: WeeklySchedule }` where `WeeklySchedule` is an array of day slots
- [ ] Each slot: `{ dayOfWeek: 0-6, startTime: 'HH:MM', endTime: 'HH:MM' }` (0=Sunday, 6=Saturday)
- [ ] Validates: `startTime` < `endTime`, no overlapping slots on same day
- [ ] Replaces entire schedule atomically (PUT semantics — not PATCH)
- [ ] Requires `Caregiver` role JWT + `CaregiverApprovedGuard`
- [ ] Returns: `{ schedule: WeeklySchedule, updatedAt: string }`
- [ ] Audit log: `CAREGIVER_AVAILABILITY_UPDATED` with caregiver ID

### AC2 — Get Own Availability Schedule
- [ ] `GET /api/v1/caregivers/me/availability/schedule` endpoint
- [ ] Returns current weekly schedule for authenticated caregiver
- [ ] Returns empty schedule `{ schedule: [] }` if not yet configured
- [ ] Requires `Caregiver` role JWT

### AC3 — Block Specific Dates
- [ ] `POST /api/v1/caregivers/me/availability/blocks` endpoint
- [ ] Accepts: `{ startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', reason?: string }`
- [ ] `endDate` must be >= `startDate`; max block duration: 90 days
- [ ] Creates a date-range block record in `caregiver_availability_blocks` table
- [ ] Requires `Caregiver` role JWT + `CaregiverApprovedGuard`
- [ ] Returns: `{ blockId: string, startDate, endDate, createdAt }`

### AC4 — List and Delete Availability Blocks
- [ ] `GET /api/v1/caregivers/me/availability/blocks` — list all future blocks
- [ ] `DELETE /api/v1/caregivers/me/availability/blocks/:blockId` — remove a block
- [ ] Cannot delete blocks that overlap with CONFIRMED bookings
- [ ] Returns 409 Conflict with message if block deletion would expose a confirmed booking slot

### AC5 — Mobile Calendar UI (React Native)
- [ ] Weekly schedule screen: 7-day grid with time slot selection per day
- [ ] Toggle rows for each day (Mon–Sun) with start/end time pickers
- [ ] "Block dates" flow: date range picker → optional reason → confirm
- [ ] Blocked dates shown in red on the calendar view
- [ ] Confirmed bookings shown in blue (read-only, cannot be deleted)
- [ ] All tap targets ≥ 48×48dp (elderly-first accessibility)
- [ ] VoiceOver/TalkBack labels on all interactive elements
- [ ] Loading states with skeleton UI during API calls

### AC6 — Availability Conflict Validation
- [ ] When saving schedule, validate no existing CONFIRMED bookings fall outside new availability
- [ ] If conflict detected: return 409 with list of conflicting booking IDs
- [ ] Frontend displays: "You have confirmed bookings during these times. Please reschedule them first."

---

## Technical Requirements

### New Database Schema

```sql
-- schema: booking
-- Weekly recurring availability schedule
caregiver_availability_schedule (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id    UUID NOT NULL REFERENCES auth.caregiver_profiles(id),
  day_of_week     SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_overlap UNIQUE (caregiver_id, day_of_week, start_time)
)

-- Date-range blocks (holidays, personal time)
caregiver_availability_blocks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id    UUID NOT NULL REFERENCES auth.caregiver_profiles(id),
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  reason          TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_range CHECK (end_date >= start_date)
)

-- Indexes
CREATE INDEX idx_availability_schedule_caregiver ON booking.caregiver_availability_schedule(caregiver_id);
CREATE INDEX idx_availability_blocks_caregiver_dates ON booking.caregiver_availability_blocks(caregiver_id, start_date, end_date);
```

### New Files to Create

**Backend (NestJS):**
```
apps/api/src/modules/booking/
├── availability/
│   ├── availability.controller.ts      # PUT/GET schedule, POST/GET/DELETE blocks
│   ├── availability.service.ts         # Business logic + conflict detection
│   ├── availability.module.ts
│   ├── dto/
│   │   ├── update-schedule.dto.ts      # WeeklySchedule validation
│   │   └── create-block.dto.ts         # DateRange validation
│   └── entities/
│       ├── availability-schedule.entity.ts
│       └── availability-block.entity.ts
```

**Mobile (React Native):**
```
apps/mobile/src/app/(caregiver)/
├── availability/
│   ├── index.tsx                       # Availability overview screen
│   ├── schedule.tsx                    # Weekly schedule editor
│   └── blocks.tsx                      # Date blocks manager
apps/mobile/src/components/
├── availability/
│   ├── WeeklyScheduleGrid.tsx          # 7-day grid component
│   ├── TimeSlotPicker.tsx              # Start/end time picker
│   └── DateRangePicker.tsx             # Block date range picker
```

**Shared types:**
```
packages/types/src/
└── availability.types.ts               # WeeklySchedule, AvailabilityBlock interfaces
```

### Key Implementation Details

**WeeklySchedule DTO validation:**
```typescript
// apps/api/src/modules/booking/availability/dto/update-schedule.dto.ts
import { IsArray, ValidateNested, IsInt, Min, Max, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class TimeSlotDto {
  @IsInt() @Min(0) @Max(6)
  dayOfWeek: number;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime: string;  // 'HH:MM' 24-hour format

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  endTime: string;
}

export class UpdateScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  schedule: TimeSlotDto[];
}
```

**Conflict detection logic:**
```typescript
// availability.service.ts
async updateSchedule(caregiverId: string, dto: UpdateScheduleDto): Promise<void> {
  // 1. Check for confirmed bookings outside new schedule
  const confirmedBookings = await this.bookingRepo.findConfirmedForCaregiver(caregiverId);
  const conflicts = confirmedBookings.filter(booking =>
    !this.isWithinSchedule(booking.scheduledStart, booking.scheduledEnd, dto.schedule)
  );
  if (conflicts.length > 0) {
    throw new ConflictException({ conflictingBookingIds: conflicts.map(b => b.id) });
  }
  // 2. Atomic replace: delete all existing slots, insert new ones
  await this.prisma.$transaction([
    this.prisma.caregiverAvailabilitySchedule.deleteMany({ where: { caregiverId } }),
    this.prisma.caregiverAvailabilitySchedule.createMany({ data: dto.schedule.map(s => ({ caregiverId, ...s })) }),
  ]);
}
```

**Availability query for search (used by Story 3.2):**
```typescript
// Exported from AvailabilityService for use by SearchService
async isAvailableOn(caregiverId: string, date: Date, startTime: string, endTime: string): Promise<boolean> {
  const dayOfWeek = date.getDay();
  const hasScheduleSlot = await this.prisma.caregiverAvailabilitySchedule.findFirst({
    where: { caregiverId, dayOfWeek, startTime: { lte: startTime }, endTime: { gte: endTime } }
  });
  if (!hasScheduleSlot) return false;
  const hasBlock = await this.prisma.caregiverAvailabilityBlock.findFirst({
    where: { caregiverId, startDate: { lte: date }, endDate: { gte: date } }
  });
  return !hasBlock;
}
```

---

## Architecture Compliance

| Requirement | Implementation |
|---|---|
| `CaregiverApprovedGuard` | Applied to all write endpoints — only APPROVED caregivers can set availability |
| `booking` schema | All tables in `booking` PostgreSQL schema, not `auth` |
| NestJS module boundaries | `AvailabilityModule` is a sub-module of `BookingModule` — no direct imports from other modules |
| Audit logging | `CAREGIVER_AVAILABILITY_UPDATED` event via `AuditLogInterceptor` |
| RBAC | `@Roles('Caregiver')` decorator on all endpoints |
| API versioning | All routes under `/api/v1/` |
| Response envelope | `{ data, meta, errors }` wrapper on all responses |

---

## Anti-Patterns — DO NOT DO THESE

| ❌ Anti-Pattern | ✅ Correct Approach |
|---|---|
| Storing availability in `auth` schema | Use `booking` schema — availability is a booking domain concern |
| Allowing unapproved caregivers to set availability | Always apply `CaregiverApprovedGuard` — PENDING/REJECTED caregivers cannot set availability |
| PATCH semantics for schedule update | Use PUT — replace entire schedule atomically to avoid partial state |
| Checking availability conflicts in the mobile app | Server-side conflict detection only — client cannot be trusted |
| Storing time as strings without validation | Validate `HH:MM` format with regex; store as PostgreSQL `TIME` type |
| Cross-module direct DB access | `SearchService` (Story 3.2) must call `AvailabilityService.isAvailableOn()` — not query the DB directly |
| Allowing deletion of blocks with confirmed bookings | Return 409 Conflict — never silently allow this |

---

## Testing Requirements

### Unit Tests
```typescript
// availability.service.spec.ts
describe('AvailabilityService', () => {
  it('should replace schedule atomically', async () => { ... });
  it('should reject schedule update when confirmed bookings conflict', async () => { ... });
  it('should return false for isAvailableOn when date is blocked', async () => { ... });
  it('should return false for isAvailableOn when no schedule slot matches', async () => { ... });
  it('should reject block deletion when confirmed booking exists in range', async () => { ... });
});
```

### Integration Tests
```typescript
// availability.controller.spec.ts
describe('PUT /api/v1/caregivers/me/availability/schedule', () => {
  it('returns 401 for unauthenticated requests', async () => { ... });
  it('returns 403 for PENDING caregiver (CaregiverApprovedGuard)', async () => { ... });
  it('returns 200 and replaces schedule for APPROVED caregiver', async () => { ... });
  it('returns 409 when new schedule conflicts with confirmed booking', async () => { ... });
  it('returns 400 for overlapping time slots on same day', async () => { ... });
});
```

### Mobile Component Tests
```typescript
// WeeklyScheduleGrid.test.tsx
it('renders 7 day rows with toggle switches', () => { ... });
it('shows time pickers when day is toggled on', () => { ... });
it('all interactive elements have accessibilityLabel', () => { ... });
it('tap targets are at least 48dp', () => { ... });
```

---

## UX Requirements

- **Weekly schedule grid:** 7 rows (Mon–Sun), each with a toggle + time range picker when enabled
- **Time picker:** Native iOS/Android time picker via `@react-native-community/datetimepicker`
- **Blocked dates:** Red highlight on calendar; confirmed bookings in blue (read-only)
- **Empty state:** "You haven't set your availability yet. Set your schedule so care seekers can book you."
- **Conflict error:** Inline error listing conflicting booking dates — not a generic error toast
- **Accessibility:** All toggles and pickers have `accessibilityLabel` and `accessibilityRole`
- **Minimum tap target:** 48×48dp on all interactive elements (elderly-first)
- **Haptic feedback:** Light haptic on toggle, medium haptic on save confirmation

---

## Dependencies

**Depends on (must be complete before starting):**
- Story 2.3 — `CaregiverApprovedGuard` must exist
- Story 2.8 — Caregiver profile must be APPROVED before availability can be set

**Blocks (cannot start until this is done):**
- Story 3.2 — Search needs `AvailabilityService.isAvailableOn()` to filter by availability
- Story 3.4 — Single booking creation needs availability validation
- Story 3.5 — Recurring booking creation needs availability validation

---

## Definition of Done

- [ ] All 6 acceptance criteria implemented and passing
- [ ] Unit tests: ≥ 90% coverage on `AvailabilityService`
- [ ] Integration tests: all endpoint scenarios covered
- [ ] Mobile screens: WeeklyScheduleGrid, TimeSlotPicker, DateRangePicker components built
- [ ] Accessibility: all tap targets ≥ 48dp, VoiceOver labels present
- [ ] `AvailabilityService.isAvailableOn()` exported and ready for Story 3.2 consumption
- [ ] Audit log event `CAREGIVER_AVAILABILITY_UPDATED` firing correctly
- [ ] No cross-module direct DB access (only via service interfaces)
- [ ] Story status updated to `done` in sprint-status.yaml after code review
