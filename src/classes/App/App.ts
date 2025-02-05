import http from 'http';
import https from 'https';

import {BadRequestException} from '#exceptions/index';
import {Controllers} from '#classes/Controllers';
import {ValidationFactory} from '#classes/Validation';
import {SchemaValidator} from '#types/Validation';
import {AnyObject} from '#types/common';
import {hasProp} from '#utils/types';

type Props = {
  sslSettings?: {
    key: string;
    cert: string;
  }
  controllers: Controllers;
}

type ValidRequest = {
  controller: string;
  operation: string;
  params: AnyObject;
}

type ValidRequestMulti = {
  isParallel: boolean,
  stopOnError: boolean,
  calls: ({id: number} & ValidRequest)[]
}

type ValidResponse = {
  controller: string;
  operation: string;
  // status: number;
  result?: unknown;
  errors?: string[];
  id?: number;
}

export default class App {
  private sslSettings;
  private validation;
  private controllers;

  public constructor({sslSettings, controllers}: Props) {
    this.sslSettings = sslSettings;
    this.controllers = controllers;
    
    this.validation = new ValidationFactory();
  }

  public invoke(port?: number, clbk?: () => void) {
    const {sslSettings} = this;
    const server = sslSettings ?
      https.createServer(this.handleRequest.bind(this)) :
      http.createServer(this.handleRequest.bind(this));

    return server.listen(port, clbk);
  }

  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
      let body: string;
      let statusCode: number;
      let response;

      req.on('data', (_data) => body = body ? body + _data : _data);
      req.on('end', async() => {
        try {
          if (!body || typeof body !== 'object') {
            throw new BadRequestException('invalid body for request');
          }

          const _prepared = this.prepareRequestBody(JSON.parse(body));
          const _isMultiple = hasProp(_prepared, 'calls');
          const _req = _isMultiple ?
            _prepared as ValidRequestMulti :
            {calls: [_prepared]} as ValidRequestMulti;

          let result: ValidResponse[] = [];

          if (!_req.isParallel) {
            for (const _call of _req.calls) {
              const _callResult = await this.invokeOne(_call);

              result.push(_callResult);

              if (_req.stopOnError && _callResult.errors?.length) {
                const ranIds = new Set(result.map(({id}) => id)) as Set<number>;

                result.push(..._req.calls.reduce<any[]>((total, c) => {
                  if (ranIds.has(c.id)) {
                    return total;
                  }

                  total.push(c);

                  return total;
                }, []));
              }
            }
          } else {
            result = await Promise.all(_req.calls.map((_c) => this.invokeOne(_c)));
          }
        
          response = _isMultiple ? result : result[0];
        } catch (error) {

          if (error instanceof BadRequestException) {
            response = error.message;
            statusCode = error.statusCode;
          } else {
            response = `internal error ${error}`;
            statusCode = 500;
          }
        }

        res.writeHead(statusCode ?? 200, {'content-type': 'application/json'});
        res.end(JSON.stringify(response));
      });
  }

  private prepareRequestBody(body: unknown) {
    const base: SchemaValidator = {
      'type': 'object',
      required: true,
      requiredProps: [
        'controller',
        'operation',
        'params'
      ],
      properties: {
        controller: {
          'type': 'string'
        },
        operation: {
          'type': 'string'
        },
        params: {
          'type': 'object'
        }
      }
    };
    const multiple: SchemaValidator = {
      type: 'object',
      required: true,
      requiredProps: [
        'calls'
      ],
      properties: {
        isParallel: {
          type: 'boolean'
        },
        stopOnError: {
          type: 'boolean'
        },
        calls: {
          type: 'array',
          'items': base
        }
      }
    };

    const isMultiple = hasProp(body, 'calls');
    const schema: SchemaValidator = isMultiple ? multiple : base;
    const errors = this.validation.setSchema(schema).process(body).Validation?.errors;

    if (errors?.length) {
      throw new BadRequestException(`request message is invalid: ${errors}`);
    }

    // give idx's to each call
    if (isMultiple) {
      const _body = (body as ValidRequestMulti); 

      _body.calls = _body.calls.map((call, i, array) => {
        const prevId = array[i-1]?.id ?? 0;

        call.id = prevId + 1;

        return call;
      });
    }

    return isMultiple ? body as ValidRequestMulti : body as ValidRequest;
  }

  private async invokeOne({controller, operation, params}: ValidRequest): Promise<ValidResponse> {
    const _controller = this.controllers.find(controller);

    if (!_controller) {
      throw new BadRequestException(`controller #${controller} no found`);
    }

    const _operation = _controller.findOperation(operation);

    if (!_operation) {
      throw new BadRequestException(`
        operation #${operation} of controller #${controller} no found`);
    }

    const _common: ValidResponse = {
      controller,
      operation
    };

    try {
      const _r = await _operation(params);
      
      return {
        ..._common,
        result: _r
      };
    } catch (_e) {
      return {
        ..._common,
        errors: [_e as string]
      };
    }
  }
}