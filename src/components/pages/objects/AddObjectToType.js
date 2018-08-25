import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../icon/Icon'
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

    function onNameChange(ev) {
      const name = ev.target.value || ''
      const id = name.trim().toLowerCase().replace(/[_\s]/g, '-').replace(/[^A-z\d-]/g, '')
      const formData = self.state.formData

      formData.id = id
      formData.name = name

      checkForFormErrors()
      self.setState({
        formData
      })
    }

    async function saveFormData(ev) {
      console.log('Submit form data...')
      self.setState({saving: true})
      const payload = {
        action: 'saveObject',
        objectType: objectSingular,
        objectData: self.state.formData
      }

      const notices = []
      try {
        const result = await model.save(payload)
        if(result.status !== 200) {
          notices.push(`${result.statusText} (${result.status})`)
        }
        else {
          notices.push('Saved')
        }
      }
      catch(ex) {
        notices.push(ex + '')
      }
      self.setState({saving: false, notices})
    }

    function testFieldValue(key) {
      // const fieldType = objectProperties[key]
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

    function renderReadOnlyProperty(key) {
      return <p className="ObjectProperty" key={`input-${key}-readonly`}><label htmlFor={`input-${key}-readonly`}>{key}</label> {self.state.formData[key]}</p>
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

        if (key === 'name') {
          return renderReadOnlyProperty(key)
        } else {
          return <p className='ObjectProperty' key={keyName}>
            <label htmlFor={keyName}>{key}</label>
            <input name={keyName} onChange={onPropertyChange} disabled={disabled} /> : {fieldType}
            {testFieldValue(key) ? <b className='notice warning'>Field empty</b> : ''}
          </p>
        }
      })
    }

    function grammarSpace(acc, item, index, array) {
      acc = acc || []
      if (index > 0) {
        acc.push(', ')
      }
      acc.push(item)
      return acc
    }

    function renderButtons() {
      const saveButton = <a onClick={saveFormData} className='button positive' key='saveObject'><Icon id='save' margin='left' />Save</a>
      const savingButton =  <a className='button disabled' key='button-saving'><Icon id='clock' margin='left' />Saving...</a>
      const saveDisabled = <a className='button disabled' key='button-save-disabled'><Icon id='save' margin='left' />Save</a>

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

      return <div className="ButtonContainer">
        <p className="Buttons">
          {notices}
          {buttons}
        </p>
      </div>
    }

    function renderObjectLink(object) {
      return <Link id={`view-object-${object.id}`} to={`/objects/${objectPlural}/view/${object.id}`}>{object.name}</Link>
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
        <h1>Add new {objectSingular}</h1>
        <p className="ObjectProperty">
          <label htmlFor="object-id">New {objectSingular} name</label>
          <input name="object-id" onChange={onNameChange} disabled={self.state.saving} /><br/>
          The name will be used to generate an id used in file names; and as such must be unique amongst other {objectSingular} types.
        </p>
        <p>Existing items for reference: {objectItems.map(renderObjectLink).reduce(grammarSpace, [])} ({objectItems.length} total)</p>
        {id ? propertyInputs : ''}
        {renderButtons()}
        {exampleOutput}
      </div>
    )
  }
}

export default AddObjectToType
