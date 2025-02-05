import {Controller} from '#classes/Controllers';
import summon from './summon';

// создаем контроллер
const userController: Controller = new Controller('users')
  .setOperation('get', (v, ext) => {
    // все просто, v - params, которые передали в запросе,
    // ext в свою очередь коллекция расширений, например логгер, клиент бд
    // * все расширения в одном экземпляре на инстанс aka Singletone
    return {
      hui: 'zalupa'
    };
  })
  .setOperation('anotherOperation', (v, ext) => {
    return [
      {f: 1},
      {a: 2},
    ];
  });

// первый аргумент конфиг - туда можно передать ssl конфиг и тогда прибудет https
summon({}, ({registerController}) => {
  registerController(userController); // регистрируем контроллер
}).invoke(3000);