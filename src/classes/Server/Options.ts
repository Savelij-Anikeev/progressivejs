import {defaultServerOptions} from './consts';

namespace Options {
  export type Values = {
    port: number
  }
};

export default class Options {
  private options: Options.Values = defaultServerOptions;

  public setAll(options: Options.Values) {
    this.options = options;
  }

  public set<T extends keyof Options.Values>(key: T, val: Options.Values[T]) {
    this.options[key] = val;
  }

  public getBy<T extends keyof Options.Values>(...props: T[]) {
    return Object.fromEntries(
      Object.entries(this.options)
        .filter(([key]) => props.includes(key as T))
    );
  }
}