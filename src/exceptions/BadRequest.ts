import Exception from './Exception';

export default class BadRequest extends Exception {
  public constructor(message = 'bad request.', details?: any) {
    super(message, 400, details);
  }
}