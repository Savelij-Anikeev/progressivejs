import Exception from './Exception';

export default class NotFound extends Exception {
  public constructor(message = 'not found.', details?: any) {
    super(message, 404, details);
  }
}