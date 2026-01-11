export type DataServiceErrorCode =
  | 'CONTENT_LOCALE_DIR_MISSING'
  | 'CONTENT_DIR_SCAN_FAILED'
  | 'CONTENT_FILE_READ_FAILED';

export class DataServiceError extends Error {
  public readonly code: DataServiceErrorCode;
  public readonly context?: Record<string, unknown>;
  public readonly cause?: unknown;

  constructor(args: {
    code: DataServiceErrorCode;
    message: string;
    context?: Record<string, unknown>;
    cause?: unknown;
  }) {
    super(args.message);
    this.name = 'DataServiceError';
    this.code = args.code;
    this.context = args.context;
    this.cause = args.cause;
  }
}

