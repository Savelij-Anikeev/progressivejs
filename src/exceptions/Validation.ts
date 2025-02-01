import Exception from './Exception';

export default class Validation extends Exception {
  public constructor(message = 'validation error.', details?: any) {
    super(message, 400, details);
  }
}