import {ArrayValidator} from '#types/Validation';
import {validationMessages} from '#enums/validation';
import {isUndefined} from '#utils/types';

import ValidationFactory from './ValidationFactory';
import BaseValidation from './BaseValidation';

export default class ArrayValidation<T extends unknown = unknown>
extends BaseValidation<Array<T>, ArrayValidator> {
  public validate(val: Array<T>, schema: ArrayValidator): void {
    super.validate(val, schema);

    const {maxItems, minItems, uniqueItems, items: childItems} = schema;

    if (!isUndefined(maxItems) && val.length > maxItems) {
      this.errors.push(validationMessages.LENGTH_GREATER_THAN(maxItems));
    }

    if (!isUndefined(minItems) && val.length < minItems) {
      this.errors.push(validationMessages.LENGTH_LESS_THAN(minItems));
    }

    if (!isUndefined(uniqueItems) && uniqueItems) {
      // #TODO: Use lodash. think about creating built-in util pack for frawework.
      const isUnique = new Set(val).size === val.length;

      !isUnique && this.errors.push(validationMessages.NOT_UNIQUE());
    }

    // check types of all elements
    // for 1 iter with reduce?
    const wrongTypeItems = val.filter((element) => typeof element !== childItems.type);
    const rightTypeItems = val.filter((element) => typeof element === childItems.type);

    if (wrongTypeItems.length) {
      this.errors.push(validationMessages.INVALID_ITEMS_TYPE(
        childItems.type,
        wrongTypeItems.map((_val) => typeof _val)
      ));
    }

    // validate all elements
    rightTypeItems.forEach((_val, idx) => {
      const _errors = new ValidationFactory({schema: childItems})
        .process(_val)
        .Validation?.errors || [];

      if (_errors.length) {
        this.errors.push(validationMessages.AT_INDEX(idx, _errors));
      }
    });
    // legko, profit
  }
}