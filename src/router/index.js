import React, { Component } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import { hot } from 'react-hot-loader';

// import Home from '@/pages/home'
// import About from '@/pages/about'

function Loading() {
  return <div>Loading...</div>;
}

const Home = Loadable({
  loader: () => import('@/pages/home'),
  loading: Loading
});

const About = Loadable({
  loader: () => import('@/pages/about'),
  loading: Loading
});

// react-router4 不再推荐将所有路由规则放在同一个地方集中式路由，子路由应该由父组件动态配置，组件在哪里匹配就在哪里渲染，更加灵活
class RouteConfig extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Redirect to="/" />
        </Switch>
      </HashRouter>
    );
  }
}
export default hot(module)(RouteConfig);
