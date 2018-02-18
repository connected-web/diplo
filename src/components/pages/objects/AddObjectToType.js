import React, { Component } from 'react'
import './Objects.css'

class AddObjectToType extends Component {
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
    const objectParent = objects.filter(n => n.id === objectSingular)[0] || {}
    const objectItems = objectParent.items || []
    const objectProperties = objectParent.properties || {}

    let self = this

    function onIDChange(ev) {
      const id = (ev.target.value || '').trim().toLowerCase().replace(/[_\s]/g, '-').replace(/[^A-z\d-]/g, '')
      const formData = self.state.formData;
      formData.id = id

      checkForFormErrors()
      self.setState({
        formData
      })
    }

    function saveFormData(ev) {
      console.log('Submit form data...')
      self.setState({saving: true})

      setTimeout(() => {
        self.setState({saving: false, formErrors: true})
      }, 1500)

      setTimeout(() => {
        self.setState({formErrors: false})
      }, 3000)
    }

    function testFieldValue(key) {
      const fieldType = objectProperties[key]
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

    function renderPropertyInputs(objectProperties) {
      return Object.keys(objectProperties).map(key => {
        const fieldType = objectProperties[key]
        const keyName = `input-${key}-${fieldType}`
        const disabled = self.state.saving

        function onPropertyChange(ev) {
          const formData = self.state.formData
          formData[key] = ev.target.value
          self.setState({
            formData
          })
          checkForFormErrors()
        }

        return <p className='ObjectProperty' key={keyName}>
          <label htmlFor={keyName}>{key}</label>
          <input name={keyName} onChange={onPropertyChange} disabled={disabled} /> : {fieldType}
          {testFieldValue(key) ? <b className='notice warning'>Field empty</b> : ''}
        </p>
      })
    }

    function renderButtons() {
      const saveButton = <a onClick={saveFormData} className='button positive' key='saveObject'>Save</a>
      const savingButton =  <a className='button disabled' key='button-saving'>Saving...</a>
      const saveDisabled = <a className='button disabled' key='button-save-disabled'>Save</a>

      const notices = (self.state.notices || []).map((notice, n) => {
        return <b className='notice warning' key={`notice-${n}`}>{notice}</b>
      })

      const buttons = []
      if (self.state.formErrors) {
        buttons.push(saveDisabled)
      }
      else if(self.state.saving) {
        buttons.push(savingButton)
      }
      else {
        buttons.push(saveButton)
      }

      return <p className="ButtonContainer">
        {notices}
        {buttons}
      </p>
    }

    const id = self.state.formData.id
    const idProperty = <p className="ObjectProperty" key='input-id-string'><label htmlFor='input-id-string'>id</label> {self.state.formData.id}</p>
    const propertyInputs = [idProperty].concat(renderPropertyInputs(objectProperties))

    const exampleOutput = (id) ?
      <pre>
        {objectSingular}-{id}.json : <br />
        {JSON.stringify(self.state.formData, null, 2)}
      </pre>
    : ''

    return (
      <div className="Objects">
        <h1>
          <span>Add new {objectSingular}</span>
        </h1>
        <p className="ObjectProperty">
          <label htmlFor="object-id">New Object ID</label>
          <input name="object-id" onChange={onIDChange} disabled={self.state.saving} /> : This will be used in file names, and must be unique amongst other {objectSingular} types.
        </p>
        <p>Existing types: {objectItems.map(n => n.id).join(', ')}</p>
        {id ? propertyInputs : ''}
        {renderButtons()}
        {exampleOutput}
      </div>
    )
  }
}

export default AddObjectToType
