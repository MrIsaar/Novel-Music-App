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

import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/counter' component={Counter} />
                <Route path='/fetch-data' component={FetchData} />
                <Route path='/scene' component={Scene} />
                <Route path='/cannon' component={Cannon} />
                <Route path='/tonesetup' component={ToneExample} />
                <Route path='/selection' component={Selection} />
            </Layout>
        );
    }
}
