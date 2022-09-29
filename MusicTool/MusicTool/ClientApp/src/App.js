import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Scene } from './components/Scene';
import { DBTest } from './components/DBTest';
import { Login } from './components/Login';

import './custom.css'

export default class App extends Component {
    static displayName = App.name;

  render () {
      return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/scene/:creationID' component={Scene} />
        <Route path='/db-test' component={DBTest} />
        <Route path='/Login' component={Login} />
      </Layout>
    );
  }
}
