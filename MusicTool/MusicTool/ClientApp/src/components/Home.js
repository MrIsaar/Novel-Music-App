import React, { Component } from 'react';
import './Home.css';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
        <div>
            <h1>Welcome to Beat Drop Music Tool !</h1>
            <iframe src="UserGuide.html"></iframe>
        </div>
    );
  }
}
