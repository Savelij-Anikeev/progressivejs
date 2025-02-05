import {isArray} from '#utils/types';

import Controller from './Controller';

export default class Controllers {
  private controllers: Controller[] = [];

  public registerController = (val: Controller | Controller[]) => {
    if (isArray(val)) {
      this.controllers.push(...val);
    
      return;
    }

    this.controllers.push(val);
  };

  public find(name: string) {
    return this.controllers.find(({name: _n}) => _n === name);
  } 
}