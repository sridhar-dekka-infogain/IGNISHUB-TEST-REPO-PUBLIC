---
artifactType: story
documentName: "STORY-01-01: User Registration with Email Verification"
publishId: ~
syncedAt: ~
activityId: epics-and-stories
destination: jira
artifactPath: ignis_artifacts/implementation-artifacts/story-01-01-user-registration.md
issueTypeName: Story
parentArtifactPath: ignis_artifacts/implementation-artifacts/epic-01-user-authentication.md
repoSyncStatus: not_synced
lastModified: ~
status: ready-for-dev
---

# STORY-01-01: User Registration with Email Verification

## User Story
**As a** new visitor,  
**I want to** create an account using my email address and a password,  
**So that** I can access the platform's features and save my preferences.

## Context & Background
This is the entry point for all new users. The registration flow must be simple, secure, and provide immediate feedback. Email verification ensures account authenticity and reduces spam accounts.

## Acceptance Criteria

### AC-1: Registration Form
- [ ] A registration page is accessible at `/register`
- [ ] The form contains fields: `First Name`, `Last Name`, `Email`, `Password`, `Confirm Password`
- [ ] All fields are required; empty submission shows inline validation errors
- [ ] Email field validates format (RFC 5322) on blur
- [ ] Password must be ≥ 8 characters, contain at least 1 uppercase, 1 number, and 1 special character
- [ ] Password strength indicator is displayed in real time
- [ ] "Confirm Password" field shows error if it does not match `Password`

### AC-2: Duplicate Email Handling
- [ ] If the submitted email already exists, the API returns HTTP 409
- [ ] The UI displays: *"An account with this email already exists. [Log in instead?]"*
- [ ] The existing account is NOT exposed or enumerated beyond this message

### AC-3: Account Creation
- [ ] On valid submission, a new user record is created with `status: pending_verification`
- [ ] Password is stored as a bcrypt hash (cost factor ≥ 12); plaintext is never persisted
- [ ] A verification token (UUID v4, TTL 24 hours) is generated and stored

### AC-4: Verification Email
- [ ] A verification email is sent to the registered address within 30 seconds
- [ ] Email subject: *"Verify your E42-Test account"*
- [ ] Email contains a unique verification link: `https://app.e42test.com/verify?token={token}`
- [ ] Link expires after 24 hours
- [ ] A "Resend verification email" option is available on the confirmation screen

### AC-5: Email Verification
- [ ] Clicking the link sets user `status: active` and invalidates the token
- [ ] User is redirected to the dashboard with a success toast: *"Email verified! Welcome aboard."*
- [ ] Expired or invalid tokens show an error page with a resend option

### AC-6: Accessibility & UX
- [ ] All form fields have associated `<label>` elements
- [ ] Error messages are announced via `aria-live` regions
- [ ] Form is keyboard-navigable (Tab order is logical)
- [ ] Page meets WCAG 2.1 AA contrast requirements

## Technical Notes
- **API Endpoint:** `POST /api/v1/auth/register`
- **Email Service:** Use the existing `EmailService` (SendGrid adapter)
- **Token Storage:** Store verification tokens in `user_verification_tokens` table
- **Rate Limiting:** Max 5 registration attempts per IP per hour
- **Logging:** Log registration events (success/failure) to the audit log — no PII in log payloads

## Out of Scope
- OAuth / social login (covered in STORY-02-03)
- Multi-factor authentication (covered in EPIC-03)
- Admin-created accounts

## Dependencies
- `EmailService` must be configured with a valid SendGrid API key
- `user_verification_tokens` DB migration must be applied

## Definition of Done
- [ ] All ACs pass
- [ ] Unit tests cover happy path, duplicate email, and expired token scenarios (≥ 90% coverage)
- [ ] Integration test covers full registration → verification flow
- [ ] No high/critical security findings from SAST scan
- [ ] PR reviewed and approved by 1 peer + tech lead
- [ ] Feature flag `ff_email_registration` enabled in staging
