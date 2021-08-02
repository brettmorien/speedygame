class Game {
  display = null
  distance = 0
  horizon = 0

  cameraHeight = 50
  roadWidth = 200
  playerScale = 5

  player = new Player()

  roadZmap = []
  playerSprites = []

  maxAcc = 40
  maxSpeed = 200
  turnRate = 1

  start(display) {
    this.display = display
    window.requestAnimationFrame(t => this.gameLoop(t))
  }

  gameLoop(time) {
    resetDebug()

    let elapsed = time - previousTime
    previousTime = time

    game.distance += (elapsed * game.player.speed) / 1000

    this.handleInput()
    this.player.update(time, elapsed)
    this.display.drawScene(time, elapsed)
    window.requestAnimationFrame(t => this.gameLoop(t))
  }

  handleInput() {
    if (game.player.input.up) {
      game.player.acceleration = game.maxAcc
    } else if (game.player.input.down) {
      game.player.acceleration = -game.maxAcc * 3
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
      new PlayerSprite(img, 8, 10, 40, 37), // R
      new PlayerSprite(img, 56, 10, 40, 37),
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
