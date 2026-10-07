---
story_id: '3.7'
story_key: 3-7-one-tap-rebooking
epic: 3
title: One-Tap Rebooking
status: ready-for-dev
priority: high
effort: S
depends_on:
  - '3.6'
blocks: []
frs:
  - FR27
nfrs:
  - NFR3
  - NFR12
ux_requirements:
  - UX-DR8
project: care-giver-app
date: '2026-09-03'
repoSyncStatus: synced
lastModified: '2026-09-04T16:39:18.526Z'
---

# Story 3.7 — One-Tap Rebooking

## Story Statement

**As a** care seeker with a previous booking history,
**I want** to rebook a previously used caregiver with 1–2 taps from my home screen,
**So that** I can quickly schedule care with a trusted caregiver without going through the full search and booking flow again.

---

## Background & Context

This is a **delight story** — a UX differentiator that makes the platform feel effortless for repeat users. The UX spec (UX-DR8) explicitly calls for "1–2 tap rebooking from home screen" inspired by TaskRabbit's "Book [Name] Again" pattern.

**Rebooking flow:**
1. Care seeker home screen shows "Recent Caregivers" section (last 3 used caregivers)
2. Each card has a "Book Again" button
3. Tapping "Book Again" pre-fills the booking form with the last booking's details (care type, duration)
4. Care seeker only needs to select a new date/time → confirm → done (2 taps)

**What "rebooking" means:**
- Creates a NEW booking (not a copy of the old one)
- Pre-fills: caregiver, care type, duration from last booking
- Care seeker must still select a new date/time (cannot reuse past date)
- Caregiver must still accept the new booking

**This story does NOT cover:**
- Recurring bookings (Story 3.5)
- Booking history list (covered in Story 3.4 — `GET /bookings`)

---

## Acceptance Criteria

### AC1 — Recent Caregivers API
- [ ] `GET /api/v1/caregivers/recent` endpoint
- [ ] Returns last 3 distinct caregivers the care seeker has had a COMPLETED booking with
- [ ] Response: `{ caregivers: [{ id, name, profilePhotoUrl, careType, lastBookedAt, hourlyRate }] }`
- [ ] Sorted by `lastBookedAt` descending (most recent first)
- [ ] Requires `CareSeeker` role JWT
- [ ] Returns empty array if no completed bookings exist

### AC2 — Rebook Endpoint
- [ ] `POST /api/v1/bookings/rebook` endpoint
- [ ] Request body: `{ caregiverId: string, scheduledStart: string, scheduledEnd: string }`
- [ ] Pre-fills `careType` and `hourlyRate` from the most recent COMPLETED booking with this caregiver
- [ ] Validates: caregiver is still APPROVED (may have been suspended since last booking)
- [ ] Validates: caregiver is available at new requested time
- [ ] Creates new booking with status `PENDING` (same as Story 3.4 `POST /bookings`)
- [ ] Reuses `patientAddress` from last booking with this caregiver (care seeker can override)
- [ ] Returns same response shape as `POST /bookings`

### AC3 — Home Screen "Recent Caregivers" Section (Mobile)
- [ ] Home screen shows "Book Again" section with last 3 caregivers (horizontal scroll)
- [ ] Each card: profile photo, name, credential type, "Book Again" button
- [ ] Tapping "Book Again" opens a simplified booking form:
  - Pre-filled: caregiver, care type, duration (from last booking)
  - Only requires: new date + new time selection
  - "Confirm Booking" CTA (1 more tap after date/time selection = 2 taps total)
- [ ] Section hidden if no completed bookings exist
- [ ] "Book Again" button: `accessibilityLabel="Book [Name] again"`

### AC4 — Pre-filled Booking Form
- [ ] Simplified booking form (not the full form from Story 3.4)
- [ ] Shows: caregiver photo + name + credential badge (trust signal)
- [ ] Pre-filled fields (read-only): care type, duration, estimated cost
- [ ] Editable fields: date, time
- [ ] "Change caregiver" link → navigates to full search (Story 3.2)
- [ ] Estimated cost updates in real-time as duration changes

### AC5 — Caregiver Availability Check
- [ ] Before showing "Book Again" button, check if caregiver is still APPROVED
- [ ] If caregiver is no longer APPROVED: hide "Book Again" button, show "Caregiver no longer available"
- [ ] Availability for specific date/time checked at form submission (not pre-emptively)

---

## Dependencies

**Depends on:**
- Story 3.6 — Need COMPLETED bookings to exist (caregiver must have accepted)

**Blocks:** None

---

## Definition of Done

- [ ] All 5 acceptance criteria implemented and passing
- [ ] `GET /caregivers/recent` returns last 3 distinct caregivers
- [ ] `POST /bookings/rebook` delegates to standard booking creation
- [ ] Home screen "Recent Caregivers" section built
- [ ] Simplified pre-filled booking form built (2-tap flow)
- [ ] Suspended caregiver check implemented
- [ ] Unit + integration tests passing
- [ ] Story status updated to `done` in sprint-status.yaml after code review
