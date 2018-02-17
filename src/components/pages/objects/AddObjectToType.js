import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../icon/Icon'

class AddObjectToType extends Component {
  render() {
    const model = this.props.model
    const url = this.props.match.url
    const object = this.props.match.params.object

    return (
      <div className="Objects">
        <h1>
          <span>Add Object To {object}</span>
        </h1>
      </div>
    )
  }
}

export default AddObjectToType
