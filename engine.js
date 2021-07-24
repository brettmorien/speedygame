var canvas;

function startGame() {
  console.log("starting game loop");

  window.requestAnimationFrame(drawScene);
}

document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("game");
});

function drawScene(time) {
  debugLine = 0;
  let ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  horizon = 60
  stripeLength = 20
  speed = 47
  distance = (time / 1000) * speed

  // debug(time)
  // debug(distance)
  center = canvas.width / 2

  for (let i = canvas.height; i >= horizon; i--) {
    ctx.fillStyle =
      Math.abs(distance - i) % stripeLength >= stripeLength / 2 ? "grey" : "black";
    // ctx.fillStyle = (i + distance) % 10 >= 5 ? "grey" : "black"
    ctx.fillRect(center - i / 2, i, i, 1)
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

  ctx.strokeStyle = "black";
  // ctx.strokeText(time, 20, 20, 200)
  // ctx.strokeText(`${canvas.width} x ${canvas.height}`, 20, 60, 200)

  window.requestAnimationFrame(drawScene);
}

var debugLine = 0;
function debug(text) {
  let ctx = canvas.getContext("2d");
  ctx.strokeStyle = "black";
  ctx.strokeText(text, 10, 10 * ++debugLine, 200);
}
