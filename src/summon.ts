import {App} from '#classes/App';
import {Controllers} from '#classes/Controllers';

type SummonProps = {
  sslSettings?: {
    key: string;
    cert: string;
  }
}

type Clb = ({registerController} : {
  registerController: Controllers['registerController']
}) => void

const summon = ({sslSettings}: SummonProps, clb?: Clb) => {
  const controllers = new Controllers();

  clb?.({
    registerController: controllers.registerController
  });

  const app = new App({sslSettings, controllers});

  return app;
};

export default summon;