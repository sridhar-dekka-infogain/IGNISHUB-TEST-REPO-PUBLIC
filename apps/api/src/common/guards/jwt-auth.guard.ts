import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedRequest, AuthenticatedUser } from '../types/authenticated-request';

/**
 * Placeholder JWT auth guard.
 *
 * Epic 2 owns the real JWT verification/auth module. This repo does not
 * yet have that module scaffolded, so this guard provides the minimum
 * contract every endpoint in this story needs: reject unauthenticated
 * requests with 401, and populate `request.user` for downstream guards
 * (`RolesGuard`, `CaregiverApprovedGuard`) when authenticated.
 *
 * Tokens are expected as `Authorization: Bearer <base64-json-payload>`
 * where the payload matches `AuthenticatedUser`. Replace this guard's
 * implementation with real JWT verification once Epic 2's auth module
 * lands — its public contract (populating `request.user`) stays the same.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = (request as unknown as { headers: Record<string, string | undefined> }).headers?.[
      'authorization'
    ];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header.');
    }

    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException('Missing or invalid Authorization header.');
    }

    const user = this.decode(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    request.user = user;
    return true;
  }

  private decode(token: string): AuthenticatedUser | null {
    try {
      const json = Buffer.from(token, 'base64').toString('utf-8');
      const parsed = JSON.parse(json);
      if (!parsed || typeof parsed.id !== 'string' || typeof parsed.role !== 'string') {
        return null;
      }
      return parsed as AuthenticatedUser;
    } catch {
      return null;
    }
  }
}
