import {NumberValidator} from '#types/Validation';
import {validationMessages} from '#enums/validation';
import {isUndefined} from '#utils/types';

import BaseValidation from './BaseValidation';

export default class IntegerValidation extends BaseValidation<number, NumberValidator> {
  public validate(val: number, schema: NumberValidator): void {
    super.validate(val, schema);

    const {maximum, minimum} = schema;

    if (!isUndefined(maximum) && val > maximum) {
      this.errors.push(validationMessages.GREATER_THAN(maximum));
    }

    if (!isUndefined(minimum) && val < minimum) {
      this.errors.push(validationMessages.LESS_THAN(minimum));
    }
  }
}