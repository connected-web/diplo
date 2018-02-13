import React, { Component } from 'react';

class Objects extends Component {
  render() {
    const model = this.props.model

    function renderObjects(data) {
      data = data || {}

      function mapObjects(id) {
        const object = data[id] || {}
        return {
          id: id,
          properties: object.properties,
          items: object.items
        }
      }

      function renderObject(data) {
        return (
          <div key={data.id}>
            <h3>{data.id}</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )
      }
      return Object.keys(data)
        .map(mapObjects)
        .map(object => {
          return (
            <div key={object.id}>
              <h2>{object.id}</h2>
              <pre>{JSON.stringify(object.properties, null, 2)}</pre>
              {object.items.map(renderObject)}
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
