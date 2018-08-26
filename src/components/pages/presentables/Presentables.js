import React, { Component } from 'react'
/* import { Link } from 'react-router-dom' */

class Presentables extends Component {
  render() {
    const model = this.props.model

    function renderPresentables(presentables) {
      return presentables.map(item => {
        const path = `/api/present/${item.objectType}/${item.itemId}/${item.objectType}-${item.templateId}`
        return <div key={`presentable-${item.itemId}`} className={`presentable ${item.itemId}`}>
          <h3>{item.assetId}</h3>
          <p><a href={path}>{path}</a></p>
        </div>
      })
    }

    return (
      <div className="Presentables">
        <h1>Presentables</h1>
        <p>Here is a list of all the items that can be rendered as assets using the available templates.</p>
        {renderPresentables(model.state.presentables || [])}
      </div>
    );
  }
}

export default Presentables;
