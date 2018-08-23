import React, { Component } from 'react'

import './Icon.css'

class Icon extends Component {
  render() {
    const marginClass = this.props.margin || 'none'
    return (
      <i className={['Icon', `fas fa-${this.props.id}`, marginClass].join(' ')}></i>
    )
  }
}

export default Icon
