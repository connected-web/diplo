import React, { Component } from 'react';

class Objects extends Component {
  render() {
    const model = this.props.model

    function renderObjects(objects) {
      objects = objects || []

      function renderObject(data) {
        return (
          <div key={data.id}>
            <h3>{data.id}</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )
      }

      return objects.map(object => {
          return (
            <div key={object.id}>
              <h2>{object.id}s</h2>
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
