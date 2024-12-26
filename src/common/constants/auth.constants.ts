export const JWT_EXP_TIME_IN_SECONDS = 60 * 60 * 24 * 7;
export const ACCESS_TOKEN_EXP_TIME_IN_SECONDS = 60 * 60 * 24;
export const REFRESH_TOKEN_EXP_TIME_IN_SECONDS = 60 * 60 * 24 * 7;

export const PASSWORD_REGEX =
  '^(?=.*[a-z])(?=.*[A-Z])[\\w~@#$%^&*+=`|{}:;!.?\\"()\\[\\]\\-]{6,}$';
export const MIN_PASSWORD_LENGTH = 6;