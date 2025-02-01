export type PrimitiveType = 'string' | 'number' | 'boolean' | 'null' | 'undefined';

interface BooleanValidator extends BaseValidator {
  type: 'boolean';
}

export interface BaseValidator {
  type: PrimitiveType | 'object' | 'array';
  required?: boolean;
  nullable?: boolean;
}

export interface StringValidator extends BaseValidator {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  enum?: string[];
}

export interface NumberValidator extends BaseValidator {
  type: 'number';
  minimum?: number;
  maximum?: number;
}

export interface ArrayValidator extends BaseValidator {
  type: 'array';
  'items': SchemaValidator;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

export interface ObjectValidator extends BaseValidator {
  type: 'object';
  properties?: Record<string, SchemaValidator>;
  requiredProps?: string[];
  additionalProperties?: boolean;
}

export type SchemaValidator =
  | StringValidator
  | NumberValidator
  | BooleanValidator
  | ArrayValidator
  | ObjectValidator;