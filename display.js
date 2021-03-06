class Display {
  constructor() {}

  resolution = -1
  resolutions = [
    { x: 160, y: 120 },
    { x: 320, y: 240 },
    { x: 640, y: 480 },
    { x: 1024, y: 768 },
    { x: 2048, y: 1280 },
  ]

  drawScale = 1
  zmap = []
  playerSprites = []

  setResolution(res) {
    this.resolution = Math.min(Math.max(res, 0), this.resolutions.length - 1)
    if (res == this.resolution) {
      canvas.width = this.resolutions[this.resolution].x
      canvas.height = this.resolutions[this.resolution].y
      this.drawScale = canvas.height / 160
      this.buildZmap()
    }
  }

  upResolution() {
    this.setResolution(this.resolution + 1)
  }

  downResolution() {
    this.setResolution(this.resolution - 1)
  }

  drawScene(time, elapsed) {
    let screenHeight = canvas.height
    let screenWidth = canvas.width
    let horizon = game.horizon * screenHeight

    let ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, screenWidth, screenHeight)

    let hz = (1000 / elapsed).toFixed(2)
    debug(`${hz} fps`)

    debug(`${(time / 1000).toFixed(2)}s`)
    debug(`d: ${game.distance.toFixed(2)}`)
    debug(`Res: ${screenWidth}x${screenHeight}`)

    ctx.fillStyle = 'lightgreen'
    ctx.fillRect(0, screenHeight - horizon, screenWidth, horizon)

    var odd = false
    let stripeHeight = 8
    var nextStripe = stripeHeight - this.scale(game.distance % (stripeHeight * 2), 0)

    // Draw from the bottom up
    for (let i = 0; i <= horizon; i++) {
      let y = screenHeight - i
      let width = this.scale(game.roadWidth, i)

      if (i > nextStripe) {
        nextStripe = nextStripe + this.scale(stripeHeight, i)
        odd = !odd
      }

      if (odd) {
        ctx.fillStyle = '#aaffaa'
        ctx.fillRect(0, y, screenWidth, 1)
      }

      let center = this.getCenter(y)

      ctx.fillStyle = odd ? 'grey' : 'darkgrey'
      ctx.fillRect(center - width / 2, y, width, 1)

      let borderWidth = this.scale(20, i)
      let stripeWidth = this.scale(5, i)

      ctx.fillStyle = odd ? 'white' : 'red'
      ctx.fillRect(center - width / 2 - borderWidth, y, borderWidth, 1)
      ctx.fillRect(center + width / 2, y, borderWidth, 1)

      if (!odd) {
        ctx.fillStyle = '#eeeeee'
        ctx.fillRect(center - width / 5 - stripeWidth, y, stripeWidth, 1)
        ctx.fillRect(center + width / 5, y, stripeWidth, 1)
      }
    }

    let spriteIndex = game.player.turning == 1 ? 1 : game.player.turning == -1 ? 7 : 4

    if (game.player.acceleration > 0) {
      spriteIndex -= 1
    } else if (game.player.acceleration < -game.maxAcc) {
      spriteIndex += 1
    }

    let s = this.playerSprites[spriteIndex]

    ctx.drawImage(s.img, s.x, s.y, s.width, s.height, (screenWidth - s.width * this.drawScale) / 2, screenHeight - s.height * this.drawScale, s.width * this.drawScale, s.height * this.drawScale)

    this.drawDebug()
  }

  getCenter(y) {
    let horizon = game.horizon * canvas.height
    let i = canvas.height - y
    let horizonCenter = canvas.width / 2
    let carCenter = game.player.position * this.drawScale

    let center = horizonCenter + (i * i * game.curve) / 500 + (carCenter * (horizon - y)) / horizon

    // debug(`y: ${y} - c: ${center}`)
    return center
  }

  buildZmap() {
    let screenHeight = canvas.height
    let horizon = game.horizon * screenHeight
    for (let i = 0; i < screenHeight; i++) {
      this.zmap[i] = -game.cameraHeight / (i - horizon)
    }
  }

  scale(size, y) {
    return size / this.zmap[y]
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

  drawDebug() {
    let ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'black'
    for (let i = 0; i < debugLines.length; i++) {
      ctx.strokeText(debugLines[i], 10, 10 * (i + 1), 200)
    }
  }
}
