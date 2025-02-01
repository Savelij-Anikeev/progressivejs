import {BaseValidator as BaseSchema} from '#types/Validation';
import {ValidationException} from '#exceptions/index';
import {isArray} from '#utils/types';

import IntegerValidation from './IntegerValidation';
import StringValidation from './StringValidation';
import ObjectValidation from './ObjectValidation';
import ArrayValidation from './ArrayValidation';
import BaseValidation from './BaseValidation';
 
namespace ValidationFactory {
  export type Props = {
    schema?: BaseSchema 
  }
}

export default class ValidationFactory {
  private schema?: BaseSchema;
  private validator?: BaseValidation;

  public constructor({schema}: ValidationFactory.Props = {}) {
    if (schema) {
      this.setSchema(schema);
    }
  }

  public get Validation() {
    return this.validator;
  };

  public process(val: unknown) {
    if (!this.schema) {
      throw new ValidationException('ValidationFactory: schema is not specified');
    }
 
    if (
      typeof val !== this.schema.type &&
      ![null, undefined].includes(val as null | undefined) &&
      !isArray(val)
    ) {
      throw new ValidationException('ValidationFactory: value is not valid for schema');
    }

    this.Validation?.validate(val, this.schema);

    return this;
  }

  public setSchema(schema: BaseSchema) {
    this.schema = schema;
    this.validator = ValidationFactory.getValidationBy(schema);

    return this;
  }

  private static getValidationBy(schema: BaseSchema) {
    switch (schema.type) {
      case 'number':
        return new IntegerValidation();
      case 'string':
        return new StringValidation();
      case 'object':
        return new ObjectValidation();
      case 'array':
        return new ArrayValidation();
      default:
        return new BaseValidation();
    }
  }
}