import React, { Component } from 'react'

import { addIndex, append, map } from 'ramda'

import Square from './square.jsx!'

const mapIndexed = addIndex(map)

class Game extends Component {

  constructor (props) {
    super(props)

    this.state = { history: [] }
  }

  handleClick (square) {
    this.setState({ history: append(square, this.state.history) })
  }

  // UPDATED
  render () {
    const squares = mapIndexed((_, i) => {
      return <Square key={i} clickCb={this.handleClick.bind(this, i)}/>
    }, new Array(9))

    return <div className="board">{squares}</div>
  }
}

export default Game
