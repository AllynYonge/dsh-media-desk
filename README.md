# 自媒体工作台

一个 DeepSeek Harness 插件。一句话记下灵感，一键成稿：口播脚本、标题、视频封面、配图和黑白线稿分镜同时生成，再用自然语言实时修改。

*A self-media workbench plugin for DeepSeek Harness: capture ideas, generate a spoken script, title, video cover, figures and a line-art storyboard in one click, then edit everything by chatting.*

支持 Mac 桌面版和网页版，要求 DeepSeek Harness `0.2.1-rc.5` 及以上的 `0.2.x`。

![灵感墙](docs/screenshots/home.jpg)

## 功能

- **灵感：** 灵感可以散落在无限画布上，也可以按时间排成信息流。一句话或一个链接就能记下来。
- **一键成稿：** 点开灵感，左边是对话，右边是稿面。脚本、标题、视频封面、配图和分镜同时生成，一边生成一边填满。说「标题再短一点」「第 3 镜换成俯拍」，右边实时改。
- **排期：** 发布排期和灵感日历合在一张日历上，把成稿直接拖到某一天。
- **复盘：** 看趋势、平台分布和表现最好的内容，并从数据里提炼写作规则。数据可以手动录入、粘贴 CSV，或者抓取自己的账号。
- **风格：** 内置科技数码、旅行探店、Vlog 生活等 8 个板块的 15 种博主预设，选一种就能开写。也可以抓取自己的账号、贴自己的内容，提炼出专属风格。

| 排期 | 复盘 | 风格 |
| --- | --- | --- |
| ![排期](docs/screenshots/schedule.jpg) | ![复盘](docs/screenshots/insights.jpg) | ![风格](docs/screenshots/style.jpg) |

## 安装

从 [Releases](https://github.com/woniuniuniu/dsh-media-desk/releases) 下载 `dsh-media-desk-*.tgz`，放到一个不会被删除的固定位置，然后在那个文件夹里执行下面的命令。终端里没有 `dsh` 的话，先在桌面版菜单里选择「管理 dsh 命令」。

**桌面版：** 先至少打开过一次应用，然后完全退出（⌘Q），再执行：

```bash
dsh plugin --profile desktop add "file:$PWD/dsh-media-desk-2.4.0.tgz"
```

**网页版：** 执行后重新启动 `dsh web`。

```bash
dsh plugin --profile web add "file:$PWD/dsh-media-desk-2.4.0.tgz"
```

装好后，侧栏会出现「自媒体工作台」。卸载时把 `add` 换成 `remove dsh-media-desk`，你的内容会保留在 `$DSH_HOME/media-desk/`（默认 `~/.dsh/media-desk/`）。

## 开始使用

第一次打开看到的都是示例数据，这样你能先看到每个页面的样子。点右上角的「示例数据 · 清空」，就能换成自己的内容。风格预设不算示例数据，清空后还在。

## 需要你自己准备的 Key

插件不带任何密钥，所有费用都走你自己的账号。

| 功能 | 怎么接入 | 不接入会怎样 |
| --- | --- | --- |
| 文字 | 使用 DeepSeek Harness 当前的默认模型，消耗你自己的额度 | 只能生成结构草稿 |
| 生图 | 在插件的设置里填接口地址、模型和你自己的 API Key，点「试画一张」确认 | 仍会生成脚本、分镜文案和纯文字视频封面 |
| 抓取账号（可选） | 接入第三方服务 Monid，见下文 | 可以手动录入数据，或者贴内容提炼风格 |

**生图：** 支持任何兼容 OpenAI 图片接口（`POST {接口地址}/images/generations`）的服务。设置里预填了 OpenAI、xAI、火山方舟、智谱和硅基流动的地址，也可以选「其他自定义」。预设的地址没有逐家实测，模型名以各家文档为准。一次成稿默认生成 9 张图，数量可以在设置里调整。密钥只保存在本机的 `settings.json`（权限 600），不会写进内容数据，也不会发给文字模型。

## 抓取自己的账号

在「风格」或「复盘」页点抓取，贴上自己的小红书、抖音或 B 站主页链接。插件会读取最近 20 条公开内容和互动数据，放进内容和复盘，并提炼成你的风格。再抓一次只更新数字，不会重复。

这个功能通过第三方服务 [Monid](https://monid.ai) 实现，按次收费，一个账号大约几分钱。第一次使用时：

1. 把这句话发给 DeepSeek Harness 的新会话：

   ```text
   set up https://monid.ai/SKILL.md
   ```

2. 到 [Monid 后台](https://app.monid.ai/access/api-keys) 注册并创建密钥。
3. 在终端保存密钥，不要把它发在聊天里：

   ```bash
   monid keys add -k 你的密钥 -l main
   ```

插件只调用本机的 `monid` 命令，不读也不存这个密钥。

请注意：

- 请只抓取你自己的账号。
- 账号链接会发给 Monid 和它的数据服务商。使用前请确认这符合你和相关平台的条款。
- 只能读到公开内容。小红书和抖音的公开接口读不到播放量，复盘会改按互动来算。
- 抓取依据的是内容列表，小红书正文约 100 字，抖音是文案，B 站大多只有标题，提炼出的风格可以再手动调整。
- 公众号、视频号和 X 还不支持抓取，可以贴内容或贴公开链接来提炼。

## 限制

- 不会替你发布：平台没有统一接口，复制脚本或保存文件夹后自己发。
- 保存的文件夹默认在 `~/Documents/自媒体工作台/`，里面有脚本、分镜脚本、视频封面、配图和分镜图。

## 开发

```bash
npm install
npm test                   # Host 逻辑测试
npm run build              # 打包前端到 dist/
npm run watch              # 监听 client/ 并重新打包
npm pack                   # 生成可安装的 tgz
scripts/dev-sandbox.sh     # 在隔离的 DSH_HOME 里启动 Web 版，不影响 ~/.dsh
node scripts/mock-llm.mjs  # 本地模拟文字和生图模型，不消耗额度
```

`scripts/mock-monid.mjs` 是一个假的 `monid` 命令，内容都是编的，用来在不花钱的情况下测试抓取流程。把它包成名为 `monid` 的可执行文件，放在 `PATH` 最前面即可。

```text
client/
  index.jsx    入口和顶部导航
  canvas.jsx   灵感墙和信息流
  studio.jsx   一键成稿工作区
  chat.jsx     对话
  content.jsx  内容管理
  schedule.jsx 排期日历
  insights.jsx 复盘
  style.jsx    风格
  connect.jsx  Monid 引导和账号抓取
  cover.js     合成视频封面
src/
  host.js      /media-desk/* 接口
  produce.js   成稿流水线
  ai.js        提示词和模型调用
  images.js    生图接口
  style.js     风格提炼
  style-presets.js 风格预设
  monid.js     通过 Monid 抓取账号
  harvest.js   读取网页
  learn.js     规则提炼、复盘汇总、Skill 导出
  store.js     本地存储
  seed.js      示例数据
scripts/gen-assets.py  生成示例图片和视频，全部是程序绘制
```

修改 `src/` 下的 Host 代码后需要重启 DeepSeek Harness。

## 安全

- 每个 `/media-desk/*` 请求都经过 Host 鉴权，默认拒绝。
- 模型输出和抓取到的内容都当作不可信数据：只取固定字段并限制长度，操作走白名单校验。
- 粘贴的链接不能访问本机和内网地址，每次跳转都会重新检查。
- 调用 `monid` 时不经过 shell，端点和条数都是写死的，账号 ID 只接受固定格式。

发现安全问题请通过 GitHub 的 [Security Advisories](https://github.com/woniuniuniu/dsh-media-desk/security/advisories/new) 私下报告。

## 许可证

[MIT](LICENSE)
