import { isEmpty } from './global.utils';

/**
 * Capitalizes the given string;
 * @param value - String.
 * @returns Capitalized string.
 */
export const capitalizeString = (value: string): string => {
  if (isEmpty(value)) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};
