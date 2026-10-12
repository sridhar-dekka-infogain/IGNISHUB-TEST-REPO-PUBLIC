/**
 * Shape of `req.user` populated by the JWT auth guard (Epic 2) after a
 * token has been verified. Only the fields this module depends on are
 * declared here.
 */
export interface AuthenticatedUser {
  id: string;
  role: 'Caregiver' | 'CareSeeker' | 'Admin';
  /** Caregiver approval status — only present when role === 'Caregiver'. */
  caregiverStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface AuthenticatedRequest {
  user: AuthenticatedUser;
}
