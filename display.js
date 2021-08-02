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
  scale = 1

  setResolution(res) {
    this.resolution = Math.min(Math.max(res, 0), this.resolutions.length - 1)
    if (res == this.resolution) {
      canvas.width = this.resolutions[this.resolution].x
      canvas.height = this.resolutions[this.resolution].y
      game.horizon = canvas.height * 0.5
      this.scale = canvas.height / 160
      game.buildRoadZMap()
    }
  }

  upResolution() {
    this.setResolution(this.resolution + 1)
  }

  downResolution() {
    this.setResolution(this.resolution - 1)
  }

  drawScene(time, elapsed) {
    let ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let hz = (1000 / elapsed).toFixed(2)
    debug(`${hz} fps`)

    debug(`${(time / 1000).toFixed(2)}s`)
    debug(`d: ${game.distance.toFixed(2)}`)
    debug(`Res: ${canvas.width}x${canvas.height}`)

    let center = canvas.width / 2

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

    let spriteIndex = game.player.turning == 1 ? 1 : game.player.turning == -1 ? 7 : 4

    if (game.player.acceleration > 0 && game.player.speed < game.maxSpeed) {
      spriteIndex -= 1
    } else if (game.player.acceleration < -game.maxAcc) {
      spriteIndex += 1
    }

    let s = game.playerSprites[spriteIndex]

    ctx.drawImage(
      s.img,
      s.x,
      s.y,
      s.width,
      s.height,
      (canvas.width - s.width * this.scale) / 2 + game.player.position * this.scale,
      canvas.height - s.height * this.scale,
      s.width * this.scale,
      s.height * this.scale
    )

    this.drawDebug()
  }

  drawDebug() {
    let ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'black'
    for (let i = 0; i < debugLines.length; i++) {
      ctx.strokeText(debugLines[i], 10, 10 * (i + 1), 200)
    }
  }
}
