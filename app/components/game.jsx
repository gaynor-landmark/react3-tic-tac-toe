import React, { Component } from 'react'

import {
  addIndex,
  append,
  curry,
  indexOf,
  map,
  reduce,
  repeat,
  update
} from 'ramda'

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

  getPlayer (move, history) {
    return (indexOf(move, history) % 2 === 0) ? 'x' : 'o'
  }

  makeMove (history, memo, move) {
    const player = this.getPlayer(move, history)

    return update(move, player, memo)
  }

  getBoard (history) {
    const move = curry(this.makeMove.bind(this))
    const memo = repeat(false, 9)

    return reduce(move(history), memo, history)
  }

  render () {
    const squares = mapIndexed((val, idx) => {
      return val ?
        <Square key={idx} player={val}/> :
        <Square key={idx} clickCb={this.handleClick.bind(this, idx)}/>
    }, this.getBoard(this.state.history))

    return <div className="board">{squares}</div>
  }
}

export default Game
