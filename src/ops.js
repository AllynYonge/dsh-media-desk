// 工作台的唯一写入口：对话、界面操作都走这里，统一校验字段并产出回执。
// 模型输出也是不可信输入，所以这里只放行白名单字段。

export const STATUSES = ['idea', 'outline', 'draft', 'ready', 'published']
export const STATUS_LABEL = { idea: '灵感', outline: '大纲', draft: '草稿', ready: '待发布', published: '已发布' }
export const KINDS = ['image', 'video', 'web', 'quote', 'note']
export const PLATFORMS = ['公众号', '小红书', '抖音', 'B站', '视频号', 'X']

const ITEM_FIELDS = {
  title: 'text', body: 'text', kind: 'kind', url: 'url', source: 'text', tags: 'list', status: 'status', angleId: 'id',
  personaIds: 'list', parentId: 'id', rel: 'text', scheduledAt: 'date', platform: 'platform', pinned: 'bool', media: 'media', pos: 'pos', score: 'num',
}
const PERSON_FIELDS = { name: 'text', role: 'text', note: 'text', traits: 'list', tone: 'num' }
const ANGLE_FIELDS = { name: 'text', hook: 'text', prompt: 'text' }
const STYLE_FIELDS = { name: 'text', icon: 'text', summary: 'text', tone: 'text', sentences: 'text', opening: 'text', structure: 'text', words: 'list', avoid: 'list', samples: 'list' }
const SKILL_FIELDS = { name: 'text', rule: 'text', source: 'text', status: 'text', confidence: 'num', evidence: 'text' }
const METRIC_FIELDS = { itemId: 'id', platform: 'platform', date: 'date', views: 'num', likes: 'num', comments: 'num', shares: 'num', saves: 'num' }
const ACCOUNT_FIELDS = { platform: 'text', handle: 'text', url: 'url', followers: 'num', note: 'text', title: 'text', description: 'text', avatar: 'url', fetchedAt: 'date', fetchError: 'text' }

let counter = 0
export function newId(prefix = 'x') {
  counter += 1
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`
}

function isHttpUrl(value) {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

function coerce(type, value) {
  switch (type) {
    case 'text': return typeof value === 'string' ? value.slice(0, 40000) : undefined
    case 'id': return value === null || typeof value === 'string' ? value : undefined
    case 'kind': return KINDS.includes(value) ? value : undefined
    case 'status': return STATUSES.includes(value) ? value : undefined
    case 'platform': return value === null || PLATFORMS.includes(value) ? value : undefined
    case 'list': return Array.isArray(value) ? value.filter(v => typeof v === 'string').slice(0, 24) : undefined
    case 'bool': return typeof value === 'boolean' ? value : undefined
    case 'num': return Number.isFinite(value) ? value : undefined
    case 'url': return value === null || value === '' ? null : isHttpUrl(value) ? value : undefined
    case 'date': return value === null ? null : typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? new Date(value).toISOString() : undefined
    case 'pos': return value && [value.x, value.y].every(Number.isFinite) ? { x: value.x, y: value.y, r: Number.isFinite(value.r) ? value.r : 0 } : undefined
    case 'media': {
      if (value === null) return null
      if (!value || typeof value.src !== 'string') return undefined
      // 媒体只允许插件自己的相对路径或 http(s) 地址
      const local = /^media-desk\/(assets|files)\/[\w.-]+$/.test(value.src)
      if (!local && !isHttpUrl(value.src)) return undefined
      const poster = typeof value.poster === 'string' && (/^media-desk\/(assets|files)\/[\w.-]+$/.test(value.poster) || isHttpUrl(value.poster)) ? value.poster : undefined
      return { src: value.src, ...(poster ? { poster } : {}), ...(Number.isFinite(value.w) ? { w: value.w } : {}), ...(Number.isFinite(value.h) ? { h: value.h } : {}) }
    }
    default: return undefined
  }
}

function pick(fields, input) {
  const out = {}
  for (const [key, type] of Object.entries(fields)) {
    if (input?.[key] === undefined) continue
    const value = coerce(type, input[key])
    if (value !== undefined) out[key] = value
  }
  return out
}

function findById(list, id) {
  const entry = list.find(row => row.id === id)
  if (!entry) throw new Error(`找不到对象：${id}`)
  return entry
}

function short(text, n = 22) {
  const s = String(text || '').trim()
  return s.length > n ? `${s.slice(0, n)}…` : s
}

export function fmtWhen(iso) {
  if (!iso) return '未排期'
  const d = new Date(iso)
  const pad = v => String(v).padStart(2, '0')
  return `${d.getMonth() + 1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const handlers = {
  add_item(state, op, now) {
    const fields = pick(ITEM_FIELDS, op)
    const item = {
      id: newId('it'), kind: 'note', title: '', body: '', tags: [], status: 'idea', personaIds: [], createdAt: now, drafts: {}, ...fields,
    }
    if (!item.title && !item.body && !item.media) throw new Error('灵感内容为空')
    if (!item.title) item.title = short(item.body, 28)
    // 新灵感落在首屏文字旁边，一眼就能看到，也不会打乱已有布局
    if (!item.pos && !item.parentId) {
      const n = state.items.filter(row => !row.parentId && row.pos).length
      const scale = 1 + (n % 6) * 0.2
      item.pos = { x: Math.round(Math.cos(n * 2.39996) * 580 * scale), y: Math.round(Math.sin(n * 2.39996) * 340 * scale), r: ((n % 5) - 2) * 1.2 }
    }
    state.items.unshift(item)
    return { text: `记下灵感《${short(item.title)}》`, target: item.id, kind: 'item' }
  },
  update_item(state, op) {
    const item = findById(state.items, op.id)
    const fields = pick(ITEM_FIELDS, op)
    Object.assign(item, fields)
    const names = Object.keys(fields).filter(key => key !== 'pos')
    return names.length ? { text: `更新《${short(item.title)}》`, target: item.id, kind: 'item' } : null
  },
  delete_item(state, op) {
    const item = findById(state.items, op.id)
    state.items = state.items.filter(row => row.id !== op.id)
    for (const child of state.items) if (child.parentId === op.id) child.parentId = item.parentId ?? null
    state.metrics = state.metrics.filter(row => row.itemId !== op.id)
    return { text: `删除《${short(item.title)}》` }
  },
  schedule_item(state, op) {
    const item = findById(state.items, op.id)
    const when = coerce('date', op.scheduledAt)
    if (when === undefined) throw new Error('排期时间无效')
    item.scheduledAt = when
    const platform = coerce('platform', op.platform)
    if (platform !== undefined) item.platform = platform
    if (when && item.status === 'idea') item.status = 'outline'
    return { text: when ? `把《${short(item.title)}》排到 ${fmtWhen(when)}${item.platform ? ` · ${item.platform}` : ''}` : `取消《${short(item.title)}》的排期`, target: item.id, kind: 'item' }
  },
  set_status(state, op) {
    const item = findById(state.items, op.id)
    const status = coerce('status', op.status)
    if (!status) throw new Error('状态无效')
    item.status = status
    if (status === 'published' && !item.publishedAt) item.publishedAt = new Date().toISOString()
    return { text: `《${short(item.title)}》状态改为「${STATUS_LABEL[status]}」`, target: item.id, kind: 'item' }
  },
  save_draft(state, op, now) {
    const item = findById(state.items, op.id)
    const format = op.format === 'script' ? 'script' : 'article'
    if (typeof op.text !== 'string') throw new Error('草稿内容无效')
    const previous = item.drafts?.[format]
    item.drafts = { ...item.drafts, [format]: { text: op.text.slice(0, 200000), by: op.by === 'ai' ? 'ai' : 'user', engine: typeof op.engine === 'string' ? op.engine : undefined, at: now, aiText: op.by === 'ai' ? op.text : previous?.aiText } }
    if (['idea', 'outline'].includes(item.status)) item.status = 'draft'
    return { text: `保存《${short(item.title)}》的${format === 'script' ? '脚本' : '文章'}`, target: item.id, kind: 'item' }
  },
  update_production(state, op) {
    const item = findById(state.items, op.id)
    if (!item.production) throw new Error('这条灵感还没有成稿')
    if (typeof op.title === 'string') item.production.title = op.title.slice(0, 200)
    if (typeof op.coverText === 'string') item.production.coverText = op.coverText.slice(0, 40)
    if (typeof op.article === 'string') item.production.article = op.article.slice(0, 200000)
    return { text: `修改《${short(item.production.title)}》`, target: item.id, kind: 'item' }
  },
  add_person(state, op, now) {
    const person = { id: newId('p'), name: '', role: '目标读者', note: '', traits: [], tone: Math.floor(Math.random() * 6), createdAt: now, ...pick(PERSON_FIELDS, op) }
    if (!person.name) throw new Error('人物需要名字')
    state.people.push(person)
    return { text: `添加人物「${person.name}」`, target: person.id, kind: 'person' }
  },
  update_person(state, op) {
    const person = findById(state.people, op.id)
    Object.assign(person, pick(PERSON_FIELDS, op))
    return { text: `更新人物「${person.name}」`, target: person.id, kind: 'person' }
  },
  delete_person(state, op) {
    const person = findById(state.people, op.id)
    state.people = state.people.filter(row => row.id !== op.id)
    for (const item of state.items) item.personaIds = (item.personaIds || []).filter(id => id !== op.id)
    return { text: `删除人物「${person.name}」` }
  },
  add_angle(state, op, now) {
    const angle = { id: newId('a'), name: '', hook: '', prompt: '', createdAt: now, ...pick(ANGLE_FIELDS, op) }
    if (!angle.name) throw new Error('角度需要名字')
    state.angles.push(angle)
    return { text: `添加创作角度「${angle.name}」`, target: angle.id, kind: 'angle' }
  },
  update_angle(state, op) {
    const angle = findById(state.angles, op.id)
    Object.assign(angle, pick(ANGLE_FIELDS, op))
    return { text: `更新创作角度「${angle.name}」`, target: angle.id, kind: 'angle' }
  },
  delete_angle(state, op) {
    const angle = findById(state.angles, op.id)
    state.angles = state.angles.filter(row => row.id !== op.id)
    for (const item of state.items) if (item.angleId === op.id) item.angleId = null
    return { text: `删除创作角度「${angle.name}」` }
  },
  add_style(state, op, now) {
    const style = { id: newId('st'), source: '手动', createdAt: now, words: [], avoid: [], samples: [], ...pick(STYLE_FIELDS, op) }
    if (!style.name) throw new Error('风格需要名字')
    state.styles = [style, ...(state.styles ?? [])]
    return { text: `添加风格「${style.name}」`, target: style.id, kind: 'style' }
  },
  update_style(state, op) {
    const style = findById(state.styles ?? [], op.id)
    Object.assign(style, pick(STYLE_FIELDS, op))
    return { text: `更新风格「${style.name}」` }
  },
  delete_style(state, op) {
    const style = findById(state.styles ?? [], op.id)
    state.styles = state.styles.filter(row => row.id !== op.id)
    if (state.activeStyleId === op.id) state.activeStyleId = null
    return { text: `删除风格「${style.name}」` }
  },
  set_style(state, op) {
    if (op.id === null) {
      state.activeStyleId = null
      return { text: '不再使用特定风格' }
    }
    const style = findById(state.styles ?? [], op.id)
    state.activeStyleId = style.id
    return { text: `之后按「${style.name}」的风格写` }
  },
  add_skill(state, op, now) {
    const skill = { id: newId('s'), name: '', rule: '', source: '对话', status: 'proposed', confidence: 0.5, createdAt: now, ...pick(SKILL_FIELDS, op) }
    if (!skill.name || !skill.rule) throw new Error('Skill 需要名字和规则')
    state.skills.unshift(skill)
    return { text: `沉淀规则「${skill.name}」`, target: skill.id, kind: 'skill' }
  },
  update_skill(state, op) {
    const skill = findById(state.skills, op.id)
    Object.assign(skill, pick(SKILL_FIELDS, op))
    return { text: `更新规则「${skill.name}」`, target: skill.id, kind: 'skill' }
  },
  delete_skill(state, op) {
    const skill = findById(state.skills, op.id)
    state.skills = state.skills.filter(row => row.id !== op.id)
    return { text: `删除规则「${skill.name}」` }
  },
  add_metric(state, op) {
    const metric = { id: newId('m'), date: new Date().toISOString(), views: 0, likes: 0, comments: 0, shares: 0, saves: 0, ...pick(METRIC_FIELDS, op) }
    if (!metric.platform) throw new Error('数据需要平台')
    state.metrics.push(metric)
    return { text: `记录 ${metric.platform} 数据 ${metric.views} 阅读` }
  },
  add_account(state, op, now) {
    const account = { id: newId('ac'), platform: '', handle: '', url: null, followers: null, createdAt: now, ...pick(ACCOUNT_FIELDS, op) }
    if (!account.platform && !account.handle && !account.url) throw new Error('账号信息为空')
    state.accounts.push(account)
    return { text: `添加账号档案「${account.handle || account.title || account.platform}」`, target: account.id, kind: 'account' }
  },
  update_account(state, op) {
    const account = findById(state.accounts, op.id)
    Object.assign(account, pick(ACCOUNT_FIELDS, op))
    return { text: `更新账号档案「${account.handle || account.title || account.platform}」` }
  },
  delete_account(state, op) {
    findById(state.accounts, op.id)
    state.accounts = state.accounts.filter(row => row.id !== op.id)
    return { text: '删除账号档案' }
  },
  clear_samples(state) {
    state.items = state.items.filter(row => !row.sample)
    state.people = state.people.filter(row => !row.sample)
    state.angles = state.angles.filter(row => !row.sample)
    state.metrics = state.metrics.filter(row => !row.sample)
    state.accounts = state.accounts.filter(row => !row.sample)
    state.skills = state.skills.filter(row => !row.sample)
    state.styles = (state.styles ?? []).filter(row => !row.sample)
    if (!state.styles.some(row => row.id === state.activeStyleId)) state.activeStyleId = null
    state.sampleCleared = true
    return { text: '已清空全部示例数据' }
  },
}

/**
 * 依次执行一批操作。任何一条失败都不影响已成功的操作，失败写进回执。
 * @param {object} state - 会被就地修改的状态。
 * @param {Array<object>} ops - 操作列表。
 * @returns {{receipts: Array<object>, errors: string[]}} 面向用户的回执。
 */
export function applyOps(state, ops) {
  const receipts = []
  const errors = []
  const now = new Date().toISOString()
  for (const op of Array.isArray(ops) ? ops : []) {
    const handler = Object.hasOwn(handlers, op?.op) ? handlers[op.op] : undefined
    if (!handler) {
      errors.push(`不支持的操作：${String(op?.op)}`)
      continue
    }
    try {
      const receipt = handler(state, op, now)
      if (receipt) receipts.push(receipt)
    } catch (err) {
      errors.push(err.message)
    }
  }
  return { receipts, errors }
}
