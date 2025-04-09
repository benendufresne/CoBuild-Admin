import { Observable, of, throwError } from "rxjs";
import { delay, mergeMap, retryWhen } from "rxjs/operators";

const DEFAULT_DELAY = 1000;
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_BACKOFF = 1000;

export const retryWithBackOff = (
  delayMs = DEFAULT_DELAY,
  maxRetry = DEFAULT_MAX_RETRIES,
  backOffMs = DEFAULT_BACKOFF
) => {
  let retries = maxRetry;
  return (src: Observable<any>) =>
    src.pipe(
      retryWhen((errors: Observable<any>) =>
        errors.pipe(
          mergeMap((error) => {
            if (error.status == 0) {
              if (retries-- > 0) {
                const backOffTime = delayMs + (maxRetry - retries) * backOffMs;
                return of(error).pipe(delay(backOffTime));
              }
              return throwError(error);
            }
            return throwError(error);
          })
        )
      )
    );
};
