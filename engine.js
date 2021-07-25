var canvas

function startGame() {
  console.log('starting game loop')
  game = new Game()

  window.requestAnimationFrame(drawScene)
}

document.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('game')
  game.horizon = canvas.height * 0.4
})

var previousTime = 1
var game

class Game {
  distance = 0
  horizon = 0

  ddz = 4

  player = new Player()
}

class Player {
  speed = 47
}

function drawScene(time) {
  let ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let hz = (1000 / (time - previousTime)).toFixed(2)
  previousTime = time
  debug(`${hz} fps`)

  game.distance = (canvas.height + (time / 1000) * game.player.speed).toFixed(2)

  debug(`${(time / 1000).toFixed(2)}s`)
  debug(`d: ${game.distance}`)
  center = canvas.width / 2

  var odd = false
  var dz = 0
  var z = game.horizon
  for (let i = game.horizon; i < canvas.height; i++) {
    if (i > z) {
      odd = !odd
      dz += game.ddz
      z += dz
    }

    ctx.fillStyle = odd ? 'grey' : 'darkgrey'
    ctx.fillRect(center - i / 2, i, i, 1)

    ctx.fillStyle = odd ? 'red' : 'white'
    ctx.fillRect(center - i / 2 - 10, i, 10, 1)
    ctx.fillRect(center + i / 2, i, 10, 1)

    if (odd) {
      ctx.fillStyle = "#eeeeee"
      ctx.fillRect(center - i / 4 - 10, i, 10, 1)
      ctx.fillRect(center + i / 4, i, 10, 1)
    }
  }

  resetDebug()
  window.requestAnimationFrame(drawScene)
}

var debugLine = 0
function resetDebug() {
  debugLine = 0
}
function debug(text) {
  let ctx = canvas.getContext('2d')
  ctx.strokeStyle = 'black'
  ctx.strokeText(text, 10, 10 * ++debugLine, 200)
}

// ctx.fillRect(10, 10, 50, 50)
// ctx.fillStyle = "rgba(0, 0, 200, 0.5)"
// ctx.fillRect(30, 30, 50, 50)

// ctx.beginPath()
// ctx.strokeStyle = "blue"
// ctx.moveTo(20, 20)
// ctx.lineTo(200, 20)
// ctx.stroke()

// // Second path
// ctx.beginPath()
// ctx.strokeStyle = "green"
// ctx.moveTo(20, 20)
// ctx.lineTo(120, 120)
// ctx.stroke()

// ctx.strokeText(time, 20, 20, 200)
// ctx.strokeText(`${canvas.width} x ${canvas.height}`, 20, 60, 200)
