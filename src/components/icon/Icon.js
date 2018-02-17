import React, { Component } from 'react'

import './Icon.css'

class Icon extends Component {
  render() {
    const marginClass = this.props.margin || 'none'
    return (
      <span className={['Icon', this.props.id, marginClass].join(' ')}></span>
    )
  }
}

export default Icon
