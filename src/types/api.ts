import {Extensions} from '#classes/Extensions';
import {Context} from '#classes/types';
import {Methods} from '#enums/api';
import {SchemaValidator} from './Validation';

type Base = {
  body?: any;
  params?: any;
  result: any;
}

export type RouteArray = {
  url: string,
  method: Methods['all'],
  handler: Handler
}[]

export type Handler<S extends Base = Base> = (
  vars: {
    body: S['body'],
    params: S['params']
  },
  exts: Extensions['exts'],
  ctx: Context
) => S['result'] | Promise<S['result']>;

export type Spec = {
  params?: unknown;
  body?: unknown;
  result: unknown;
}

export type Specs = {
  [k: string]: Spec
}

export type Validators = {
  [k: string]: {
    params?: SchemaValidator;
    body?: SchemaValidator;
    result: SchemaValidator;
  }
}