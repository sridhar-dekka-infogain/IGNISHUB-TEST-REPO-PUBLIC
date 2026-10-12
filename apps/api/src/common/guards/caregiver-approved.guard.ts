import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthenticatedRequest } from '../types/authenticated-request';

/**
 * Introduced in Story 2.3. Only caregivers whose profile status is
 * APPROVED may access the decorated route — PENDING/REJECTED caregivers
 * are forbidden. Must run after `JwtAuthGuard` + `RolesGuard` so that
 * `req.user` is already populated.
 */
@Injectable()
export class CaregiverApprovedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || user.role !== 'Caregiver') {
      throw new ForbiddenException('Only caregivers may access this resource.');
    }

    if (user.caregiverStatus !== 'APPROVED') {
      throw new ForbiddenException(
        'Only APPROVED caregivers may manage availability. Your caregiver profile is not yet approved.',
      );
    }

    return true;
  }
}
