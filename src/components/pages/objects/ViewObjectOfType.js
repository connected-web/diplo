import React, { Component } from 'react'
import './Objects.css'

class ViewObjectOfType extends Component {
  constructor() {
    super()
    this.state = {
      saving: false,
      formErrors: true,
      notices: [],
      formData: {}
    }
  }

  render() {
    const model = this.props.model
    const objects = model.data.objects  || []
    // const url = this.props.match.url
    const objectPlural = this.props.match.params.object
    const objectSingular = objectPlural.slice(0, -1)
    const objectId = this.props.match.params.id
    const objectParent = objects.filter(n => n.id === objectSingular)[0] || {}
    const objectItems = objectParent.items || []
    const objectItem = objectItems.filter(n => n.id === objectId) || {}
    const objectProperties = objectParent.properties || {}

    return (
      <div className="Objects">
        <h1>View {objectSingular} : {objectId}</h1>
        <h3>Object item</h3>
        <pre>{JSON.stringify(objectItem, null, 2)}</pre>
        <h3>Object properties</h3>
        <pre>{JSON.stringify(objectProperties, null, 2)}</pre>
      </div>
    )
  }
}

export default ViewObjectOfType
