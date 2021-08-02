class Player {
  acceleration = 0
  speed = 0
  turning = 0
  input = new Input()

  position = 0

  update(time, elapsed) {
    this.speed += (this.acceleration * elapsed) / 1000
    this.speed = Math.min(game.maxSpeed, Math.max(0, this.speed))

    this.position = clamp(this.position + (this.turning * game.turnRate * this.speed * elapsed) / 1000, -game.roadWidth / 2, game.roadWidth / 2)

    if (this.speed <= 0 || this.speed >= game.maxSpeed) {
      this.acceleration = 0
    }

    debug(`Speed: ${this.speed.toFixed(1)}`)
  }
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
