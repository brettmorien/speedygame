// Inspired by http://www.extentofthejam.com/pseudo/

var canvas
var previousTime = 0
var game
var display

function startGame() {
  console.log('starting game')
  game = new Game()
  display = new Display()
  game.start(display)
  canvas = document.getElementById('game')
  display.setResolution(3)
  display.buildPlayerSpritesheet()
}

document.addEventListener('DOMContentLoaded', () => {
  startGame()
})

class Input {
  left = false
  up = false
  right = false
  down = false
}

function keyDown(event) {
  switch (event.keyCode) {
    case 37:
      game.player.input.left = true
      break
    case 38:
      game.player.input.up = true
      break
    case 39:
      game.player.input.right = true
      break
    case 40:
      game.player.input.down = true
      break
    case 81: // q
      game.curve -= .5
      break
    case 87: // w
      game.curve = 0
      break
    case 69: // e
      game.curve += .5
      break
  }
}

function keyUp(event) {
  switch (event.keyCode) {
    case 37:
      game.player.input.left = false
      break
    case 38:
      game.player.input.up = false
      break
    case 39:
      game.player.input.right = false
      break
    case 40:
      game.player.input.down = false
      break
    case 187: // plus
      display.upResolution()
      break
    case 189: // minus
      display.downResolution()
      break
  }
}

var debugLines = []
function resetDebug() {
  debugLines = []
}
function debug(text) {
  debugLines.push(text)
}
