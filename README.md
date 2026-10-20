# cinematic-science-film

**用代码做「电影感」的科学短片。**

一个 Agent Skill：把一条定理、一个证明、一条物理定律，拍成 84–180 秒的**一个连续世界**；
配乐写成 ABC 谱，和画面共用同一条小节网格；混音不靠耳朵猜，用探针把「咚」定位到频段和相位。

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Standard-green)](https://agentskills.io)
[![Runtime](https://img.shields.io/badge/Runtime-Claude%20Code%20·%20Codex%20·%20DSH-blueviolet)](#安装)

[中文](README.md) · [English](README.en.md)

![黎曼猜想，47 秒：零点成对亮起，ψ(x) 阶梯在修正素数的分布](docs/riemann-zeros.jpg)
![群论之美，152 秒：196883 维的魔群，一个方形走完十二幕](docs/group-theory-monster.jpg)

## 这是什么

不是渲染器，是**两份已交付片子的现场笔记**：哪些做法让画面显得贵，哪些做法让观众说「有点吵」，
以及每一条怎么在交付前用数字验一遍。

它建立在 [`huashu-motion`](https://github.com/alchaincyf/huashu-motion) 之上——`om` 负责渲染、
谱面引擎和工作室；本仓库只补上「科学题材 + 电影感 + 混音返工」这一段经验。**先装 huashu-motion。**

## 为什么它不一样

大多数「AI 做视频」的流程在**生成画面**这一步就结束了。这里真正花时间的是后面三件事：

| 问题 | 常见做法 | 这里的做法 |
|---|---|---|
| 画面像 PPT | 每段换一套视觉 | **一个世界、一个反复出现的对象**：黎曼片子里的那条竖线，同时是问题、数轴、临界线、片尾的破折号 |
| 音乐和画面对不上 | 先做画面，后期贴 BGM | 谱面的 `!mark:scene!` 和画面的 `scene:*` 落在**同一条小节线**上，`om sound` 报 0.0–0.3 % 速度偏差 |
| 「有点吵 / 一直有个咚」 | 把音量拉低一点 | 把低频/高频包络按小节长度**折叠**，看相位 0 有没有尖峰：只有峰在相位 0 才是「咚」；峰在中段、相位 0 更安静，那是呼吸 |

## 安装

```sh
npx skills add dboycht/cinematic-science-film
```

`skills` 会认出你在用的 agent（Claude Code、Codex、DSH 等）并把 skill 放进对应目录。也可以直接跟 agent 说：

```
帮我安装 cinematic-science-film 这个 skill（github.com/dboycht/cinematic-science-film），
再装它依赖的 huashu-motion，然后跑一遍 demo。
```

手工安装：把本仓库克隆到任意位置，把仓库根目录（含 `SKILL.md`）链接到 `~/.claude/skills/cinematic-science-film`
（Codex 用 `~/.codex/skills/`，DSH 用 `~/.dsh/skills/`）。

### 前置条件

- [`huashu-motion`](https://github.com/alchaincyf/huashu-motion)（必须；`om` CLI 随它安装）
- Node.js ≥ 22、Chrome、ffmpeg / ffprobe
- Windows：`om` 是 POSIX shim，要 `node <...>/cli/om.js` 调用；本仓库的探针会自动找 `huashu-motion/cli`，
  也可以用 `OM_CLI` 指定。开发与验收都在 Windows 上完成，macOS 未实测。

## 跑一遍 demo

`demo/riemann-lite/` 是能跑通全部验收项的最小片子：黎曼猜想，10 小节、100 BPM、24 秒配乐 + 1.2 秒收尾，
1920×1080、30 fps、2.39:1。

![demo：素数在竖轴上逐个点亮，每五个亮一个，画面不会在底部堆成一团](docs/demo-primes.jpg)

```powershell
$OM   = "$HOME\.claude\skills\huashu-motion\cli\om.js"
$DEMO = "<本仓库路径>\demo\riemann-lite"

node $OM check $DEMO                                  # 0 errors / 0 warnings
node $OM still $DEMO --at 0.6,9.5,17.5,21.5           # 看这四帧，不要只看日志
node $OM sound $DEMO                                  # 生成 assets/sound.wav，打印能量曲线
node scripts/probe-score.mjs $DEMO                    # 五个声部都结束在第 10 小节
node scripts/probe-pulse.mjs "$DEMO\assets\sound.wav" 1 4.5 2.4
node $OM render $DEMO --blur                          # → out/riemann-lite-v1.mp4
```

你会看到类似这样的输出（本次实测）：

```
0 errors, 0 warnings
LOW   end beat    40 = 10.00 bars      ← 五个声部都是这一行
marks open@0 primes@8 zeros@20 end@32
energy  open -24.4 · primes -21.1 · zeros -14.1 · end -16.6 dB RMS
P=2.40s low  peak at phase 1%  z(phase0) = 1.9
```

`z = 1.9` 是「每小节一次」的和弦起音（全音符 pad 在小节线上重新起音），低于 skill 的告警线
`|z| > 2.5`；真正要找的「咚」是 **0.6 s 一拍**的周期，而不是 2.4 s 一小节的和声变化。

## 仓库结构

```
cinematic-science-film/
├── SKILL.md                 # 给 agent 的入口：形状、Windows 现实、五个坑、混音、母版、验收清单
├── references/
│   ├── abc-and-score.md     # ABC 记谱的坑（D4 是「长度 4」不是「八度 4」）、声部表、力度记号
│   └── mix-and-master.md    # 两个探针怎么读、六层「咚」的清单、limiter 与 LUFS 目标
├── examples/
│   ├── riemann-film.md      # 84 秒：结构表、被否掉的五次、可复用的数字
│   └── group-theory-film.md # 180 秒：十二幕、无 drop、档案图像负片、采样包路线
├── scripts/
│   ├── probe-score.mjs      # 每个声部的结束拍；不一致就是记谱写错了
│   ├── probe-loud.mjs       # 0.1 s RMS + 高频能量
│   ├── probe-band.mjs       # <160 Hz 与残差，判断是底鼓还是镲
│   ├── probe-pulse.mjs      # 关键：按小节折叠包络，看相位 0；读峰值位置和符号，不只看 |z|
│   ├── set-score.mjs        # 把外部 .abc 写回 index.html（显式 UTF-8）
│   ├── mux-audio.ps1        # 只换音频：-c:v copy + limiter + ebur128 复测
│   └── lib/                 # WAV 读取、huashu-motion CLI 定位
├── demo/riemann-lite/       # 可运行的最小片子（源码、谱面、字体、treatment）
└── docs/                    # 两张案例静帧
```

## 方法：五条硬规则

1. **一个世界，一个反复出现的对象。** 每个场景都是同一个东西换一个距离看，所以三分钟可以零硬切。
2. **谱面就是时间轴。** 小节数、BPM、场景标签、`!mark!` 先定死，画面跟着网格走。先用
   `probe-score.mjs` 确认每个声部等长，再谈混音。
3. **先定位，再删除。** 「吵」从来不是推子的问题。低频 160 Hz 以下有 0.6 s 周期的峰 = 底鼓或钢琴低八度；
   高频每 0.6 s 尖一次 = 军鼓/镲；把包络折叠到小节上看相位，只有相位 0 的尖峰才是「咚」。
4. **让静止的东西真的在动。** 三团大范围柔光（r 700–900，α .03–.06）以 40–60 px/s 漂移、背景呼吸 ±8 %、
   摄影机永远有 ±10 px 的手持抖动、每几秒一道扫描带、一个沿曲线跑的高光点——这五样把 `om qa` 的
   motion 从 0.1 拉到 0.2–0.5，不改变节奏。
5. **交付前证明画面没动。** 只改音频时，`ffmpeg -map 0:v -c copy -f md5 -` 对新旧文件必须打印同一个
   摘要；有了这个证明，改一次混音是 10 秒，而不是重渲 5 400 帧。

## 两个已交付案例

| | 《黎曼猜想》 | 《群论之美》 |
|---|---|---|
| 时长 / 规格 | 84 s · 1920×1080 · 30 fps · 2.39:1 | 180 s · 1920×1080 · 30 fps · 2.40:1 |
| 音乐 | 100 BPM · 35 小节 · D 小调 | 80 BPM · 60 小节 · 8 声部真实采样 |
| 结构 | 10 场，从「一条线」到「1859 — ?」 | 12 场，一个方形走完八步、64 格、12 音级、魔群 |
| 母版 | −14.1 LUFS · −3.1 dBTP · LRA 8.9 | −14.0 LUFS · −2.0 dBFS · LRA 6.1 |
| 当时被否掉 | 五次「吵」：鼓、钢琴低八度、`impact`、`thud/subdrop`、反向镲 | 26 段「静止」里有 24 段是误报，2 段真的补了事件 |

两片的完整拆解在 [`examples/`](examples/)。

## 它不做什么

- **不替代 huashu-motion。** 没有它是跑不起来的；本仓库不包含渲染器。
- **不保证审美。** 规则能拦住「不是电影感」的常见原因，拦不住题材本身不好看。
- **不替你做历史图像与字体的许可判断。** 案例里只用了公有领域图像与 OFL 字体，来源逐条记在各项目的
  `SOURCES.md` / `LICENSES.md`。
- **不能替你听。** 探针能定位「咚」在哪一层，最终「好不好听」仍然要人判断；交付时请人完整听一遍。

## 许可与致谢

- 本仓库：**Apache-2.0**，见 [`LICENSE`](LICENSE)。
- 依赖 [`huashu-motion`](https://github.com/alchaincyf/huashu-motion)：MIT，© 2026 Huashu。
  `scripts/lib/wav.mjs` 的 WAV 读取改编自它的 `cli/lib/sound.js`。
- demo 内置 Noto Sans SC（SIL OFL 1.1，见 `demo/riemann-lite/assets/fonts/OFL.txt`）与 GSAP
  （见 `demo/riemann-lite/vendor/GSAP-LICENSE.txt`）。
- 案例静帧来自本仓库作者自己的两支片子；`docs/` 里的画面不是素材库图片。
