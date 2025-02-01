import {NumberValidator} from '#types/Validation';
import {ValidationFactory} from '#classes/Validation';

describe('Validation', () => {
  describe('IntegerValidation', () => {
    const factory = new ValidationFactory();

    it('should validate number', () => {
      const testVal = 2;
      const schema: NumberValidator = {
        type: 'number',
        minimum: 1,
        maximum: 3,
      }

      factory.setValue(testVal).process(schema);
    })
  })
});