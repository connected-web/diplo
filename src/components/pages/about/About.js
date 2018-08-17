import React, { Component } from 'react';

class About extends Component {
  render() {
    return (
      <div className="About">
        <h1>About Diplo</h1>
        <p>Diplo is a 3rd generation asset rendering pipeline for managing board game and computer game assets.</p>
        <p>It is a <b>browser based pipeline tool</b> run from a command line interface that creates useful assets from <b>data</b>, and <b>templates</b>.</p>
        <p>Diplo embodies the following principals:</p>
        <ul>
          <li>Content as data</li>
          <li>Templates applied to lists</li>
          <li>Differences trackable through source control</li>
        </ul>
      </div>
    );
  }
}

export default About;
