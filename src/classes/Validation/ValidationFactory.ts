import {isArray} from '#utils/types';
import {BaseValidator as BaseSchema} from '#types/Validation';

import IntegerValidation from './IntegerValidation';
import StringValidation from './StringValidation';
import ObjectValidation from './ObjectValidation';
import ArrayValidation from './ArrayValidation';
import BaseValidation from './BaseValidation';
 
namespace ValidationFactory {
  export type Props = {
    val?: unknown 
  }
}

export default class ValidationFactory {
  private val: unknown;
  private validator?: BaseValidation;

  public constructor({val}: ValidationFactory.Props = {}) {
    this.setValue(val);
  }

  public get Validation() {
    return this.validator;
  };

  public process(schema: BaseSchema) {
    this.Validation?.validate(this.val, schema);

    return this;
  }

  public setValue(val: unknown) {
    this.val = val;
    this.validator = ValidationFactory.getValidationBy(val);

    return this;
  }

  private static getValidationBy(val: unknown) {
    if (isArray(val)) {
      return new ArrayValidation();
    }

    switch (typeof val) {
      case 'number':
        return new IntegerValidation();
      case 'string':
        return new StringValidation();
      case 'object':
        return new ObjectValidation();
      default:
        return new BaseValidation();
    }
  }
}