import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'nprogress/nprogress.css';
import 'src/assets/css/prism.css';

import React from 'react';
import ReactDOM from 'react-dom';
import 'src/index.css';
import App from 'src/App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import { store, persistor } from 'src/stores';
import { PersistGate } from 'redux-persist/integration/react';



ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
