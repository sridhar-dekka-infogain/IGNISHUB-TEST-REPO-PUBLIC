import { SetMetadata } from '@nestjs/common';

export const AUDIT_LOG_EVENT_KEY = 'auditLogEvent';

/**
 * Marks a handler as emitting an audit log event (via `AuditLogInterceptor`)
 * once it completes successfully.
 */
export const AuditLog = (event: string) => SetMetadata(AUDIT_LOG_EVENT_KEY, event);
