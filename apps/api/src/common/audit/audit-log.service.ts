import { Injectable, Logger } from '@nestjs/common';

export interface AuditLogEntry {
  event: string;
  actorId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Minimal audit log sink. In production this persists to the audit log
 * store (Epic 1). Kept as an injectable service so it can be mocked in
 * unit/integration tests.
 */
@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  async record(entry: AuditLogEntry): Promise<void> {
    this.logger.log(`AUDIT ${entry.event} actor=${entry.actorId} ${JSON.stringify(entry.metadata ?? {})}`);
  }
}
