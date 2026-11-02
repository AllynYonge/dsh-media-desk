// 一键保存：把成稿写成一个普通文件夹，脚本、封面、配图和分镜都在里面。
import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { extname, join } from 'node:path'

export function defaultExportDir() {
  return join(homedir(), 'Documents', '自媒体工作台')
}

export function resolveExportDir(value) {
  const dir = String(value ?? '').trim()
  if (!dir) return defaultExportDir()
  return dir.startsWith('~/') ? join(homedir(), dir.slice(2)) : dir
}

function folderName(title) {
  const clean = String(title ?? '').replace(/[\\/:*?"<>|\n\r\t]/g, ' ').replace(/\s+/g, ' ').replace(/^[.\s]+|[.\s]+$/g, '').slice(0, 60)
  return clean || '未命名'
}

function cell(text) {
  return String(text ?? '').replace(/\|/g, '｜').replace(/\n/g, ' ')
}

/**
 * @param {object} production - 成稿。
 * @param {{filesDir: string, exportDir: string, videoCover?: Buffer}} options - 素材目录、保存位置和合成好的视频封面。
 * @returns {Promise<{path: string, files: string[]}>} 文件夹路径和写入的文件名。
 */
export async function saveProduction(production, { filesDir, exportDir, videoCover }) {
  const target = production.savedPath || join(exportDir, folderName(production.title))
  await mkdir(target, { recursive: true })
  const files = []

  const copy = async (asset, name) => {
    const match = /^media-desk\/files\/([\w.-]+)$/.exec(asset?.src ?? '')
    if (!match) return null
    const file = `${name}${extname(match[1])}`
    await copyFile(join(filesDir, match[1]), join(target, file))
    files.push(file)
    return file
  }

  const cover = await copy(production.cover, '封面原图')
  if (videoCover) {
    await writeFile(join(target, '视频封面.jpg'), videoCover)
    files.push('视频封面.jpg')
  }
  const figures = []
  for (const [i, image] of (production.images ?? []).entries()) {
    figures.push({ image, file: await copy(image, `配图${i + 1}`) })
  }
  const shots = []
  for (const [i, shot] of (production.shots ?? []).entries()) {
    shots.push({ shot, file: await copy(shot, `分镜${String(i + 1).padStart(2, '0')}`) })
  }

  // 配图放回对应小标题那一节的末尾
  const sections = String(production.article ?? '').split(/\n(?=##\s)/)
  const unplaced = []
  for (const { image, file } of figures) {
    if (!file) continue
    const line = `\n\n![${image.caption ?? ''}](${file})`
    const at = sections.findIndex(part => image.anchor && part.startsWith(`## ${image.anchor}`))
    if (at >= 0) sections[at] = `${sections[at].trimEnd()}${line}\n`
    else unplaced.push(line)
  }
  const article = `# ${production.title}\n\n${sections.join('\n')}${unplaced.join('')}\n`
  await writeFile(join(target, '脚本.md'), article)
  files.push('脚本.md')

  if (shots.length) {
    const rows = shots.map(({ shot, file }, i) => `| ${i + 1} | ${cell(shot.shot)} | ${shot.seconds ?? ''} 秒 | ${cell(shot.visual)} | ${cell(shot.voice)} | ${file ? `![](${file})` : ''} |`)
    await writeFile(join(target, '分镜脚本.md'), `# ${production.title}：分镜头脚本\n\n| 镜号 | 景别 | 时长 | 画面 | 口播 | 分镜图 |\n| --- | --- | --- | --- | --- | --- |\n${rows.join('\n')}\n`)
    files.push('分镜脚本.md')
  }
  return { path: target, files }
}
