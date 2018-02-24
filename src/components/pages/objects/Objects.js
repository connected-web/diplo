import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../icon/Icon'

class Objects extends Component {
  render() {
    const model = this.props.model

    function wbr(str) {
      return (str || '').replace(/([/.])/g, ':wbr:$1:wbr:').split(':wbr:').map((s, i) => <span key={i}>{s}</span>)
    }

    function renderObjects(objects) {
      objects = objects || []

      function renderTable(key, columns, items) {
        const headerRow = <tr key={`table-${key}-items-th`}>{Object.keys(columns).map((key, i) => <th key={`th-${i}`} title={`${key} : ${columns[key]}`}><div>{key}</div></th>)}</tr>
        const rows = []
        items.forEach((item, i) => {
          const itemRow = <tr key={`table-${key}-items-td-${i}`}>{Object.keys(columns).map((key, i) => <td key={`td-${i}`} title={item[key]}><div>{wbr(item[key])}</div></td>)}</tr>
          rows.push(itemRow)
        })

        return <table key={`table-${key}-items`}><thead>{headerRow}</thead><tbody>{rows}</tbody></table>
      }

      return objects.map(object => {
          return (
            <div key={object.id}>
              <h2>
                <span>{object.id}s</span>
                <Link className="button default" to={`/objects/${object.id}s/add`}>Add<Icon id='plus' margin='right' /></Link>
              </h2>
              {renderTable(object.id, object.properties, object.items)}
            </div>
          )
        })
    }

    return (
      <div className="Objects">
        <h1>
          <span>Objects</span>
          <Link className="button default" to="/objects/create">Add<Icon id='plus' margin='right' /></Link>
        </h1>
        {renderObjects(model.data.objects)}
      </div>
    )
  }
}

export default Objects;
