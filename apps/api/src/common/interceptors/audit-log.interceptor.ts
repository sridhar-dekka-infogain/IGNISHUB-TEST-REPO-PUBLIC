import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { AUDIT_LOG_EVENT_KEY } from '../decorators/audit-log.decorator';
import { AuditLogService } from '../audit/audit-log.service';
import { AuthenticatedRequest } from '../types/authenticated-request';

/**
 * Reads the `@AuditLog(event)` metadata on the handler and, once the
 * handler completes successfully, records an audit log entry tagged with
 * the authenticated caregiver's ID.
 */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditLogService: AuditLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const event = this.reflector.get<string | undefined>(AUDIT_LOG_EVENT_KEY, context.getHandler());

    if (!event) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const actorId = request.user?.id ?? 'unknown';

    return next.handle().pipe(
      tap(() => {
        void this.auditLogService.record({ event, actorId });
      }),
    );
  }
}
