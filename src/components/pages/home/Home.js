import React, { Component } from 'react';
import './Home.css';

const API = '/api/config'

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
          host: API,
          path: data.workingPath,
          date: new Date(data.date)
        }))
        .catch(ex => console.error(ex))
    }

    this.updateTimer = setInterval(update, 5000)
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
          <p>API Host: {this.state.host}, Time: {this.state.date.toTimeString().substr(0,8)}</p>
        </div>
      </div>
    );
  }
}

export default Home;
