import Exception from './Exception';

export default class Unauthorized extends Exception {
  public constructor(message = 'no authorized.', details?: any) {
    super(message, 401, details);
  }
}