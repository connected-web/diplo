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

    let self = this

    // const url = this.props.match.url
    const objectPlural = this.props.match.params.object
    const objectSingular = objectPlural.slice(0, -1)
    const objectId = this.props.match.params.id
    const objectParent = objects.filter(n => n.id === objectSingular)[0] || {}
    const objectItems = objectParent.items || []
    const objectItem = objectItems.filter(n => n.id === objectId)[0] || {}
    const objectProperties = objectParent.properties || {}

    function testFieldValue(key) {
      return self.state.formData[key] ? false : true
    }

    function checkForFormErrors() {
      const errors = Object.keys(objectProperties).map(testFieldValue).filter(n => n)

      if (errors.length) {
        self.setState({notices: ['Please complete the form'], formErrors: true})
      }
      else {
        self.setState({notices: [], formErrors: false})
      }
    }
    function renderItemProperties(item) {
      return Object.keys(objectProperties).map(key => {
        const itemValue = item[key]

        function onPropertyChange(ev) {
          const formData = self.state.formData
          formData[key] = ev.target.value
          self.setState({
            formData
          })
          checkForFormErrors()
        }
        
        return <p className='ObjectProperty' key={`property-${key}`}><label>{key}</label><input type='text' value={itemValue} onChange={onPropertyChange} /></p>
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
