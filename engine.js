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
  game.playerScale = canvas.height / 160
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

  maxAcc = 20
  maxSpeed = 200
  turnRate = 5

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
  acceleration = 0
  speed = 0
  turning = 0
  input = new Input()

  position = 0
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

  let elapsed = time - previousTime
  previousTime = time

  game.distance += elapsed * game.player.speed / 1000

  handleInput()
  updatePlayer(time, elapsed)
  drawScene(time, elapsed)
  window.requestAnimationFrame(gameLoop)
}

function handleInput() {
  if (game.player.input.up) {
    game.player.acceleration = game.maxAcc
  } else if (game.player.input.down) {
    game.player.acceleration = - game.maxAcc * 3
  } else if (game.player.speed != 0) {
    game.player.acceleration = -game.maxAcc
  }

  if (game.player.input.left) {
    game.player.turning = -1
  } else if (game.player.input.right) {
    game.player.turning = 1
  } else {
    game.player.turning = 0
  }

  debug(`Acc: ${game.player.acceleration}`)
}

function updatePlayer(time, elapsed) {
  game.player.speed += game.player.acceleration * elapsed / 1000
  game.player.speed = Math.min(game.maxSpeed, Math.max(0, game.player.speed))

  game.player.position += game.player.turning * game.turnRate * game.player.speed * elapsed / 1000

  if (game.player.speed <= 0) {
    game.player.acceleration = 0
  }

  debug (`Speed: ${game.player.speed.toFixed(1)}`)
}

function drawScene(time, elapsed) {
  let ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let hz = (1000 / (elapsed)).toFixed(2)
  debug(`${hz} fps`)

  debug(`${(time / 1000).toFixed(2)}s`)
  debug(`d: ${game.distance.toFixed(2)}`)
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

  let spriteIndex = game.player.turning == 1 ? 1
    : game.player.turning == -1 ? 7
    : 4
  
  if (game.player.acceleration > 0) {
    spriteIndex -= 1
  } else if (game.player.acceleration < 0) {
    spriteIndex += 1
  }

  with (game.playerSprites[spriteIndex]) {
    ctx.drawImage(img, x, y, width, height,
      (canvas.width - width * game.playerScale) / 2 + game.player.position,
      canvas.height - height * game.playerScale,
      width * game.playerScale, height * game.playerScale
    )
  }

  drawDebug()
}

var debugLines = []
function resetDebug() {
  debugLines = []
}
function debug(text) {
  debugLines.push(text)
}

function drawDebug() {
  let ctx = canvas.getContext('2d')
  ctx.strokeStyle = 'black'
  for (let i = 0; i < debugLines.length; i++) {
    ctx.strokeText(debugLines[i], 10, 10 * (i + 1), 200)
  }
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
