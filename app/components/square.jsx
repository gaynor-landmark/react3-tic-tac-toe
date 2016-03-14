import React, { Component } from 'react'

class Square extends Component {

  handleClick (event) {
    if (this.props.clickCb) {
      this.props.clickCb()
    }
  }

  render () {
    const div = this.props.player ?
      <div>{this.props.player}</div> :
      <div onClick={this.handleClick.bind(this)}/>

    return div
  }
}

export default Square
