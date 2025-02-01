import {default as http, IncomingMessage, ServerResponse} from 'http';

import {BadRequestException} from '#exceptions/index';

import Options from './Options';

export default class Server {
  private _instance?: http.Server;
  private _options: Options = new Options();

  public get Options() {
    return this._options;
  } 

  public run() {
    this._instance = http.createServer(this.handlerRequest.bind(this));

    this._instance.listen();
  }

  private async handlerRequest(req: IncomingMessage, res: ServerResponse) {
    const {method, url} = req;

    if (!method || !url) {
      throw new BadRequestException('method and url must be specified.');
    }
  }
}