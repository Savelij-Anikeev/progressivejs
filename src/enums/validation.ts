import {isArray} from '#utils/types';

export const validationMessages = {
  // BASE
  REQUIRED: () => 'property is null but value is undefined',
  NULLABLE: () => 'property is null but nullable is false',

  // number
  GREATER_THAN: (v?: number) => `value is greater than maximum that is ${v}`,
  LESS_THAN: (v?: number) => `value is less than minimum that is ${v}`,

  // string | array
  LENGTH_GREATER_THAN: (v?: number) => `length of value is greater than maximum that is ${v}`,
  LENGTH_LESS_THAN: (v?: number) => `length of value is less than minimum that is ${v}`,
  AT_INDEX: (idx: number, errors: string[]) => `at ${idx} index. errors: ${errors}`,

  // array
  NOT_UNIQUE: () => 'items are not unique',
  INVALID_ITEMS_TYPE: (desired?: string, actual?: string | string[]) =>
    `some items in array have invalid type. 
    desired type: ${desired}, actual type: ${isArray(actual) ? actual.join(', ') : actual}`,

  // object
  REQUIRED_PROPS: (v: string[]) => `those props are missed but required: ${v.join(', ')}`,
  ADDITIONAL_PROPS: (v: string[]) =>
    `those props are additional but additional props are not allowed: ${v.join(', ')}`,
  AT_KEY: (key: string, errors: string[]) => `at ${key}. errors: ${errors}`
} as const;