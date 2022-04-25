import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Scene } from './components/Scene';
import { Cannon } from './components/Cannon';
import { ToneExample } from './components/ToneSetup'
import { Selection } from './components/Selection'
import { SequencerDemo } from './components/SequencerDemo';
import { PalletDemo } from './components/PalletDemo';
import Overlay from 'react-bootstrap/Overlay';
import { DBTest } from './components/DBTest';

import './custom.css'

export default class App extends Component {
    static displayName = App.name;

  render () {
      return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
            <Route path='/fetch-data' component={FetchData} />
              <Route path='/sequencer-demo' component={SequencerDemo} />
              <Route path='/cannon' component={Cannon} />
              <Route path='/scene/:creationID' component={Scene} />
              <Route path='/db-test' component={DBTest} />
              <Route path='/PalletDemo' component={PalletDemo} />
      </Layout>
    );
  }
}
