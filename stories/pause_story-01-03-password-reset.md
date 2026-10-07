---
artifactType: story
documentName: "STORY-01-03: Password Reset via Email Link"
publishId: ~
syncedAt: ~
activityId: epics-and-stories
destination: jira
artifactPath: ignis_artifacts/implementation-artifacts/story-01-03-password-reset.md
issueTypeName: Story
parentArtifactPath: ignis_artifacts/implementation-artifacts/epic-01-user-authentication.md
repoSyncStatus: not_synced
lastModified: ~
status: ready-for-dev
---

# STORY-01-03: Password Reset via Email Link

## User Story
**As a** registered user who has forgotten my password,  
**I want to** receive a secure reset link via email,  
**So that** I can regain access to my account without contacting support.

## Context & Background
Self-service password reset reduces support burden and improves user trust. The flow uses a single-use, time-limited token to prevent replay attacks.

## Acceptance Criteria

### AC-1: Forgot Password Request
- [ ] A "Forgot password?" link on `/login` navigates to `/forgot-password`
- [ ] Page contains a single `Email` field and a `Send Reset Link` button
- [ ] On submission (valid or invalid email), the UI always shows: *"If an account exists for that email, a reset link has been sent."* (prevents email enumeration)
- [ ] API rate-limited to 3 requests per email per hour

### AC-2: Reset Email
- [ ] If the email matches an active account, a reset email is sent within 30 seconds
- [ ] Email subject: *"Reset your E42-Test password"*
- [ ] Email contains a link: `https://app.e42test.com/reset-password?token={token}`
- [ ] Token is a cryptographically random 64-byte hex string, TTL 1 hour, single-use

### AC-3: Reset Password Form
- [ ] Navigating to the reset link renders `/reset-password` with `Password` and `Confirm Password` fields
- [ ] Invalid or expired token shows: *"This link is invalid or has expired. [Request a new one]"*
- [ ] Password must meet the same complexity rules as registration (AC-1 of STORY-01-01)

### AC-4: Password Update
- [ ] On valid submission, the user's password hash is updated
- [ ] The reset token is invalidated immediately after use
- [ ] All existing refresh tokens for the user are revoked (force logout of all sessions)
- [ ] User is redirected to `/login` with toast: *"Password updated. Please log in."*
- [ ] A confirmation email is sent: *"Your password was changed. If this wasn't you, contact support."*

## Technical Notes
- **API Endpoints:** `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`
- **Token Storage:** `password_reset_tokens` table (hashed token, user_id, expires_at, used)
- **Session Revocation:** On reset, DELETE all rows in `user_refresh_tokens` for the user

## Definition of Done
- [ ] All ACs pass
- [ ] Unit tests for token generation, expiry, and single-use enforcement
- [ ] Integration test: full forgot → reset → login flow
- [ ] PR reviewed and approved
