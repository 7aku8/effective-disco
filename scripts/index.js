const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1200
canvas.height = 800

const image = new Image()
image.src = '../assets/it.jpg'

image.onload = () => {
  const particles = []
  const particlesAmount = 8000

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const mappedImage = []

  const calcBrightness = ({ red, green, blue }) => {
    return Math.sqrt(
      (red * red) * 0.299 +
      (green * green) * 0.587 +
      (blue * blue) * 0.114
    ) / 110
  }

  for (let y = 0; y < canvas.height; y++) {
    let row = []

    for (let x = 0; x < canvas.width; x++) {
      const red = pixels.data[(y * 4 * pixels.width) + (x * 4)]
      const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)]
      const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)]

      const brightness = calcBrightness({ red, green, blue })
      const cell = [ brightness, [red, green, blue] ]
      row.push(cell)
    }

    mappedImage.push(row)
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width
      this.y = 0
      this.speed = 0
      this.velocity = Math.random() * 2
      this.size = Math.random() * 1.5 + 2.1

      this.position1 = Math.floor(this.x)
      this.position2 = Math.floor(this.y)

      this.angle = 0
    }

    update() {
      this.position1 = Math.floor(this.y)
      this.position2 = Math.floor(this.x)

      if ((mappedImage[this.position1]) && (mappedImage[this.position1][this.position2])) {
        const [brightness] = mappedImage[this.position1][this.position2]
        this.speed = brightness
      }

      let movement = (3.5 + this.speed) + this.velocity
      this.angle += this.speed / 20

      this.y += movement + 6 * Math.sin(this.angle)
      this.x += movement + 1.2 * Math.sin(this.angle)

      if (this.y >= canvas.height) {
        this.y = 0
        this.x = Math.random() * canvas.width
      }
      if (this.x >= canvas.width) {
        this.x = 0
        this.y = Math.random() * canvas.height
      }
    }

    draw() {
      if ((mappedImage[this.position1]) && (mappedImage[this.position1][this.position2])) {
        const [_, color] = mappedImage[this.position1][this.position2]
        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
      }

      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const init = () => {
    for (let i = 0; i < particlesAmount; i++) {
      particles.push(new Particle())
    }
  }

  init()
  function animate() {
    ctx.globalAlpha = 0.05
    // ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < particlesAmount; i++) {
      particles[i].update()
      ctx.globalAlpha = particles[i].speed / 2.5
      particles[i].draw()
    }
    requestAnimationFrame(animate)
  }
  animate()
}



