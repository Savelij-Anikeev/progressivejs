import {ObjectValidator} from '#types/Validation';
import {AnyObject} from '#types/common';
import {validationMessages} from '#enums/validation';
import {isUndefined} from '#utils/types';

import ValidationFactory from './ValidationFactory';
import BaseValidation from './BaseValidation';

export default class ObjectValidation extends BaseValidation<AnyObject, ObjectValidator> {
  public validate(val: AnyObject, schema: ObjectValidator): void {
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

    if (typeof val.properties !== 'object' || !schema.properties) {
      return;
    }

    // TODO: fix magic with || {}. it is nullable for some reason.
    Object.entries(val.properties || {}).forEach(([_key, _val]) => {
      const {[_key]: propSchema} = schema.properties ?? {};

      if (!propSchema) {
        return;
      }

      const _errors = new ValidationFactory({val: _val})
        .process(propSchema)
        .Validation
        ?.errors || [];

      if (_errors?.length) {
        this.errors.push(validationMessages.AT_KEY(_key, _errors));
      }
    });
  }
}