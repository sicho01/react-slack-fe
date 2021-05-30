import React from 'react';
import { Switch, Redirect, Route } from 'react-router';
import loadable from '@loadable/component';

const Login = loadable(() => import('@pages/login'));
const Signup = loadable(() => import('@pages/signup'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/workspace/:workspace" component={Workspace} />
    </Switch>
  );
};

export default App;
