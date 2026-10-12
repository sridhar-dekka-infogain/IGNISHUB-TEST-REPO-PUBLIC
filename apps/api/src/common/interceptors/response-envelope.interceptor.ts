import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface ResponseEnvelope<T> {
  data: T;
  meta: Record<string, unknown>;
  errors: null;
}

/**
 * Wraps every successful controller response in the standard
 * `{ data, meta, errors }` envelope required by the API architecture.
 */
@Injectable()
export class ResponseEnvelopeInterceptor<T> implements NestInterceptor<T, ResponseEnvelope<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ResponseEnvelope<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        meta: {},
        errors: null,
      })),
    );
  }
}
