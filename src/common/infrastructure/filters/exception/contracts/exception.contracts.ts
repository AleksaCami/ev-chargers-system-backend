export type TContext = {
  priority?: number;
  translationKey?: string;
  args?: any;
};

export type TContexts = {
  [type: string]: TContext;
};

export type HttpExceptionData = {
  // HTTP Status code.
  statusCode: number;
  // Moment of the exception.
  timestamp: Date;
  // Error code that can be used to further identify an error.
  errorCode?: string;
  // A single level error message.
  errorMessage?: string;
  // Nested error messages.
  errors?: Record<string, string>;
  // DTO that throw the error.
  targetDto?: string;
  // Additional details that can be passed.
  details?: string;
};
