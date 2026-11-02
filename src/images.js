// 开放式生图接入：任何兼容 OpenAI Images API 的服务都能用，由用户自己填地址、模型和密钥。
import { assertPublicUrl } from './harvest.js'

const TIMEOUT_MS = 300_000
const MAX_IMAGE_BYTES = 40_000_000

function extensionOf(buffer) {
  if (buffer.length > 8 && buffer[0] === 0x89 && buffer[1] === 0x50) return '.png'
  if (buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8) return '.jpg'
  if (buffer.length > 12 && buffer.toString('latin1', 0, 4) === 'RIFF' && buffer.toString('latin1', 8, 12) === 'WEBP') return '.webp'
  if (buffer.length > 6 && buffer.toString('latin1', 0, 3) === 'GIF') return '.gif'
  return null
}

function redact(text, key) {
  const clean = String(text ?? '').slice(0, 300)
  return key ? clean.split(key).join('***') : clean
}

function explain(status, detail) {
  if (status === 401 || status === 403) return `密钥无效或没有这个模型的权限（${status}）`
  if (status === 404) return '接口地址或模型不对（404）'
  if (status === 429) return '请求太频繁或额度不足（429）'
  return detail ? `生图服务返回 ${status}：${detail}` : `生图服务返回 ${status}`
}

async function requestOnce(image, prompt, fetchImpl, signal, size = image.size) {
  const extra = image.extra ? JSON.parse(image.extra) : {}
  const body = { model: image.model, prompt, n: 1, ...(size ? { size } : {}), ...(image.quality ? { quality: image.quality } : {}), ...extra }
  const res = await fetchImpl(`${image.baseUrl}/images/generations`, {
    method: 'POST',
    headers: { authorization: `Bearer ${image.apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
  const raw = await res.text()
  let data = null
  try {
    data = JSON.parse(raw)
  } catch {
    // 网关偶尔返回 HTML 错误页
  }
  if (!res.ok) {
    const error = new Error(explain(res.status, redact(data?.error?.message ?? data?.message ?? '', image.apiKey)))
    error.retryable = res.status >= 500
    throw error
  }
  // OpenAI 系放在 data[0]，部分国内服务放在 images[0]
  const entry = data?.data?.[0] ?? data?.images?.[0]
  if (entry?.b64_json) return { buffer: Buffer.from(entry.b64_json, 'base64'), revisedPrompt: entry.revised_prompt }
  if (entry?.url) {
    const url = await assertPublicUrl(entry.url)
    const download = await fetchImpl(url, { signal })
    if (!download.ok) throw new Error(`下载图片失败（${download.status}）`)
    return { buffer: Buffer.from(await download.arrayBuffer()), revisedPrompt: entry.revised_prompt }
  }
  const error = new Error('生图服务没有返回图片')
  error.retryable = !data
  throw error
}

/**
 * 生成一张图。网关抖动时自动重试一次。
 * @param {object} image - 设置里的生图配置。
 * @param {string} prompt - 提示词。
 * @param {{fetchImpl?: typeof fetch, signal?: AbortSignal}} [options]
 * @returns {Promise<{buffer: Buffer, ext: string}>} 图片内容和扩展名。
 */
export async function generateImage(image, prompt, { fetchImpl = fetch, signal, size } = {}) {
  let lastError = null
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const timeout = AbortSignal.timeout(TIMEOUT_MS)
    const combined = signal ? AbortSignal.any([signal, timeout]) : timeout
    try {
      const { buffer } = await requestOnce(image, prompt, fetchImpl, combined, size)
      if (buffer.length > MAX_IMAGE_BYTES) throw new Error('图片太大')
      const ext = extensionOf(buffer)
      if (!ext) throw new Error('返回的内容不是图片')
      return { buffer, ext }
    } catch (err) {
      if (signal?.aborted) throw err
      lastError = err
      const network = err.name === 'TypeError' || err.name === 'TimeoutError'
      if (!err.retryable && !network) break
    }
  }
  const message = lastError.name === 'TimeoutError' ? '生图超时，可以重试' : lastError.name === 'TypeError' ? `连不上生图服务：${redact(lastError.cause?.code ?? lastError.message, image.apiKey)}` : redact(lastError.message, image.apiKey)
  throw new Error(message)
}

const COVER_STYLE = 'Editorial cover image, striking composition with calm negative space in the lower third, refined and cinematic, no text, no letters, no logo.'
const FIGURE_STYLE = 'Editorial article illustration, refined and consistent with a modern magazine, no text, no letters, no logo.'
const SHOT_STYLE = 'Film storyboard panel, black and white pencil line art sketch, loose confident lines, no color, plain white paper background, no text, no letters, no captions, no panel numbers.'

export function coverPrompt(prompt) {
  return `${COVER_STYLE} ${prompt}`
}

export function figurePrompt(prompt) {
  return `${FIGURE_STYLE} ${prompt}`
}

export function shotPrompt(prompt, characters) {
  return `${SHOT_STYLE} Vertical 9:16 portrait framing for a phone screen, the subject fills the frame top to bottom. ${characters ? `Recurring characters and setting: ${characters}. ` : ''}${prompt}`
}

/** 分镜按竖版画：把「宽x高」换成「高x宽」里更窄的那个在前。空尺寸原样返回。 */
export function portraitSize(size) {
  const match = /^(\d+)\s*[x×]\s*(\d+)$/i.exec(String(size ?? '').trim())
  if (!match) return size
  const [a, b] = [Number(match[1]), Number(match[2])]
  return `${Math.min(a, b)}x${Math.max(a, b)}`
}
