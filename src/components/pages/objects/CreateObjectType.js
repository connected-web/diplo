import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../icon/Icon'

class CreateObjectType extends Component {
  render() {
    const model = this.props.model

    return (
      <div className="Objects">
        <h1>
          <span>Create New Object Type</span>
        </h1>
      </div>
    )
  }
}

export default CreateObjectType
