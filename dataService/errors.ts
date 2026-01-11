export type AppErrorCode =
  | 'CONTENT_LOCALE_DIR_MISSING'
  | 'CONTENT_DIR_SCAN_FAILED'
  | 'CONTENT_FILE_READ_FAILED'
  | 'CONTENT_MARKDOWN_PARSE_FAILED'
  | 'CONTACT_FORM_SUBMIT_FAILED';

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly context?: Record<string, unknown>;
  public readonly cause?: unknown;

  constructor(args: {
    code: AppErrorCode;
    message: string;
    context?: Record<string, unknown>;
    cause?: unknown;
  }) {
    super(args.message);
    this.name = 'AppError';
    this.code = args.code;
    this.context = args.context;
    this.cause = args.cause;
  }
}

