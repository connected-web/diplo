import React, { Component } from 'react'

const types = {
  id: 'filename',
  string: 'string',
  number: 'number',
  assetpath: 'assetpath'
}

const fieldIDs = []
const unusedFieldIDs = [].concat(fieldIDs)

class CreateObjectType extends Component {
  constructor() {
    super()
    this.state = {
      saving: false,
      formErrors: true,
      notices: [],
      formData: {},
      id: '',
      fields: []
    }
  }

  render() {
    const model = this.props.model
    const objects = model.data.objects || []

    const self = this

    function newFieldId() {
      let fieldId = `F${(fieldIDs.length + 1)}`
      fieldIDs.push(fieldId)
      unusedFieldIDs.push(fieldId)
      return fieldId
    }

    function makeField() {
      if (unusedFieldIDs.length === 0) {
        newFieldId()
      }
      let fieldId = unusedFieldIDs.pop()
      let field = {
        id: fieldId,
        name: '',
        type: ''
      }
      return field
    }

    function onNameChange(ev) {
      const name = ev.target.value || ''
      const id = name.trim().toLowerCase().replace(/[_\s]/g, '-').replace(/[^A-z\d-]/g, '')
      const formData = self.state.formData

      self.state.id = id
      formData.id = types.id
      formData.name = types.string

      updateFormData()
      self.setState({ formData })
    }

    function clone(data) {
      return JSON.parse(JSON.stringify(data))
    }

    function expungeFieldData() {
      self.state.fields.filter(field => !field.name && !field.type).map(f => f.id).forEach(id => unusedFieldIDs.push(id))
      const fields = clone(self.state.fields.filter(field => field.name || field.type).concat(makeField()))
      return fields
    }

    function updateFormData() {
      const fields = expungeFieldData()
      const formData = {
        id: types.id,
        name: types.string
      }
      fields.forEach(field => {
        if (field.name) {
          formData[field.name] = field.type
        }
      })
      const notices = checkForDataErrors(formData)
      const formErrors = notices.length ? true : false
      self.setState({ formData, fields, notices, formErrors })
    }

    function checkForDataErrors(formData) {
      const errors = Object.keys(formData).map(testFieldValue(formData))
      if (errors.filter(n => n).length) {
        return ['Please complete the form']
      }

      return []
    }

    function testFieldValue(formData) {
      return (key) => formData[key] ? false : true
    }

    async function saveFormData(ev) {
      console.log('Submit form data...')
      self.setState({saving: true})
      const payload = {
        action: 'saveObjectType',
        objectType: self.state.id,
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

    function renderPropertyInput(field, index) {
      const disabled = self.state.saving

      function onNameChange(ev) {
        field.name = ev.target.value
        updateFormData()
      }

      function onTypeChange(ev) {
        field.type = ev.target.value
        updateFormData()
      }

      function createOption(label, value,) {
        return <option value={value} key={`option-${value}`}>{label}</option>
      }

      const typeOptions = Object.keys(types).filter(n => n !== 'id').map(type => createOption(type, types[type], field.value))

      return <p className="ObjectProperty" key={`input-new-property-${field.id}`}>
        <input className={field.id} name={`input-new-property-name`} onChange={onNameChange} disabled={disabled} />
        <span> Type: </span>
        <select name={`input-new-property-type`} onChange={onTypeChange} disabled={disabled}>
          {createOption('Select data type...', '')}
          {typeOptions}
        </select>
        {field.type && !field.name ? <b className='notice warning'>Requires name</b> : ''}
        {field.name && !field.type ? <b className='notice warning'>Requires type</b> : ''}
        </p>
    }

    function renderPropertyInputs(fields) {
      return fields.map(renderPropertyInput)
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

      return <div className="ButtonContainer">
        <p className="Buttons">
          {notices}
          {buttons}
        </p>
      </div>
    }

    function renderReadOnlyProperty(key) {
      const formData = self.state.formData
      return <p className="ObjectProperty" key={`read-only-${key}`}>{key} : {formData[key]} (required)</p>
    }

    const id = self.state.id
    const propertyInputs = [renderReadOnlyProperty('id'), renderReadOnlyProperty('name'), renderPropertyInputs(self.state.fields)]

    const exampleOutput = (id) ?
      <pre>
        {id}_properties.json : <br />
        {JSON.stringify(self.state.formData, null, 2)}
      </pre>
    : ''

    return (
      <div className="Objects">
        <h1>Create New Object Type</h1>
        <p className="ObjectProperty">
          <label htmlFor="object-id">New type name</label>
          <input name="object-id" onChange={onNameChange} disabled={self.state.saving} /><br />
          This will be used in file names, and must be unique amongst other object types.
        </p>
        <p className="advice">Advice: Existing types are {objects.map(n => n.id).join(', ')}</p>
        {id ? <h2>Properties</h2> : ''}
        {id ? propertyInputs : ''}
        {id ? <p className="advice">Advice: Add new properties, e.g. cost: number, description: string, artwork: assetpath</p> : ''}
        {renderButtons()}
        {exampleOutput}
      </div>
    )
  }
}

export default CreateObjectType
