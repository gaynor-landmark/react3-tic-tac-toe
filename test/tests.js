import React from 'react'
import TestUtils from 'react-addons-test-utils'

import { expect } from 'chai'

import App from '../app/components/app.jsx!'
import Game from '../app/components/game.jsx!'
import Square from '../app/components/square.jsx!'


const {
  isCompositeComponent,
  renderIntoDocument,
  scryRenderedDOMComponentsWithClass,
  scryRenderedDOMComponentsWithTag,
  Simulate
} = TestUtils


describe("App", () => {

  it("is a composite component", () => {
    const app = renderIntoDocument(<App/>)

    expect(isCompositeComponent(app)).to.be.ok
  })
})

describe("Game", () => {
  let game

  beforeEach(() => {
    game = renderIntoDocument(<Game/>)
  })

  it("is a composite component", () => {
    expect(isCompositeComponent(game)).to.be.ok
  })

  it("has a board", () => {
    expect(scryRenderedDOMComponentsWithClass(game, 'board')).not.to.be.empty
  })

  it("tracks moves in game history", () => {
    const board = scryRenderedDOMComponentsWithClass(game, 'board')

    const center = board[0].childNodes[4]
    const midLeft = board[0].childNodes[3]
    const topLeft = board[0].childNodes[0]

    Simulate.click(center)
    Simulate.click(midLeft)
    Simulate.click(topLeft)

    expect(game.state.history).to.eql([4,3,0])
  })

  

  describe("board", () => {
    it("has nine squares", () => {
      const board = scryRenderedDOMComponentsWithClass(game, 'board')

      expect(board[0].childNodes.length).to.equal(9)
    })
  })
})


describe("Square", () => {
  let square
  const player = 'x'

  describe("when empty", () => {
    before(() => {
      square = renderIntoDocument(<Square/>)
    })

    it("is a composite component", () => {
      expect(isCompositeComponent(square)).to.be.ok
    })

    // NEW
    it("calls a callback when clicked", () => {
      const cb = (event) => console.log("Clickeroonie!")
      square = renderIntoDocument(<Square clickCb={cb}/>)

      Simulate.click(square)
    })
})

  // NEW
  describe("after play", () => {
    beforeEach(() => {
      square = renderIntoDocument(<Square player={player}/>)
    })

    it("has the correct content", () => {
      const div = scryRenderedDOMComponentsWithTag(square, 'div')[0]

      expect(div && div.innerHTML).to.equal(player)
    })
  })
})
