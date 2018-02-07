import React, { Component } from 'react';
import './Home.css';

const API = 'http://localhost:49625/api/config'

function inputChanged(ev) {
  console.log('Input Changed', ev)
}

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      host: 'Loading',
      path: '...',
      date: new Date()
    }
  }

  componentDidMount() {
    update()

    let self = this
    function update() {
      fetch(API)
        .then(response => response.json())
        .then(data => self.setState({
          host: 'http://localhost:' + data.port,
          path: data.buildPath,
          date: new Date(data.date)
        }))
        .catch(ex => console.error(ex))
    }

    this.updateTimer = setInterval(update, 500)
  }

  componentWillUnmount() {
    clearInterval(this.updateTimer)
  }

  render() {
    return (
      <div className="Home">
        <h1>Home</h1>
        <div className="Home-intro">
          <p>A pipeline tool for asset generation</p>
          <p>Current working directory:</p>
          <input name="cwd" value={this.state.path} className="Home-input" onChange={inputChanged} />
          <p>Host: {this.state.host}, Time: {this.state.date.getUTCHours()}:{this.state.date.getUTCMinutes()}:{this.state.date.getUTCSeconds()}</p>
        </div>
      </div>
    );
  }
}

export default Home;
