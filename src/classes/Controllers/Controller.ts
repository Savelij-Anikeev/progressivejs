type Operation = (...args: any[]) => unknown | Promise<unknown>;

export default class Controller {
  public name: string;
  private operationMap: Map<string, Operation> = new Map();

  public constructor(name: string) {
    this.name = name;
  }
  
  public setOperation(name: string, op: Operation) {
    this.operationMap.set(name, op);

    return this;
  }

  public findOperation(name: string) {
    return this.operationMap.get(name);
  }
}