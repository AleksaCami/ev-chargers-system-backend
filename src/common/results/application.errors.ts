export type ErrorObject<
  T extends string,
  U extends Record<string, unknown> | void = void,
> = {
  /**
   * Error code.
   */
  code: T;

  /**
   * Error description message. This can be treated as a fallback message if the translation fails.
   */
  message: string;

  /**
   * Arguments that can be passed to the translation service.
   */
  args?: Record<string, string>;
} & (U extends void
  ? Record<string, unknown>
  : {
    /**
     * Additional error details.
     */
    details: U;
  });

export type UnkownError = ErrorObject<'unkownError'>;
export function UnkownError(): UnkownError {
  return {
    code: 'unkownError',
    message:
      'Request completely failed, a team of highly diverse and gender-fluid humans are working on it.',
  };
}