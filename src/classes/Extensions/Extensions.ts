import {Extension} from './ifaces';

namespace Extensions {
  export type Props = {
    [k: string]: unknown
  }
}

export default class Extensions {
  private extensions: Map<Extension['name'], Extension> = new Map();

  public get exts() {
    return this.extensions;
  }

  public add(newExtension: Extension) {
    this.extensions.set(newExtension.name, newExtension);
  }

  public removeBy(name: string) {
    this.extensions.delete(name);
  }
}