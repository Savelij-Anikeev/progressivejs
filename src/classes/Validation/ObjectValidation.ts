import {ObjectValidator} from '#types/Validation';
import {validationMessages} from '#enums/validation';
import {isUndefined} from '#utils/types';

import BaseValidation from './BaseValidation';

export default class ObjectValidation extends BaseValidation<object, ObjectValidator> {
  public validate(val: object, schema: ObjectValidator): void {
    super.validate(val, schema);

    const {requiredProps, additionalProperties, properties} = schema;

    if (!isUndefined(requiredProps) && requiredProps.length) {
      const _errors: string[] = [];

      requiredProps.forEach((k) => {
        if (k in val) {
          return;
        };

        _errors.push(k);
      });

      _errors.length && this.errors.push(validationMessages.REQUIRED_PROPS(_errors));
    }

    if (!isUndefined(additionalProperties) && additionalProperties && properties) {
      const _errors = Object.entries(val)
        .filter(([k]) => !(k in properties))
        .map(([k]) => k);
      
      _errors.length && this.errors.push(validationMessages.ADDITIONAL_PROPS(_errors));
    }
  }
}