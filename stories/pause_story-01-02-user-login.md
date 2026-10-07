---
artifactType: story
documentName: "STORY-01-02: User Login with JWT Session Management"
publishId: ~
syncedAt: ~
activityId: epics-and-stories
destination: jira
artifactPath: ignis_artifacts/implementation-artifacts/story-01-02-user-login.md
issueTypeName: Story
parentArtifactPath: ignis_artifacts/implementation-artifacts/epic-01-user-authentication.md
repoSyncStatus: not_synced
lastModified: ~
status: ready-for-dev
---

# STORY-01-02: User Login with JWT Session Management

## User Story
**As a** registered user,  
**I want to** log in with my email and password,  
**So that** I can access my account and pick up where I left off.

## Context & Background
Login is the most frequently used authentication flow. Sessions are managed via short-lived JWTs (15 min) paired with a rotating refresh token (7 days) stored in an HttpOnly cookie to mitigate XSS risks.

## Acceptance Criteria

### AC-1: Login Form
- [ ] Login page is accessible at `/login`
- [ ] Form contains: `Email`, `Password`, and a `Remember me` checkbox
- [ ] Submitting with empty fields shows inline validation errors
- [ ] Password field has a show/hide toggle

### AC-2: Successful Login
- [ ] On valid credentials, API returns HTTP 200 with a signed JWT (access token, 15 min TTL)
- [ ] A refresh token (7-day TTL) is set as an HttpOnly, Secure, SameSite=Strict cookie
- [ ] User is redirected to their last visited page or `/dashboard` if no prior route
- [ ] "Remember me" checked → refresh token TTL extended to 30 days

### AC-3: Failed Login
- [ ] Invalid credentials return HTTP 401
- [ ] UI displays: *"Incorrect email or password."* (no enumeration of which field is wrong)
- [ ] After 5 consecutive failures, the account is temporarily locked for 15 minutes
- [ ] Locked account shows: *"Too many attempts. Try again in 15 minutes or reset your password."*

### AC-4: Unverified Account
- [ ] Login attempt by an unverified user returns HTTP 403
- [ ] UI displays: *"Please verify your email before logging in. [Resend verification email]"*

### AC-5: Token Refresh
- [ ] A silent token refresh endpoint `POST /api/v1/auth/refresh` accepts the refresh cookie
- [ ] Returns a new access token if the refresh token is valid and not expired
- [ ] Rotates the refresh token on each use (refresh token rotation)
- [ ] Expired or invalid refresh tokens return HTTP 401, triggering a logout

### AC-6: Logout
- [ ] `POST /api/v1/auth/logout` invalidates the refresh token server-side
- [ ] Clears the HttpOnly cookie
- [ ] Redirects to `/login` with a toast: *"You've been logged out."*

## Technical Notes
- **API Endpoints:** `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `POST /api/v1/auth/logout`
- **JWT Library:** `jsonwebtoken` (Node.js) — sign with RS256
- **Refresh Token Storage:** `user_refresh_tokens` table (hashed token, user_id, expires_at, revoked)
- **Rate Limiting:** 10 login attempts per IP per minute

## Out of Scope
- Social/OAuth login
- MFA (EPIC-03)

## Dependencies
- STORY-01-01 must be complete (user records must exist)
- RS256 key pair must be provisioned in secrets manager

## Definition of Done
- [ ] All ACs pass
- [ ] Unit tests for token generation, refresh rotation, and lockout logic (≥ 90% coverage)
- [ ] Security review: no tokens in URL params or response bodies beyond access token
- [ ] PR reviewed and approved
