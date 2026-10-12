import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Marks a route/handler as requiring one of the given RBAC roles.
 * Enforced by `RolesGuard` (apps/api/src/common/guards/roles.guard.ts).
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
