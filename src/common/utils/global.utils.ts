/**
 * Checks is value empty, null or undefined.
 * If value is array, checks if the length of the array is greater than zero.
 * If values is an object, checks if the object has any key defined.
 * @param value - Value to be checked.
 * @returns Is value empty boolean.
 */
export const isEmpty = (value: any): boolean => {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    value === 'null' ||
    value === 'undefined'
  ) {
    return true;
  }

  // Validate the lenght of array.
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  // Check if object has any key defined
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return false;
    return !objectHasAnyKey(value, Object.keys(value));
  }

  return false;
};

/**
 * Checks if value is not equal to undefined.
 * @param value - Value to be checked.
 * @returns Is value defined.
 */
export const isDefined = (value: any): boolean => {
  return value !== undefined;
};

/**
 * Determines if the given object has at least one of the given keys defined.
 * @param object - Object to evaluate.
 * @param keys - Object keys array.
 * @returns Object has at least one key defined.
 */
export const objectHasAnyKey = (
  object: Record<string, any>,
  keys: string[],
): boolean => {
  if (keys.length === 0) return true;

  for (const key of keys) {
    if (isDefined(object[key])) return true;
  }

  return false;
};

