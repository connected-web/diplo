import React, { Component } from 'react'
import './Objects.css'

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
    // const url = this.props.match.url
    const objectPlural = this.props.match.params.object
    const objectSingular = objectPlural.slice(0, -1)
    const objectParent = objects.filter(n => n.id === objectSingular)[0] || {}
    const objectItems = objectParent.items || []
    const objectProperties = objectParent.properties || {}

    let self = this

    function onIDChange(ev) {
      const value = (ev.target.value || '').trim().toLowerCase().replace(/[_\s]/g, '-').replace(/[^A-z\d-]/g, '')
      self.setState({value})
    }

    function renderPropertyInputs(objectProperties) {
      return Object.keys(objectProperties).map(key => {
        const inputType = objectProperties[key]
        const keyName = `input-${key}-${inputType}`

        function onPropertyChange(ev) {

        }

        return <pre className="ObjectProperty" key={keyName}>
          <label htmlFor={keyName}>{key}</label>
          <input name={keyName} onChange={onPropertyChange} /> : {inputType}
        </pre>
      })
    }

    return (
      <div className="Objects">
        <h1>
          <span>Add new {objectSingular}</span>
        </h1>
        <pre className="ObjectProperty">
          <label for="object-id">New Object ID</label>
          <input name="object-id" onChange={onIDChange} /> : This will be used in file names, and must be unique amongst other {objectSingular} types.
        </pre>
        <pre>Existing types: {objectItems.map(n => n.id).join(', ')}</pre>
        {(self.state.value) ? <pre className="ObjectProperty"><label htmlFor='input-id-string'>id</label> {self.state.value}</pre> : ''}
        {renderPropertyInputs(objectProperties)}
      </div>
    )
  }
}

export default AddObjectToType
