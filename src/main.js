import 'babel-polyfill';
import FastClick from 'fastclick';

import React from 'react';
import ReactDom from 'react-dom';
// import {Provider} from 'react-redux';
// import store from '@/store/store';
import Route from './router';

import './assets/style/index.less';

FastClick.attach(document.body);
const container = document.getElementById('root');

const render = Component => {
  ReactDom.render(
    // 绑定redux、热加载
    // <Provider store={store}>
    <Component />,
    // </Provider>,
    container
  );
};

render(Route);

if (module.hot) {
  module.hot.accept();
}
