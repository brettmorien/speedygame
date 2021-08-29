class Game {
  display = null
  distance = 0
  horizon = 0.5

  cameraHeight = 50
  roadWidth = 200

  player = new Player()

  maxAcc = 40
  maxSpeed = 200

  centrifugal = 0.3
  curve = 0

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
}
