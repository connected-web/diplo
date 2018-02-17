import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../icon/Icon'

class AddObjectToType extends Component {
  constructor() {
    super()
    this.state = {
      value: ''
    }
  }

  render() {
    const model = this.props.model
    const objects = model.data.objects  || []
    const url = this.props.match.url
    const objectPlural = this.props.match.params.object
    const objectSingular = objectPlural.slice(0, -1)
    console.log('[AddObjectToType] objects', objects)
    const objectParent = objects.filter(n => n.id === objectSingular)[0] || {}
    const objectItems = objectParent.items || []

    let self = this

    function onChange(ev) {
      self.setState({value: ev.target.value})
    }

    return (
      <div className="Objects">
        <h1>
          <span>Add new {objectSingular}</span>
        </h1>
        <pre>Enter new Object ID: <input name="object-id" onChange={onChange} /> : Will be used in file names, must be unique amongst other {objectPlural}</pre>
        <pre>{self.state.value}</pre>
        <pre>Exiting types: {objectItems.map(n => n.id).join(', ')}</pre>
      </div>
    )
  }
}

export default AddObjectToType
