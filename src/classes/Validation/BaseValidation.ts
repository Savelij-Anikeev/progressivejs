import {BaseValidator} from '#types/Validation';
import {validationMessages} from '#enums/validation';
import {isUndefined} from '#utils/types';

export interface Validator<T, D> {
  errors: string[];

  validate(val: T, schema: D): void;
}

export default class BaseValidation<
  T extends unknown = unknown,
  D extends BaseValidator = BaseValidator
  >
implements Validator<T, D> {
  public errors: string[] = [];

  public validate(val: T, schema: D): void {
    const {required, nullable} = schema;

    if (!isUndefined(required) && required && val === undefined) {
      this.errors.push(validationMessages.REQUIRED());
    }

    if (!isUndefined(nullable) && !nullable && val === null) {
      this.errors.push(validationMessages.NULLABLE());
    }

    if (this.errors.length) {
      // there is no urge to validate speciefic props for type
      // if basic validation is failed

      return;
    }
  }
}