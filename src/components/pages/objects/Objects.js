import React, { Component } from 'react';

class Objects extends Component {
  render() {
    const model = this.props.model
    console.log('Object data', model.data.objects)

    function renderObjects(data) {
      data = data || {}

      function mapObjects(key) {
        const object = data[key] || {}
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
        {renderObjects(model.data.objects)}
      </div>
    )
  }
}

export default Objects;
