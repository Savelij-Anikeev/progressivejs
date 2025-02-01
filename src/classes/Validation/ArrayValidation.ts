import {ArrayValidator} from '#types/Validation';
import {validationMessages} from '#enums/validation';
import {isUndefined} from '#utils/types';

import BaseValidation from './BaseValidation';

export default class ArrayValidation<T extends unknown = unknown>
extends BaseValidation<Array<T>, ArrayValidator> {
  public validate(val: Array<T>, schema: ArrayValidator): void {
    super.validate(val, schema);

    const {maxItems, minItems, uniqueItems} = schema;

    if (!isUndefined(maxItems) && val.length > maxItems) {
      this.errors.push(validationMessages.LENGTH_GREATER_THAN(maxItems));
    }

    if (!isUndefined(minItems) && val.length < minItems) {
      this.errors.push(validationMessages.LENGTH_LESS_THAN(maxItems));
    }

    if (!isUndefined(uniqueItems)) {
      const isUnique = new Set(val).size === val.length;

      !isUnique && this.errors.push(validationMessages.NOT_UNIQUE());
    }
  }
}