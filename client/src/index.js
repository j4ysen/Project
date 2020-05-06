import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import * as log from 'loglevel';

import RootRouter from './components/RootRouter';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import Config from './config';

log.setLevel(Config.logLevel);

const store = configureStore;

ReactDOM.render(
  <Provider store={store}>
    <RootRouter />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
