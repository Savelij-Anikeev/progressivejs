import {
  ArrayValidator,
  NumberValidator,
  StringValidator,
  ObjectValidator,
  BaseValidator
} from '#types/Validation';
import {ValidationFactory} from '#classes/Validation';
import {validationMessages} from '#enums/validation';
import {ValidationException} from '#exceptions/index';

describe('Validation', () => {
  const factory = new ValidationFactory();

  describe('BaseValidation', () => {
    it('should validate base validation successfully', () => {
      const testVal = 'property';
      const schema: BaseValidator = {
        type: 'string',
        required: true,
        nullable: false
      }

      factory.setSchema(schema).process(testVal);
      
      expect(factory.Validation?.errors).toStrictEqual([]);
    })
    it.each([
      [true, true, undefined, validationMessages.REQUIRED()],
      [false, false, null, validationMessages.NULLABLE()],
    ])('should have validation errors', (required, nullable, val, msg) => {
      factory.setSchema({type: 'number', required, nullable} as BaseValidator).process(val);
      
      expect(factory.Validation?.errors).toContainEqual(msg);
    })
  });

  describe('IntegerValidation', () => {
    it('should validate number successfully', () => {
      const testVal = 2;
      const schema: NumberValidator = {
        type: 'number',
        minimum: 1,
        maximum: 3,
      }

      factory.setSchema(schema).process(testVal);
      
      expect(factory.Validation?.errors).toStrictEqual([]);
    })
    it.each([
      [1, undefined, 0, validationMessages.LESS_THAN(1)],
      [undefined, 2, 3, validationMessages.GREATER_THAN(2)],
    ])('should have validation errors', (minimum, maximum, val, msg) => {
      factory.setSchema({type: 'number', minimum, maximum} as NumberValidator).process(val);
      
      expect(factory.Validation?.errors).toContainEqual(msg);
    })
  });

  describe('StringValidation', () => {
    it('should validate string successfully', () => {
      const testVal = 'text';
      const schema: StringValidator = {
        type: 'string',
        minLength: 3,
        maxLength: 8
      }

      factory.setSchema(schema).process(testVal);
      
      expect(factory.Validation?.errors).toStrictEqual([]);
    })
    it.each([
      [6, 12, 'some long text that is...', validationMessages.LENGTH_GREATER_THAN(12)],
      [6, 10, 'short', validationMessages.LENGTH_LESS_THAN(6)],
    ])('should have validation errors', (minLength, maxLength, val, msg) => {
      factory.setSchema({type: 'string', minLength, maxLength} as StringValidator).process(val);
      
      expect(factory.Validation?.errors).toContainEqual(msg);
    })
  });

  describe('ArrayValidation', () => {
    // array
    it('should validate array successfully', () => {
      const testVal = [1, 1, 2, 3, 4, 5];
      const schema: ArrayValidator = {
        type: 'array',
        maxItems: 10,
        minItems: 1,
        uniqueItems: false,
        items: {
          type: 'number'
        }
      };

      factory.setSchema(schema).process(testVal);
      
      expect(factory.Validation?.errors).toStrictEqual([]);
    });
    it.each([
      [1, 10, true, {type: 'number'}, validationMessages.NOT_UNIQUE()],
      [10, 100, false, {type: 'number'}, validationMessages.LENGTH_LESS_THAN(10)],
      [1, 3, false, {type: 'number'}, validationMessages.LENGTH_GREATER_THAN(3)]
    ])(
      'should not accept data cause it\'s not valid',
      (minItems, maxItems, uniqueItems, items, msg) => {
        const testVal = [1, 1, 2, 3, 4, 5];
        const schema: ArrayValidator = {
          type: 'array',
          maxItems,
          minItems,
          uniqueItems,
          items: items as NumberValidator
        };

        factory.setSchema(schema).process(testVal);
        
        expect(factory.Validation?.errors).toContainEqual(msg);
      }
    );

    // item related
    it('should fail validation cause some items are not desired type', () => {
      const testVal: unknown[] = [1, 2, 3, 'just a prank, bro'];
      const schema: ArrayValidator = {
        type: 'array',
        minItems: 1,
        items: {
          type: 'number'
        }
      }

      factory.setSchema(schema).process(testVal);

      expect(factory.Validation?.errors).toContainEqual(
        validationMessages.INVALID_ITEMS_TYPE('number', 'string')
      );

      testVal.push({});
      factory.setSchema(schema).process(testVal);

      expect(factory.Validation?.errors).toContainEqual(
        validationMessages.INVALID_ITEMS_TYPE('number', ['string', 'object'])
      );
    });

    it(`
      should fail validation cause
      some items have desired type but other checks
    `, () => {
      const testVal: unknown[] = [-1, 1, 2, 3, 1000];
      const schema: ArrayValidator = {
        type: 'array',
        minItems: 1,
        items: {
          type: 'number',
          minimum: 1,
          maximum: 3
        }
      }

      factory.setSchema(schema).process(testVal);
      expect(factory.Validation?.errors).toContainEqual(
        validationMessages.AT_INDEX(0, [validationMessages.LESS_THAN(1)])
      );
      expect(factory.Validation?.errors).toContainEqual(
        validationMessages.AT_INDEX(4, [validationMessages.GREATER_THAN(3)])
      );
    });
  });

  describe('ObjectValidation', () => {
    it('should be ok :)', () => {
      const testVal = {
        name: 'John',
        age: 19,
        phoneNumber: 89992281337
      };
      const schema: ObjectValidator = {
        type: 'object',
        additionalProperties: false,
        requiredProps: [
          'name',
          'age'
        ],
        properties: {
          name: {
            type: 'string',
            minLength: 3
          },
          age: {
            type: 'number',
            minimum: 18
          },
          phoneNumber: {
            type: 'number',
            minimum: 89000000000,
            maximum: 89999999999
          }
        }
      }

      factory.setSchema(schema).process(testVal);
      expect(factory.Validation?.errors).toStrictEqual([]);
    });

    it('should not be ok :)', () => {
      // const testVal = {
      //   name: 'John',
      //   age: 19,
      //   phoneNumber: 89992281337
      // };
      const testVal = 'asda';
      const schema: ObjectValidator = {
        type: 'object',
        additionalProperties: false,
        requiredProps: [
          'name',
          'age'
        ],
        properties: {
          name: {
            type: 'string',
            minLength: 3
          },
          age: {
            type: 'number',
            minimum: 18
          },
          phoneNumber: {
            type: 'number',
            minimum: 89000000000,
            maximum: 89999999999
          }
        }
      }

      try {
        factory.setSchema(schema).process(testVal);

        throw new Error();
      } catch (err) {
        expect(err).toBeInstanceOf(ValidationException)
      }
    });
  })
});