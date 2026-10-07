---
artifactType: story
documentName: "STORY-01-04: User Profile Update"
publishId: ~
syncedAt: ~
activityId: epics-and-stories
destination: jira
artifactPath: ignis_artifacts/implementation-artifacts/story-01-04-profile-update.md
issueTypeName: Story
parentArtifactPath: ignis_artifacts/implementation-artifacts/epic-01-user-authentication.md
repoSyncStatus: not_synced
lastModified: ~
status: ready-for-dev
---

# STORY-01-04: User Profile Update

## User Story
**As a** logged-in user,  
**I want to** update my display name, avatar, and notification preferences,  
**So that** my account reflects my current identity and communication preferences.

## Context & Background
Profile management is a low-risk, high-satisfaction feature. Changes are applied immediately and reflected across the UI without requiring a page reload.

## Technical Notes
- **API Endpoints:** `PATCH /api/v1/users/me`, `PATCH /api/v1/users/me/preferences`
- **Avatar Storage:** Upload to S3-compatible bucket; store public CDN URL in `users.avatar_url`
- **Image Processing:** Use `sharp` library for server-side resize

## Definition of Done
- [ ] All ACs pass
- [ ] Unit tests for validation rules and avatar processing
- [ ] PR reviewed and approved
