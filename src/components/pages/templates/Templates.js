import React, { Component } from 'react';

class Templates extends Component {
  render() {
    const model = this.props.model

    function renderTemplates(templates) {
      templates = templates || []

      function renderTemplate(data) {
        return (
          <div key={data.id}>
            <h3>{data.id}</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )
      }

      return templates.map(renderTemplate)
    }

    return (
      <div className="Templates">
        <h1>Templates</h1>
        {renderTemplates(model.data.templates)}
      </div>
    )
  }
}

export default Templates;
