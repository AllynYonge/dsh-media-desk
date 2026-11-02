// 合成视频封面：有画面就叠大字，没有画面就用渐变做一张纯文字封面。
const WIDTH = 1920
const HEIGHT = 1080

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('封面图读取失败'))
    image.src = src
  })
}

function wrap(ctx, text, maxWidth, maxLines) {
  const lines = []
  let line = ''
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxWidth && line) {
      lines.push(line)
      line = ch
    } else {
      line += ch
    }
  }
  if (line) lines.push(line)
  return lines.slice(0, maxLines)
}

function drawBackground(ctx) {
  const base = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  base.addColorStop(0, '#1a1b3a')
  base.addColorStop(0.55, '#4a2f6b')
  base.addColorStop(1, '#d9745a')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  const glow = ctx.createRadialGradient(WIDTH * 0.8, HEIGHT * 0.15, 0, WIDTH * 0.8, HEIGHT * 0.15, WIDTH * 0.6)
  glow.addColorStop(0, 'rgba(255, 196, 150, .55)')
  glow.addColorStop(1, 'rgba(255, 196, 150, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

/**
 * @param {{src?: string, text: string}} options - 封面图地址和封面大字。
 * @returns {Promise<HTMLCanvasElement>} 1920×1080 的封面。
 */
export async function composeCover({ src, text }) {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  drawBackground(ctx)
  if (src) {
    const image = await loadImage(src)
    const scale = Math.max(WIDTH / image.width, HEIGHT / image.height)
    ctx.drawImage(image, (WIDTH - image.width * scale) / 2, (HEIGHT - image.height * scale) / 2, image.width * scale, image.height * scale)
    const shade = ctx.createLinearGradient(0, HEIGHT * 0.35, 0, HEIGHT)
    shade.addColorStop(0, 'rgba(0, 0, 0, 0)')
    shade.addColorStop(1, 'rgba(0, 0, 0, .72)')
    ctx.fillStyle = shade
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
  }
  const size = text.length > 12 ? 112 : 148
  ctx.font = `700 ${size}px "Songti SC", "STSong", "Noto Serif SC", serif`
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'alphabetic'
  ctx.shadowColor = 'rgba(0, 0, 0, .35)'
  ctx.shadowBlur = 24
  const lines = wrap(ctx, text, WIDTH - 200, 3)
  const lineHeight = size * 1.24
  lines.forEach((line, index) => {
    ctx.fillText(line, 100, HEIGHT - 100 - (lines.length - 1 - index) * lineHeight)
  })
  return canvas
}

export async function coverDataUrl(options) {
  const canvas = await composeCover(options)
  return canvas.toDataURL('image/jpeg', 0.9)
}

export async function downloadCover(options, name) {
  const url = await coverDataUrl(options)
  const link = document.createElement('a')
  link.href = url
  link.download = `${String(name).replace(/[\\/:*?"<>|\s]+/g, ' ').trim().slice(0, 40) || '视频封面'}.jpg`
  link.click()
}
