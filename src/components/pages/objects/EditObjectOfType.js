import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Objects.css'
import Icon from '../../icon/Icon'

class EditObjectOfType extends Component {
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
    const objectItem = objectItems.filter(n => n.id === objectId)[0] || {}
    const objectProperties = objectParent.properties || {}

    function renderItemProperties(item) {
      return Object.keys(objectProperties).map(key => {
        const itemValue = item[key]
        return <p className='ObjectProperty' key={`property-${key}`}><label>{key}</label><b>{itemValue}</b></p>
      })
    }

    return (
      <div className="Objects">
        <h1>Edit {objectSingular} : {objectItem.name || objectId}</h1>
        <div className="ButtonContainer" style={{marginTop: '-60px'}}>
          <p className="Buttons">
            <Link className="button default" to={`/objects/${objectPlural}/view/${objectId}`}><Icon id='book' margin='left' />View</Link>
            <Link className="button default" to={`/objects/${objectPlural}/delete/${objectId}`}><Icon id='trash-alt' margin='left' />Delete</Link>
          </p>
        </div>
        {renderItemProperties(objectItem)}
      </div>
    )
  }
}

export default EditObjectOfType
