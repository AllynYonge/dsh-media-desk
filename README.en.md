<p align="center">
  <a href="README.md">简体中文</a> · <b>English</b>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/hero-en-dark.webp">
    <img src="docs/assets/hero-en-light.webp" alt="Media Desk: the creator desk for DeepSeek Harness" width="100%">
  </picture>
</p>

<p align="center">
  A content-creator plugin for DeepSeek Harness. Jot down an idea in one line, generate a spoken script, title, video cover, figures and storyboard in one click, then refine it all by chatting.
</p>

<p align="center">
  <a href="https://github.com/woniuniuniu/dsh-media-desk/releases/latest"><img alt="DSH 0.2.x" src="https://img.shields.io/badge/DeepSeek%20Harness-0.2.x-4B67B4?style=flat-square&labelColor=2B3245"></a>
  <a href="LICENSE"><img alt="License MIT" src="https://img.shields.io/badge/license-MIT-4B67B4?style=flat-square&labelColor=2B3245"></a>
  <a href="https://github.com/woniuniuniu/dsh-media-desk/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/woniuniuniu/dsh-media-desk?style=flat-square&label=release&color=4B67B4&labelColor=2B3245"></a>
  <a href="https://github.com/woniuniuniu/dsh-media-desk/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/woniuniuniu/dsh-media-desk?style=flat-square&logo=github&label=Star&color=4B67B4&labelColor=2B3245"></a>
</p>

<br>

<h3 align="center">One click, and the whole page fills in</h3>

<p align="center">Open an idea and the layout is already there. Title, script, video cover, figures and a line-art storyboard are generated at the same time, filling the grid as they arrive.</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/f-studio-dark.webp">
    <img src="docs/assets/f-studio-light.webp" width="100%" alt="The studio: chat on the left; title, cover, script and a six-frame storyboard on the right">
  </picture>
</p>

<p align="center"><sub>Say "shorter title" or "make shot 3 a top-down view" on the left and the right side updates live. Edit the script in place, copy it, or save everything, cover and storyboard included, as one folder.</sub></p>

<br>

<h3 align="center">One line to capture an idea</h3>

<p align="center">Ideas scatter across an infinite canvas, or line up as a time-sorted feed. Paste images, videos, links, quotes and notes. The assistant on the right can change anything with a sentence.</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/f-home-dark.webp">
    <img src="docs/assets/f-home-light.webp" width="100%" alt="The idea wall as a scattered canvas and as a feed">
  </picture>
</p>

<br>

<h3 align="center">Drag a finished piece onto the calendar</h3>

<p align="center">The idea calendar and the publishing schedule are one calendar. Every day gets an idea stamp; drag a finished piece from the tray onto a day and it is scheduled.</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/f-schedule-dark.webp">
    <img src="docs/assets/f-schedule-light.webp" width="100%" alt="The schedule calendar with the next post and the tray of unscheduled pieces">
  </picture>
</p>

<br>

<h3 align="center">Review, then turn lessons into rules</h3>

<p align="center">Trend, platform split and your best pieces at a glance. Suggestions distilled from the numbers become writing rules with one click, and the rules can be exported as a DeepSeek Harness skill.</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/f-insights-dark.webp">
    <img src="docs/assets/f-insights-light.webp" width="100%" alt="Insights: a one-line summary, daily views, platform split, top pieces and advice">
  </picture>
</p>

<br>

<h3 align="center">Write in whichever voice you choose</h3>

<p align="center">Fifteen creator presets across eight categories, from tech and travel to vlogs and opinion. Pull your own account or paste a few of your posts to distill a voice that is yours. The content board keeps every piece sorted by status.</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/f-style-dark.webp">
    <img src="docs/assets/f-style-light.webp" width="100%" alt="Style presets grouped by category, and the content board">
  </picture>
</p>

<br>

<a id="download"></a>
<h3 align="center">Install</h3>

<p align="center">Download the package from Releases and add it to DeepSeek Harness with one command. Works on the Mac desktop app and the web version.</p>

<p align="center">
  <a href="https://github.com/woniuniuniu/dsh-media-desk/releases/latest"><img alt="Download from GitHub Releases" src="https://img.shields.io/badge/GitHub%20Releases-Download-4B67B4?style=for-the-badge&logo=github&logoColor=white&labelColor=2B3245"></a>
</p>

Requires DeepSeek Harness `0.2.1-rc.5` or later in the `0.2.x` line. Put `dsh-media-desk-*.tgz` somewhere permanent and run the command from that folder. If `dsh` is not on your terminal yet, choose "Manage dsh command" in the desktop app's menu first.

**Desktop:** open the app at least once, quit it completely (⌘Q), run the command, then reopen.

```bash
dsh plugin --profile desktop add "file:$PWD/dsh-media-desk-2.4.0.tgz"
```

**Web:** run the command, then restart `dsh web`.

```bash
dsh plugin --profile web add "file:$PWD/dsh-media-desk-2.4.0.tgz"
```

"自媒体工作台" appears in the sidebar. The first launch shows sample data so you can see every page; click "示例数据 · 清空" (clear samples) in the top right to start with your own. To uninstall, replace `add` with `remove dsh-media-desk`; your content stays in `~/.dsh/media-desk/`.

The interface is in Chinese.

## What it does

- **Ideas:** a sentence, a link, an image or a video, scattered on a canvas or lined up as a feed.
- **One-click production:** spoken script, title, video cover, figures and line-art storyboard generated together; edit by chatting or in place; copy, or save as a folder.
- **Schedule:** ideas and publishing on one calendar; drag a finished piece onto a day.
- **Insights:** enter numbers by hand, paste CSV or pull your own account; see trends, platforms and top pieces; distill writing rules and export them as a DeepSeek Harness skill.
- **Styles:** fifteen creator presets plus voices distilled from your own writing.
- **Assistant:** every page has a chat on the right; every step can be undone.

It does not publish for you: platforms have no common API, so copy the script or save the folder and post it yourself.

## Keys you bring yourself

The plugin ships with no credentials. Everything is billed to your own accounts.

| Feature | How to connect | Without it |
| --- | --- | --- |
| Text | Uses the default model configured in DeepSeek Harness, on your own quota | Only a structural draft |
| Images | Enter an endpoint, model and your own API key in the plugin settings, then click "试画一张" (test) | Script, storyboard text and a typographic video cover still work |
| Account import (optional) | Connect the third-party service Monid, see below | Enter numbers by hand, or paste posts to distill a style |

**Images:** any service compatible with the OpenAI images API (`POST {endpoint}/images/generations`). Settings come pre-filled with OpenAI, xAI, Volcengine Ark, Zhipu and SiliconFlow endpoints, plus a custom option. The presets were not each verified; check model names against the provider's docs. One production generates 9 images by default, adjustable in settings. The key lives only in the local `settings.json` (mode 600), never in content data and never sent to the text model.

## Importing your own account

In Styles or Insights, click import and paste your own Xiaohongshu, Douyin or Bilibili profile URL. The plugin reads your latest 20 public posts with their engagement numbers, adds them to content and insights, and distills your style. Importing again only updates the numbers.

This goes through the third-party service [Monid](https://monid.ai), billed per call, roughly a few cents per account. First time:

1. Send this line to a new DeepSeek Harness session:

   ```text
   set up https://monid.ai/SKILL.md
   ```

2. Sign up at the [Monid dashboard](https://app.monid.ai/access/api-keys) and create a key.
3. Save the key in your terminal, never in chat:

   ```bash
   monid keys add -k YOUR_KEY -l main
   ```

The plugin only runs the local `monid` command; it never reads or stores the key.

## FAQ

<details>
<summary><b>Is this affiliated with DeepSeek?</b></summary>
<br>

No. It is a community plugin for DeepSeek Harness. Text is generated by whichever model you configured in DeepSeek Harness and billed to your own account.

</details>

<details>
<summary><b>Where is my data?</b></summary>
<br>

All local, in `~/.dsh/media-desk/`. The image key is in `settings.json` in the same folder. Saved productions go to `~/Documents/自媒体工作台/` by default, as a folder with the script, storyboard, video cover, figures and storyboard frames.

</details>

<details>
<summary><b>Is account import safe?</b></summary>
<br>

Import only your own account. The profile URL is sent to Monid and its data providers; make sure this is fine under your platform's terms. Only public data is readable: Xiaohongshu and Douyin's public endpoints do not expose view counts, so insights fall back to engagement. The style is distilled from the post list (about 100 characters per Xiaohongshu post, captions on Douyin, mostly titles on Bilibili), so edit the result as you like. WeChat, Channels and X are not supported yet; paste content or public links instead.

</details>

<details>
<summary><b>Does it work without an image model?</b></summary>
<br>

Yes. Script, title and storyboard text are generated as usual, and the video cover is composed as a typographic version. Connect an image model and the cover, figures and storyboard frames are drawn too.

</details>

## Development

```bash
npm install
npm test                   # host logic tests
npm run build              # bundle the client into dist/
npm run watch              # rebuild on client/ changes
npm pack                   # produce the installable tgz
scripts/dev-sandbox.sh     # run the web version in an isolated DSH_HOME
node scripts/mock-llm.mjs  # local mock text and image models, no quota spent
```

`scripts/mock-monid.mjs` is a fake `monid` command with made-up content, for testing the import flow without spending anything. Wrap it as an executable named `monid` at the front of your `PATH`.

| Path | Contents |
| --- | --- |
| `client/` | UI: idea wall, studio, chat, content, schedule, insights, styles, settings |
| `src/` | host routes, production pipeline, prompts, image generation, style distillation, Monid import, local store |
| `scripts/` | bundling, sandbox, mock models, sample asset generation |
| `assets/` | sample images and videos, all drawn programmatically by `scripts/gen-assets.py` |
| `docs/assets/` | the images on this page |

Restart DeepSeek Harness after changing host code in `src/`.

## Security

- Every `/media-desk/*` request is authenticated by the host and fails closed.
- Model output and fetched content are untrusted: fixed fields, length limits, allow-listed operations.
- Pasted links can never reach localhost or private networks; every redirect is re-checked.
- `monid` runs without a shell, with hard-coded endpoints and counts; account IDs must match fixed formats.

Report security issues privately through [Security Advisories](https://github.com/woniuniuniu/dsh-media-desk/security/advisories/new).

## License

[MIT](LICENSE). DeepSeek Harness and its name and marks belong to their owners; this is a community plugin, not affiliated with DeepSeek.
