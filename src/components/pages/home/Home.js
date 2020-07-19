import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      host: 'Loading',
      path: '...',
      date: new Date()
    }
  }

  render() {
    const model = this.props.model
    const config = (model && model.data && model.data.config) || {}
    config.date = new Date(Date.parse(config.date))

    return (
      <div className="Home">
        <h1>Home</h1>
        <div className="Home-intro">
          <p>A pipeline tool for asset generation</p>
          <p>Current working directory:</p>
          <pre className="Home-input">{config.workingPath}</pre>
          <p>API Host Port: {config.port}, Last updated: {config.date.toTimeString().substr(0,8)}</p>
        </div>
      </div>
    );
  }
}

export default Home;
