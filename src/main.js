import 'babel-polyfill';
import FastClick from 'fastclick';
import { AppContainer } from 'react-hot-loader';

import './assets/style/index.less'

import React from 'react';
import ReactDom from 'react-dom';
// import {Provider} from 'react-redux';
// import store from '@/store/store';
import Route from './router';

FastClick.attach(document.body);

const container = document.getElementById('root');

const render = Component => {
  ReactDom.render(
    //绑定redux、热加载
   // <Provider store={store}>
      <AppContainer>
        <Component />
      </AppContainer>,
    //</Provider>,
    container,
  )
};

render(Route);


// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./router', () => {
    console.log('Accepting the updated printMe module!');
    render(Route);
  })
}
