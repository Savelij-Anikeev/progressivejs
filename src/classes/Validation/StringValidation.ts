import {StringValidator} from '#types/Validation';
import {validationMessages} from '#enums/validation';
import {isUndefined} from '#utils/types';

import BaseValidation from './BaseValidation';

export default class StringValidation extends BaseValidation<string, StringValidator> {
  public validate(val: string, schema: StringValidator): void {
    super.validate(val, schema);

    const {maxLength, minLength} = schema;

    if (!isUndefined(maxLength) && val.length > maxLength) {
      this.errors.push(validationMessages.LENGTH_GREATER_THAN(maxLength));
    }

    if (!isUndefined(minLength) && val.length < minLength) {
      this.errors.push(validationMessages.LENGTH_LESS_THAN(minLength));
    }
  }
}