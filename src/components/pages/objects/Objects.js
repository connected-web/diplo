import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../icon/Icon'

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
              <h2>
                <span>{object.id}s</span>
                <Link className="button default" to={`/objects/${object.id}s/add`}>Add<Icon id='plus' margin='right' /></Link>
              </h2>
              <pre>{JSON.stringify(object.properties, null, 2)}</pre>
              {object.items.map(renderObject)}
            </div>
          )
        })
    }

    return (
      <div className="Objects">
        <h1>
          <span>Objects</span>
          <Link className="button default" to="/objects/create">Add<Icon id='plus' margin='right' /></Link>
        </h1>
        {renderObjects(model.data.objects)}
      </div>
    )
  }
}

export default Objects;
