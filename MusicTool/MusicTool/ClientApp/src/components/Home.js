import React, { Component } from 'react';
import './Home.css';

export class Home extends Component {
  static displayName = Home.name;

  render () {
      return (
          <div style={{ width: 1300, height: 900 }}>
            <h1>Welcome to Beat Drop Music Tool !</h1>
            <iframe src="UserGuide.html"></iframe>
        </div>
    );
  }
}
