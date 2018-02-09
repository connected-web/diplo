import React, { Component } from 'react';

const API = '/api/objects'

class Objects extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    update()

    let self = this
    function update() {
      fetch(API)
        .then(response => response.json())
        .then(data => self.setState(data))
        .catch(ex => console.error(ex))
    }
  }

  componentWillUnmount() {
  }

  render() {
    function renderObjects(data) {

      function mapObjects(key) {
        const object = data[key]
        return {
          title: key,
          rows: Object.keys(object)
        }
      }

      return Object.keys(data)
        .map(mapObjects)
        .map(object => {
          return (
            <div key={object.title}>
              <h2>{object.title}</h2>
              {object.rows.map(row => (<p key={row}>{row}</p>))}
            </div>
          )
        })
    }

    return (
      <div className="Objects">
        <h1>Objects</h1>
        {renderObjects(this.state)}
      </div>
    )
  }
}

export default Objects;
