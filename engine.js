var canvas

// http://www.extentofthejam.com/pseudo/

function startGame() {
  console.log('starting game loop')
  game = new Game()

  window.requestAnimationFrame(gameLoop)
}

document.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('game')
  game.horizon = canvas.height * 0.5
  buildRoadZMap()
})

var previousTime = 0
var game

class Game {
  distance = 0
  horizon = 0

  cameraHeight = 50
  roadWidth = 200

  player = new Player()
}

class Player {
  speed = 47
}

function gameLoop(time) {
  resetDebug()

  game.distance = (canvas.height + (time / 1000) * game.player.speed).toFixed(2)

  drawScene(time)
  window.requestAnimationFrame(gameLoop)
}

let roadZmap = []

function buildRoadZMap() {
  for (let i = 0; i < canvas.height; i++) {
    roadZmap[i] = -game.cameraHeight / (i - game.horizon)
  }
}

function drawScene(time) {
  let ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let hz = (1000 / (time - previousTime)).toFixed(2)
  previousTime = time
  debug(`${hz} fps`)

  debug(`${(time / 1000).toFixed(2)}s`)
  debug(`d: ${game.distance}`)
  center = canvas.width / 2

  ctx.fillStyle = 'lightgreen'
  ctx.fillRect(0, canvas.height - game.horizon, canvas.width, game.horizon)

  var odd = false
  let stripeHeight = 8
  var nextStripe = stripeHeight - scale(game.distance % (stripeHeight * 2), 0)
  for (let i = 0; i < game.horizon; i++) {
    let y = canvas.height - i
    let width = scale(game.roadWidth, i)

    if (i > nextStripe) {
      nextStripe = nextStripe + scale(stripeHeight, i)
      odd = !odd
    }

    ctx.fillStyle = odd ? 'grey' : 'darkgrey'
    ctx.fillRect(center - width / 2, y, width, 1)

    let borderWidth = scale(20, i)
    let stripeWidth = scale(5, i)

    ctx.fillStyle = odd ? 'white' : 'red'
    ctx.fillRect(center - width / 2 - borderWidth, y, borderWidth, 1)
    ctx.fillRect(center + width / 2, y, borderWidth, 1)

    if (!odd) {
      ctx.fillStyle = '#eeeeee'
      ctx.fillRect(center - width / 5 - stripeWidth, y, stripeWidth, 1)
      ctx.fillRect(center + width / 5, y, stripeWidth, 1)
    }
  }
}

function scale(size, y) {
  return size / roadZmap[y]
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
