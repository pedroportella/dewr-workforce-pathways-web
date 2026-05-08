export type ApiErrorCode = "UNKNOWN" | "NETWORK" | "TIMEOUT" | "HTTP";

export class ApiError<T = unknown> extends Error {
  code: ApiErrorCode;
  status?: number;
  details?: T;

  constructor(
    message: string,
    opts: { code: ApiErrorCode; status?: number; details?: T; cause?: unknown }
  ) {
    super(message);
    this.name = "ApiError";
    this.code = opts.code;
    this.status = opts.status;
    this.details = opts.details;
    this.cause = opts.cause;
  }
}
