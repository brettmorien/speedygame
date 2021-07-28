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
  game.buildRoadZMap()
  game.buildPlayerSpritesheet()
})

var previousTime = 0
var game

class Game {
  distance = 0
  horizon = 0

  cameraHeight = 50
  roadWidth = 200
  playerScale = 5

  player = new Player()

  roadZmap = []
  playerSprites = []

  buildRoadZMap() {
    for (let i = 0; i < canvas.height; i++) {
      this.roadZmap[i] = -game.cameraHeight / (i - game.horizon)
    }
  }

  scale(size, y) {
    return size / this.roadZmap[y]
  }

  buildPlayerSpritesheet() {
    let img = document.getElementById('terrarossa')

    this.playerSprites = [
      new PlayerSprite(img,   8, 10, 40, 37), // R
      new PlayerSprite(img,  56, 10, 40, 37),
      new PlayerSprite(img, 104, 10, 40, 37),
      new PlayerSprite(img, 152, 10, 40, 37), // M
      new PlayerSprite(img, 200, 10, 40, 37),
      new PlayerSprite(img, 248, 10, 40, 37),
      new PlayerSprite(img, 296, 10, 40, 37), // L
      new PlayerSprite(img, 344, 10, 40, 37),
      new PlayerSprite(img, 392, 10, 40, 37),
    ]
  }
}

class Player {
  speed = 47
  input = new Input()
}

class PlayerSprite {
  constructor(img, x, y, width, height) {
    this.img = img
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
}

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
  }
}

function gameLoop(time) {
  resetDebug()

  game.distance = canvas.height + (time / 1000) * game.player.speed

  handleInput(time)
  drawScene(time)
  window.requestAnimationFrame(gameLoop)
}

function handleInput(time) {
  if (game.player.input.up) {
    game.player.speed = 100
  } else {
    game.player.speed = 50
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
  var nextStripe = stripeHeight - game.scale(game.distance % (stripeHeight * 2), 0)

  for (let i = 0; i < game.horizon; i++) {
    let y = canvas.height - i
    let width = game.scale(game.roadWidth, i)

    if (i > nextStripe) {
      nextStripe = nextStripe + game.scale(stripeHeight, i)
      odd = !odd
    }

    ctx.fillStyle = odd ? 'grey' : 'darkgrey'
    ctx.fillRect(center - width / 2, y, width, 1)

    let borderWidth = game.scale(20, i)
    let stripeWidth = game.scale(5, i)

    ctx.fillStyle = odd ? 'white' : 'red'
    ctx.fillRect(center - width / 2 - borderWidth, y, borderWidth, 1)
    ctx.fillRect(center + width / 2, y, borderWidth, 1)

    if (!odd) {
      ctx.fillStyle = '#eeeeee'
      ctx.fillRect(center - width / 5 - stripeWidth, y, stripeWidth, 1)
      ctx.fillRect(center + width / 5, y, stripeWidth, 1)
    }
  }

  let mult = 60

  let spriteIndex = (game.distance / mult).toFixed(0) % game.playerSprites.length

  debug(spriteIndex)

  with (game.playerSprites[spriteIndex]) {
    ctx.drawImage(img, x, y, width, height,
      (canvas.width - width * game.playerScale) / 2,
      canvas.height - height * game.playerScale - 20,
      width * game.playerScale, height * game.playerScale
    )
  }
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
