-- Story 3.1 — Caregiver Availability Calendar Management
-- schema: booking

CREATE TABLE IF NOT EXISTS booking.caregiver_availability_schedule (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id    UUID NOT NULL REFERENCES auth.caregiver_profiles(id),
  day_of_week     SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_overlap UNIQUE (caregiver_id, day_of_week, start_time)
);

CREATE TABLE IF NOT EXISTS booking.caregiver_availability_blocks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id    UUID NOT NULL REFERENCES auth.caregiver_profiles(id),
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  reason          TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_range CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_availability_schedule_caregiver
  ON booking.caregiver_availability_schedule(caregiver_id);

CREATE INDEX IF NOT EXISTS idx_availability_blocks_caregiver_dates
  ON booking.caregiver_availability_blocks(caregiver_id, start_date, end_date);
