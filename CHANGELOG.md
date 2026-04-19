# Changelog

## 0.2.135

- 把公开仓缺的“首批门面内容”一次补齐，往真正可上架再推一步：
  - 新增扩展图标并接入 `manifest.json`
  - 补上 `icons/icon16.png`、`icon32.png`、`icon48.png`、`icon128.png`
  - 让弹出按钮、扩展列表和正式打包都不再处于无图标状态
- 新增一套可复用的商店素材：
  - `docs/store/CHROME-WEB-STORE-LISTING.md`
  - 4 张 `1280x800` 的 Chrome Web Store 截图
  - 一句话卖点、短描述、详细描述和隐私摘要
- 新增 `scripts/generate-store-assets.py`
  - 用当前 repo 里的真实界面截图生成商店图和图标预览
  - 让后续 UI 再更新时不必重新手工拼门面素材
- `README.md`、`PRIVACY.md`、运行时文件清单和公开导出清单也同步补上：
  - 商店素材入口
  - Chrome Web Store 可直接复用的隐私摘要
  - `icons/` 进入运行时打包和公开导出

## 0.2.134

- 新增两道发版护栏，补上“最后一米”的自动审计：
  - `scripts/check-doc-links.mjs`
    - 校验公开导出范围内的 markdown 相对链接和图片资源是否真实存在
  - `scripts/check-packaged-release.mjs`
    - 校验 zip 内文件集合是否与 `scripts/runtime-files.txt` 完全一致
    - 同时再次核对包内 `manifest.json` 版本
- `validate-release.mjs` 现在会顺手检查公开文档链接
- `package-release.sh` 现在在打包后自动审计 zip 内容，不再只看版本号
- `README.md`、`CONTRIBUTING.md`、`RELEASING.md` 也同步补上这两道检查的入口
- 所以这轮更像总回归收口：
  - 让开源仓更不容易因文档断链或发包漂移翻车
  - 也让最后的 release 质量更接近“机器先挡一遍，人再看一遍”

## 0.2.133

- 补齐一份面向公开仓协作者和自动化调用方的独立 API 文档：
  - 新增 `AUTOMATION.md`
  - 把 `window.ReplyDropAPI` 的读写方法、返回字段、错误语义和 CDP 示例收成单独入口
- `README.md` 收紧成更像公开仓首页的文档地图：
  - 增加 `先看哪几份文档` 导航
  - Automation API 章节不再把所有细节堆在首页，而是链接到独立文档
- `SMOKE-TEST.md` 和 `SUPPORT.md` 也同步纳入 API 冒烟与排障路径
- 所以这轮更像开源收口：
  - 不是继续堆功能
  - 而是让新协作者、自动化调用者和首次试用者更快接得住仓库

## 0.2.132

- 新增一套面向 Ada / CDP 的稳定操作接口，不再要求自动化脚本去点 popup 或识别截图
- 在 `x.com` 页面注入 page-world `window.ReplyDropAPI`
  - `getCandidates()`
  - `getQueue()`
  - `getState()`
  - `addToQueue(tweetId)`
  - `markShipped(tweetId, replyText)`
  - `skipCandidate(tweetId)`
- 这套接口走的是 ReplyDrop 现有真状态链路
  - `addToQueue` 会进入真实回复队列
  - `markShipped` 会走现有 shipped / pickup 生命周期
  - `skipCandidate` 会落到现有 dismissed candidate 逻辑
- 同时把 API 输出收成更稳定的 bot 形状：
  - 候选返回 `tweetId / score / tier / topicTags / author / textSummary / url`
  - 队列返回 `pending / shipped / done`
  - `getState` 直接给完整快照，方便调试和无人值守 automation

## 0.2.131

- 这轮不再泛化打磨，只修两个实际错误：
  - `打开仪表盘` 票条中间错误出现的黑点去掉
  - 左侧多余黑条去掉，避免挡字和抢视线
- 同时按“间隔一个”的方向重排底部裙边：
  - 半圆密度减半
  - 位置整体更贴边
  - 不再是一排过密的黑半圆

## 0.2.130

- 最后一轮只做终版收口，不扩功能、不碰滚动结构
- 重点把首页入口和仪表盘头部统一成更完整的一套票根语言：
  - 修正首页票面的静态 serial 漂移
  - 仪表盘入口和仪表盘头部补上更一致的 dark rail / serial / print-strip 节奏
  - 首页到仪表盘不再像“两张风格接近的票”，而更像同一套成品
- 这轮也顺手把真正显示给用户的首页说明文案再压稳了一层：
  - 首页说明
  - 总开关提示
  - 页内入口提示
  - 仪表盘入口说明
- 所以这轮更像最后一层整合，而不是继续做新效果

## 0.2.129

- 这轮继续只收成品感，不碰滚动结构
- 首页票面的微调重点放在接缝与票口几何：
  - sidecar 的黑边和半圆切口关系更明确
  - 数字、serial、barcode 也统一到更像印刷票面的数字节奏
- 仪表盘高频卡片继续做最后一层排印统一：
  - 标题条统一改成更稳定的顶对齐
  - serial / meta / 数字统一做 tabular 节奏
  - 正文宽度和段落节奏再压稳一点
- 所以这轮更像终版前的微校准
  - 而不是继续堆新的装饰效果

## 0.2.128

- 这轮把上次提到的两件事一起做了，不再拆成二选一
- 首页 `hero poster` 继续往真实印刷票面推进：
  - 顶部 band 补上 serial / admit 细节
  - poster 主画面补上更明显的 print line、watermark 和 sidecar barcode 编码感
  - 整体更像一张真正印好的票，而不只是带电影配色的入口卡
- 仪表盘高频卡片的排印也继续压稳：
  - 标题、正文、meta、serial 的层级更清楚
  - 看板 / 队列 / 关系 / 草稿这些最常扫读的卡片更 calm
  - 仍然没有去碰滚动容器和面板结构

## 0.2.127

- 这轮回到 popup 成品感，只收仪表盘内部卡片，不碰滚动结构
- 重点把 `看板 / AI回复` 里最常见的几类卡片再往同一张电影票根系统里拉近：
  - 增长卡、队列卡、关系卡、草稿卡、记忆卡现在共享更统一的左侧 stub rail
  - rail 上补了和外层票面同方向的黑边与切口节奏
  - 卡片内容层也统一抬到 rail 之上，减少“外面像票、里面像普通后台卡片”的割裂感
- 所以这轮之后：
  - 外层整张票和内层工作卡的语言更接近
  - 但没有去碰滚动容器、面板层级和当前稳定的交互路径

## 0.2.126

- 这轮先补开源发布硬度，不碰滚动结构
- 新增一套明确的 clean export 流程：
  - `scripts/open-source-files.txt` 作为公开树唯一白名单
  - `scripts/check-open-source-export.mjs` 校验导出列表、禁入项和缺失路径
  - `scripts/export-open-source-tree.sh` 一键生成干净的公开仓快照
- `validate` 现在会顺手检查 open-source export，不再只验证运行时包
- `package.json`、`README.md`、`RELEASING.md`、`CONTRIBUTING.md` 也同步接入 `check:oss` / `export:oss`
- 所以从这版开始：
  - 本地工作目录可以继续保留内部 handoff、zip、截图
  - 但公开发布时已经有一条稳定、可复用、可验证的干净导出链路

## 0.2.125

- 这轮继续只收电影票根边缘，不扩功能
- 重点把整张票的边缘关系统一成一套：
  - 整体票面左右边现在补上更明确的黑边底色与侧边切口
  - 侧边切口的圆心重新压回侧边虚线，不再只是贴边的装饰圆角
  - `Home Entry` 这类 divider 也和整张票共用同一套黑边 + 切口逻辑
  - 最底部齿口改成更接近“两齿一空”的稀疏节奏，票根味更强

## 0.2.124

- 这轮只收电影票根几何，不扩功能
- 重点把你指出的两处“像装饰、不像切口”的地方改正：
  - `Home Entry` 这条 divider 的左右半圆切口现在贴回票面最外缘
  - 半圆圆心重新对齐中间虚线，不再悬在黄纸里
  - 最底部裙边改成更稀疏的票口节奏，不再整排过密
  - 底部切口也一起压到票面外沿，更像真正撕口而不是印花

## 0.2.120

- 这轮继续只收 popup 的成品感，不扩功能
- 重点回到首页正面票根：
  - poster 区补上了侧边 stub、barcode 和底部规格栏
  - 主标题、kicker、cast line 现在更像真正海报票面，不再主要依赖 pseudo text
  - section title / summary / status value 也一起补了一层更稳定的排印
- 所以这轮之后，首页第一屏更像完整票根正面
  - 不只是一个做得漂亮的入口容器

## 0.2.119

- 这轮继续不扩功能，专门把首页入口和仪表盘头部往真正的电影票根结构上再推一步
- 重点补的是之前还不够到位的“断口 / 序列条 / 切缝”：
  - 首页和仪表盘之间现在重新有了真正的 divider rail
  - `打开仪表盘` 入口和 dashboard header 的 stub 区也补上了更明确的 tear-stub cutout
  - 首页的语言条、入口提示和状态条也加回了更克制的 print label / serial 节奏
- 所以这轮之后，ReplyDrop 的票根感不再主要靠渐变和纸张纹理
  - 而是开始有更明确的票面结构

## 0.2.118

- 这轮继续不扩产品面，专门收仪表盘里最容易掉回“设置页”的几块 utility panel
- 重点把 `概览 / 加成 / 关键词` 再往电影票根系统里拉一层：
  - `概览` 的动作按钮和状态卡更像票面控件，不再像普通后台按钮
  - `加成` 的 score guide / note / filter 也补上更统一的票区节奏
  - `关键词` 的折叠区、chip、输入框一起收回同一套纸张和边线语言
- 所以这轮之后，仪表盘四个主页签的气质更一致
  - 不会一切到工具面板就突然掉回“网页设置区”的感觉

## 0.2.117

- 这轮继续补的是 panel 的节奏和动势层级，而不是再扩功能
- 重点收了两层：
  - dashboard section 的 reveal 更轻、更有主次
  - 工作台子页签现在更像一条票面导轨，而不是两个普通按钮
- 同时继续压 hover 里的位移量
  - 让 ReplyDrop 的动势更克制
  - 不再让每一层都抢同样的注意力

## 0.2.116

- 这轮继续补 dashboard 里最常看的票条列表，而不是外围容器
- 重点收的是候选 / 反馈这些 `deskItem` 的阅读顺滑度：
  - 列表容器更像一块完整票本
  - 标题、正文、meta、reason、stub 的层级更清楚
  - 高频阅读时会更稳，不那么躁
- 所以这轮之后，ReplyDrop 最常被看到的列表内容也更接近成品

## 0.2.115

- 这轮继续回到 popup 本体，补的是 dashboard 内部卡片的排印和节奏
- 重点不是再加新模块，而是让增长卡、队列卡、关系卡、草稿卡更像同一套票面系统
- 这版主要收了：
  - 更统一的左侧票面边线
  - 更清楚的 serial / 数字 / 说明文层级
  - 更稳定的 header divider 和卡片阅读节奏
  - queue filter 的交互反馈和字面秩序
- 所以这轮之后，dashboard 已经不只是“分层对了”
  - 内部内容的视觉语言也更一致

## 0.2.114

- 这轮继续补公开仓的演示层
- 新增了一个轻量循环 demo：
  - `docs/assets/replydrop-demo-loop.gif`
  - 基于当前真实界面截图整理
  - 用来快速展示首页入口、仪表盘分层和 Growth Dashboard
- `README.md` 现在不再只有概念图和静态截图
  - 也多了一层可直接浏览的 demo 预览
- 这让公开仓首页更接近一个真正可理解、可快速评估的产品页

## 0.2.113

- 这轮继续补 popup 的交互成品感，而不是再扩功能面
- 重点是加一层克制的票面微动势：
  - home / dashboard sheet 切换更顺
  - `打开仪表盘`、返回按钮、页签、工作台子页签都有更明确的 hover / focus 反馈
  - ticket section 在操作时也更像一张会被拎起来的票区
- 同时补上了 `prefers-reduced-motion`
  - 让 ReplyDrop 的成品感不依赖强动画
  - 对开源产品也更稳妥

## 0.2.112

- 这轮继续补开源仓的真实展示层，而不是只停留在概念图
- 把已经实测过的 popup / 仪表盘 / Growth Dashboard 截图整理进 `docs/assets`
- `README.md` 的预览区现在不只有 SVG 概念资产
  - 还会直接展示当前产品的实机界面截图
- 所以公开仓首页现在更像真正可评估的产品页
  - 不是只知道设计方向
  - 也能直接看到当前版本已经做到了什么样子

## 0.2.111

- 这轮从仓库门面回到插件本体，继续补 popup 的成品感
- 重点不是再加功能，而是把已经分层的仪表盘做出更明确的“不同票区”身份
- `工作台 / 概览 / 加成 / 关键词` 现在不再只是换内容
  - 每个页签都有自己的 panel serial、hint strip、票面 tint 和 header 气质
- 所以用户切换页签时，感受到的不再只是“同一块长面板里翻不同内容”
  - 而更像进入不同功能票区
- 这轮也顺手把 dashboard 活跃页签状态继续同步到 DOM
  - 让视觉状态跟真实激活页一致

## 0.2.110

- 这轮主要补的是公开仓展示层，不再继续深磨 heuristic `AI回复`
- 新增仓库展示资产：
  - `docs/assets/replydrop-ticket-hero.svg`
  - `docs/assets/replydrop-workflow-strip.svg`
- `README.md` 也重写成更像公开仓首页的结构：
  - 开源快照
  - 当前边界
  - 预览图
  - 工作流
  - 协作边界
- 所以这版开始，ReplyDrop 不只是“仓库里有文档”
  - 而是已经有一套能对外说明自己是什么、长什么样、现在做到哪一步的展示门面

## 0.2.109

- 这轮不再继续打磨 `AI回复` 本身
- 先按开源目标回看了一遍基础件：
  - README / LICENSE / CONTRIBUTING / SECURITY / SUPPORT / Issue 模板 / CI / validate / package 都在
  - 所以已经没有明显“不能公开仓”的硬阻塞
- 重点于是切回 popup 成品感，把界面从“有票根皮肤的工具面板”继续往“真正像电影票”推进
- 首页补回了更强的票面元素：
  - 海报头
  - 票号尾注
  - 底部半圆切口
- `打开仪表盘` 入口也改成更像撕口票根，不再像普通渐变按钮
- 仪表盘头部与区块标题重新强化了票号、切缝和票面印刷感

## 0.2.108

- `AI回复` 这轮继续不碰大结构，只补最实际的正文可发性
- `改写工作台` 新增：
  - `收成直发版`
- 这个动作不是再生一条新草稿
  - 而是把当前工作稿里的说明腔再压一层
  - 去掉一部分 `我会怎么回 / 更像真人 / 不像模板` 这种 meta 味
  - 收成更短、更像直接发出去的 1-2 句
- 所以到这版为止：
  - `AI回复` 已经不只是“能出草稿 / 能带去回复框”
  - 还多了一步本地直发收束
  - 更接近真正可出手的 heuristic copilot

## 0.2.107

- `AI回复` 这轮补了一条更像真产品的出手链路
- 之前工作台已经能：
  - 出草稿
  - 改写
  - 复制
  - 排队
- 但还差一个最直接的动作：
  - 把当前工作稿直接带去 X 的回复框
- 现在 `改写工作台` 新增了主按钮：
  - `直接打开回复框`
  - 会先保存当前工作稿
  - 再把它直接带去目标帖的 composer
- 所以这版开始，`AI回复` 已经不是“只能看草稿”
  - 而是一个可直接出手的本地 copilot
  - 当然它仍然不是模型型 AI，只是可用性已经明显更完整

## 0.2.106

- 这轮同时把 `评分权重` 和 `AI回复` 往“早期起速 + 独特主意”上压了一层
- 评分现在更偏：
  - 发出约 1 小时内
  - 已经有可见曝光
  - 还在继续加速
  - 回复区有讨论空间但还没挤死
- `scorer.js` 新增了几种更贴近目标帖的判断：
  - `Acceleration window`
  - `Not moving yet`
  - `Past peak`
- 所以这版会更少把：
  - 太早但还没跑起来的帖
  - 已经过峰值、回复过于拥挤的帖
  判成高优先级
- `AI回复` 这边也同步加了一层 route 选择偏好：
  - 对“已经起量、还在加速”的 fresh 帖
  - 会更偏 `直接给观点 / 先补一层`
  - 少一点“附和一句”
  - 多一点新增信息、独特观点、实质补充
- popup 里的评分说明和 route 理由也同步反映这轮变化

## 0.2.105

- `AI回复` 的 route 推荐不再把所有 `reviewed / settled` 记忆都当成“已验证主线”
- 这轮补的是一层更真实的分流：
  - 如果历史里真的出现过 `picked-up / author-back`
    - 继续偏向 `沿验证记忆接`
  - 如果只是复查过，但没有明显被接住
    - 就更偏 `先追关键变量 / 先补一层`
- 这让 AI 面板不再把“复查过但还安静”的对象误当成已经跑通的旧线
  - 推荐会更像真实操作判断
  - 不是把所有 memory 都硬塞回同一种打法
- popup 里的路数理由和信号标签也同步加上了这层区分

## 0.2.104

- `AI回复` 的 route 稿继续做第二轮去模板味收敛
- 这轮还是不加新壳，也不碰当前分层结构
  - 只继续压 `lead / body / closer` 里还像“系统在解释策略”的中文句子
  - 把它们改成更像真人会顺手发出去的接话
- 现在几条主路数的最终工作稿会更少出现这类读感：
  - “更稳的接法”
  - “真正该问清的”
  - “更值得接的”
  - “一句该发的回复”
- 意图没变，打法没变
  - 但语言更轻
  - meta 感更低
  - 更接近可直接发送的工作稿

## 0.2.103

- `AI回复` 的 route 稿继续做了一轮去模板味收敛
- 这轮不改结构，也不加新按钮
  - 重点是把第二句和收尾里最明显像“系统说明”的词句削掉
  - 让中文读起来更像人在顺手接话
- 当前几条主路数的 bundle 稿现在会更少出现：
  - “真正最值钱的地方”
  - “更值得接的”
  - “更像一句真正能接上的回复”
  这类模板味偏重的表达
- 改完之后，route 稿整体还是同一套打法
  - 但读感更轻
  - 更接近日常发出的回复句式

## 0.2.102

- `AI回复` 的 route bundle 又往前收了一层
- 上一轮把第一句改成了该打法自己的主句
- 这一轮继续把第二句和收尾也改成 route 专属内容
  - 不再优先回退成通用说明句
  - 整段 2-3 句现在更像沿同一条人格线写出来
- 当前 route 生效后的工作稿会更稳定地表现出：
  - `沿验证记忆接` 更像顺着已验证互动继续接
  - `先追关键变量` 更像真的把问题抛给对方
  - `先补一层` 更像把讨论往下垫稳
  - `轻反差切入` 更像顺手拐个更有意思的角度
  - `直接给观点` 更像一句干净可发的判断
- 这一步继续减少整段稿子的“说明味”
  - 让 AI 面板产出的工作稿更像回复本身

## 0.2.101

- `AI回复` 的 route bundle 又往“能直接发”推进了一步
- 现在 route 生效时，最终工作稿第一句不会再优先沿用通用改写口吻
  - 会直接换成该打法自己的主句
  - 少一点“我会怎么回”
  - 多一点真正像回复本身的开场
- 当前几条主路数都做了更直接的主句：
  - `沿验证记忆接`
  - `先追关键变量`
  - `先补一层`
  - `轻反差切入`
  - `直接给观点`
- 这一步继续把 AI 面板从“会解释打法”往“会给更像真人可发稿”推进
  - 不动结构
  - 直接抬语言质感

## 0.2.100

- `AI回复` 的 route bundle 继续往“真正成稿”推进了一层
- 上一轮已经会按现场动态换 `起手 / 推进 / 收尾`
  - 这一轮进一步让最终工作稿按该路数的节奏收束
  - 不再只是把三段文字机械拼起来
- 现在不同路数会更明显地走不同的成稿节奏：
  - `直接给观点 / 轻反差 / 先补一层 / 顺着记忆`
    - 更偏向保留前两段最可发的句子
  - `先追关键变量`
    - 会更稳定地收成问题式结尾
- 这一步继续减少 AI 面板里“解释感过重”的成分
  - 让工作稿更像真实可以拿去发的回复
  - 而不是只是把理由、打法、说明堆在一起

## 0.2.99

- `AI回复` 的 `出手路数` 现在不只会决定“选哪条打法”
  - 还会根据当前窗口、线程密度、记忆强度、排期档位
  - 动态改这条路数对应的 `起手 / 推进 / 收尾` 组合
- 这意味着同一条 `沿验证记忆接` 或 `先补一层`
  - 不再永远是固定一套 starter/body/closer 索引
  - 而会更像真的按现场情况换打法包
- popup 里的路数卡也新增了一条轻量 `打法摘要`
  - 直接告诉你这次会怎么开头、怎么往下推、怎么收口
  - 让“为什么选这条路数”不只停留在解释层，也停在执行层
- 这一轮继续把 `AI回复` 往真实 copilot 推
  - 不加新壳
  - 先把已有路数系统做得更像可用成品

## 0.2.98

- `AI回复` 的 5 条基础主草稿继续拉开人格差异
- 这一轮不再只是替换几个近义词
  - `沿验证记忆接` 更像顺着已验证互动往下接
  - `先追关键变量` 更像真正在追问决定后续判断的变量
  - `先补一层` 更像给线程补回遗漏的一层
  - `轻反差切入` 更像真人顺手拐一个角度
  - `直接给观点` 更像可以立刻发出的判断句
- 这一步让 `AI回复` 里的“先选路数”不再只是上层说明卡
  - 选中路数后第一眼看到的主草稿
  - 也更接近对应打法的人设和语气
- 这轮没有再加新面板或堆新按钮
  - 重点是把现有 AI 回复能力做得更像成品
  - 先提升真实可用性，再继续往更强 draft 走

## 0.2.97

- `AI回复` 的 `出手路数` 不再只是静态顺序
- 现在会把这些真实信号一起吃进路数推荐：
  - `pickup`
  - `reviewed / settled`
  - 当前 `lane`
  - 线程拥挤度
  - 候选分数与鲜度
- 这一轮把路数排序抽进了 `replydrop-draft-core.js`
  - 变成共享纯逻辑
  - 也补了对应测试
- 路数卡现在不只显示“叫什么”
  - 还会带出更具体的推荐理由
  - 以及为什么它比别的打法更适合当前这条候选
- 这一步让 `AI回复` 从“会给打法”继续变成“会按真实信号挑打法”

## 0.2.96

- `AI回复` 新增一层更强的 `出手路数`
  - 不再只给你很多局部按钮
  - 现在可以先一键选择整套回复打法
  - 再继续在下面微调句子
- 当前会优先给出 3 条更像真实出手策略的路数，例如：
  - 沿验证记忆接
  - 直接给观点
  - 先追关键变量
  - 或轻反差切入
- 每条路数会一起决定：
  - 用哪条草稿角度
  - 用什么 tone
  - 起手 / 中段 / 收尾分别怎么搭
- 这一步让 `AI回复` 从“会改稿”更进一步变成“会先帮你选打法”
- 路数卡也继续做成更清楚的票根区块，避免新增能力又重新长成一团

## 0.2.95

- `AI回复` 工作台从“强起手”继续扩展成完整三段式改写台：
  - `强起手`
  - `往下推进`
  - `收尾动作`
- 现在不只是改第一句
  - 还可以给当前稿补中段推进句
  - 再给最后一句换成更像会话的收尾
- 这三个控制是可叠加的
  - 可以先换起手
  - 再压中段
  - 再选结尾
  - 让 `AI回复` 更像真正的 reply copilot，而不是单点按钮
- `当前前三顺位` 优先级板也从展示板变成可操作板：
  - 每条都能直接切成当前工作对象
  - 或按建议档位直接入队
  - 不再只是看完排名再自己找地方操作
- 工作台和优先级板也补了一轮票根式区块分层，让新增控制没有长成一团

## 0.2.94

- `AI回复` 新增“当前前三顺位”优先级板，不再只停留在第一名 vs 第二名
- 现在会把前三候选一起摊开，说明：
  - 谁是主线
  - 谁是 runner-up
  - 谁更像保温备选
- 改写工作台新增 `强起手` 切换按钮
  - 可以直接把当前稿切到更强的开头
  - 不用手动改第一句
- 这一步让 `AI回复` 更像真实决策台：
  - 一边告诉你谁先做
  - 一边给你当前稿更强的起手
- 优先级板和强起手条也继续做了一轮票根化 polish

## 0.2.93

- `AI回复` 新增“为什么这条先于第二名”卡，开始解释主线候选为何赢过 runner-up
- 现在会从这些维度解释主线取舍：
  - 当前窗口
  - 第二名对比
  - 分差
  - 线程拥挤度 / 鲜度 / 记忆优势
- 草稿正文继续强化起手感：
  - 观点稿更像直接开场
  - 提问稿更像先抛问题
  - 补充稿更像先补一句
  - 反差稿更像先换个角度
- 这一版让 `AI回复` 更接近真正的决策 copilot，而不是只会给草稿和时间建议
- `主线理由` 卡也继续做了一轮票根化 polish，和排期理由卡形成更完整的 AI 判断层

## 0.2.92

- `AI回复` 面板新增 `排期理由` 卡，不再只给一个 `下一轮 / 今晚 / 明早` 结论
- `AI回复` 现在会把建议排期拆成更清楚的理由层：
  - 当前窗口
  - 默认排期
  - 分数
  - 鲜度
  - 记忆偏好
- `AI回复` 工作台新增起手提示，直接告诉你当前草稿更适合：
  - 先给观点
  - 先追问
  - 先补一层
  - 还是轻反差切入
- 这一步让 `AI回复` 更接近真正的 copilot：
  - 不只给草稿
  - 也解释为什么现在这么写、为什么这个时间发
- `AI回复` 里的排期和起手提示卡也继续往票根质感推进

## 0.2.91

- `AI回复` 草稿从“解释为什么值得回”进一步改成更像可以直接发出去的回复句式
- `更锐 / 更柔和 / 更短 / 更像真人` 现在不再把所有草稿压成同一条泛化文案
  - 会保留当前草稿角度
  - 再按 tone 做不同风格改写
- 草稿改写现在更贴近真实发帖语感：
  - 少一点“这是值得回复的帖子”这种元叙述
  - 多一点直接进入观点 / 追问 / 补充 / 轻反差的可发句式
- `AI回复` 工作台和草稿卡继续做了一轮票根细节 polish：
  - 切口感更强
  - 虚线分隔更清楚
  - 激活中的草稿卡更容易辨认

## 0.2.90

- `AI回复` 不再只是 roadmap 面板，已经正式接入真实草稿工作流
- 现在会在 `AI回复` 面板里直接显示：
  - 当前 AI copilot 主卡
  - 可改写工作稿编辑器
  - 3 个可直接使用 / 复制 / 入队的回复草稿
- `AI回复` 面板内的：
  - 改写
  - 复制当前稿
  - 草稿复制
  - 入队排期
  这些动作已经和新面板接通，不再只对旧隐藏草稿台生效
- `AI回复` 顶部新增更像票根成品的 copilot 主卡，开始把：
  - 当前目标对象
  - 建议排期
  - 记忆验证
  - 可用草稿角度
  放进一个更清楚的主叙事里
- `AI回复` 页签 badge 现在会显示真实草稿数量，而不是一直显示 `0`

## 0.2.89

- `看板` 顶部新增更像成品的“表现摘要”主卡，不再只有一排指标卡
- `看板` 现在会优先突出：
  - 当前表现最好的回复
  - 总曝光
  - 点赞增量
  - 最佳曝光增量
- `AI回复` 顶部新增“下一块该做”主卡，把下一阶段产品方向说清楚：
  - 更强草稿
  - AI 排期
  - 关系记忆
- `AI回复` 现在也会结合当前最佳候选，给出更具体的 AI 接入对象与建议排期，不再只是三个空 roadmap 卡片
- `看板 / AI回复` 两个面板的票根层次和装饰感继续加强，更接近稳定成品状态

## 0.2.88

- 工作台二级导航从 `收件箱 / 草稿 / 看板 / 队列 / 关系 / 反馈` 收敛成 `看板 / AI回复`
- `看板` 现在改成更贴近用户预期的回复表现面板，重点展示：
  - 已发出回复数
  - 观测曝光
  - 点赞增量
  - 回复增量
  - 被接住 / 作者回流 / 复查覆盖
  - 当前表现最好的回复
- `AI回复` 现在是独立面板，占位未来的：
  - AI 草稿助手
  - AI 排期与队列
  - AI 关系记忆
- 仪表盘顶部四个主按钮现在有更明确的分色，不再“点到谁都一个样”
- popup-ui-core 现在只接受 `growth / ai` 两个工作台二级状态，并新增旧状态回退测试

## 0.2.87

- popup 不再把头部入口和四个主页签塞在同一张长票根里
- 新增 `首页 -> 仪表盘` 两层结构：
  - 首页只保留语种、总开关、页内入口说明和一个明显可点击的 `仪表盘` 总控按钮
  - `工作台 / 概览 / 加成 / 关键词` 全部收进第二层独立面板
- `replydrop-popup-ui-core.js` 现在会持久化 `activeView`
- 新增 popup-ui-core 回归测试，锁住：
  - `activeView` 的解析与序列化
  - 只有 dashboard layer 可用时，状态应正确回退
- 这一步优先解决“切了 tab 但仍像同一条长网页”的结构问题，让 popup 更像插件而不是网页

## 0.2.86

- `scripts/validate-release.mjs` 现在会额外校验：
  - `package.json` 版本必须和 `manifest.json` 一致
  - README 中示例 zip 名必须和当前短版本一致
- 这一步把发版元信息同步也纳入了强校验范围，减少“代码对了但版本文档漂了”的开源维护成本
- 作为这轮 12 版收口，ReplyDrop 现在同时具备：
  - 更短的 workbench 分层
  - 共享纯逻辑支撑的 focus / draft / queue / feedback / attribution 选择
  - 更诚实的 publish-watch / pickup-watch 状态
  - 更像公开仓的文档门面与验证纪律

## 0.2.85

- 新增 `replydrop-feedback-core.js`，把 feedback 预览排序从 popup 渲染逻辑里抽成共享纯逻辑
- `反馈` 视图现在优先显示：
  - 已到期待复查
  - 已被接住
  - 再到普通 quiet / pending 记录
- 新增 feedback-core 回归测试，锁住：
  - due review 必须排在前面
  - 默认 feedback preview 保持短列表
- popup 反馈区默认只展示最值得先看的 `3` 条，并给出说明文案
- 这一步让 post-ship feedback 更接近工作流，而不是纯存档

## 0.2.84

- 新增 `scripts/check-public-docs.mjs`
- `npm run validate` 现在会自动检查公开文档里是否残留：
  - 本机路径
  - 文件协议链接
  - 其他明显不适合公开仓的本地引用
- `package.json` 新增 `check:public-docs`
- 这一步把开源门面纪律固定进验证流程，而不是继续依赖人工记忆

## 0.2.83

- `replydrop-workflow-core.js` 现在会把长期未闭环的 publish-watch handoff 自动升级成 `failed`
  - `post-opened` 超过约 12 分钟
  - `composer-ready` 且多次尝试后超过约 18 分钟
- 新增 workflow-core 回归测试，锁住 stale handoff 不应一直伪装成正常状态
- popup 的 publish-watch assist tone 现在会直接尊重升级后的失败状态
- 这一步让 execute / publish loop 的真相更诚实：卡住太久就该被看见并重新处理

## 0.2.82

- README 不再暴露本机目录路径，安装和开发说明改成公开仓可直接复用的写法
- `CONTRIBUTING.md`、`SUPPORT.md`、`RELEASING.md` 中的本机绝对路径链接全部改成仓库相对链接
- 发布和开发指令统一改成 `cd <repo-dir>` 形式，避免把个人工作目录写进公开文档
- README 的仓库定位也从“内部恢复目录”改成“开源仓库目标”表达
- 这一步不改运行时行为，但明显提高了仓库作为公开项目的可信度和专业度

## 0.2.81

- `replydrop-attribution-core.js` 新增：
  - `getCandidateAttributionBoost()`
  - `sortCandidatesByAttribution()`
- attribution memory 现在会真正参与候选排序，而不是只停留在 Growth / Attribution Memory 里解释
- `popup.js` 先构建 attribution model，再对可见候选和可执行候选做二次排序
- 候选卡 signal row 新增轻量 attribution 提示：
  - `作者记忆`
  - `主题记忆`
  - `已验证`
- 新增 attribution-core 回归测试，锁住有真实记忆的候选应优先于中性候选
- 这一步让“看过往什么有效”开始真正影响“现在先回哪条”

## 0.2.80

- 新增 `replydrop-queue-core.js`，把 queue 过滤和默认预览截断规则抽成共享纯逻辑
- 新增 `tests/replydrop-queue-core.test.cjs`，锁住：
  - `action` 视图只应保留真正临近执行的队列项
  - 默认 queue preview 保持短列表
- popup queue desk 改为消费 queue core，不再把过滤与预览规则继续散落在 `popup.js`
- 默认只展示最前 `3` 条 queue card，`action` 视图最多展示 `4` 条；更多项改用提示引导用户切筛选
- 这一步让 `队列` 更像插件里的执行入口，而不是把整份待办单原样摊开

## 0.2.79

- `replydrop-growth-core.js` 的 compact metrics 现在会按真实压力自适应收缩，不再默认把所有零值卡都渲染出来
- Growth 可选指标只保留前三个最值得占位的项：
  - `needsAction`
  - `awaitingConfirm`
  - `pickupDue`
  - `pickedUp` 只会在前面更紧急项不挤满时出现
- 新增 growth-core 回归测试，锁住：
  - 高压力时的可选卡优先级
  - 安静状态下只保留最基本的看板卡
- popup 的 Growth action rail 现在只渲染前 2 张最高优先级动作卡，进一步降低长面板感
- 这一步让看板更像“操作脉冲”，而不是固定长度的数据墙

## 0.2.78

- 草稿工作台现在会直接显示系统建议排期，并高亮推荐的 `下一轮 / 今晚 / 明早` 按钮
- 推荐排期沿用现有 lane + attribution memory 规则，不是新造一套判断
- 草稿到排队这一步从“自己猜该放哪”变成“先看到系统建议，再决定是否覆盖”
- `draftComposerMeta` 现在是更清晰的上下文区，不再只是一行作者 + lane 文本
- 这一步让 draft -> queue 的操作链更像产品，而不是一组平铺按钮

## 0.2.77

- 新增 `replydrop-draft-core.js`，把草稿角度选择从 `popup.js` 抽成共享纯逻辑
- 草稿角度现在会消费 attribution memory：
  - 有真实记忆时优先给出 `记忆延续`
  - 对话已热起来时优先以 `延展补充` 收尾
- `renderDeskPanel()` 先构建 attribution signal，再生成当前 focus candidate 的草稿，不再让草稿晚于记忆判断
- 新增 `tests/replydrop-draft-core.test.cjs`，锁住：
  - validated memory 应把 `memory` 角度推到第一位
  - 活跃讨论应优先用 `bridge` 结尾
- popup / options / runtime file / syntax check 已同步接入 draft core
- 草稿台开始从“固定三段文案”转向“由共享策略决定哪三种角度应该出现”

## 0.2.76

- 新增 `replydrop-focus-core.js`，把 workbench `focus digest` 和候选预览选择规则抽成共享纯逻辑
- 新增 `tests/replydrop-focus-core.test.cjs`，锁住：
  - focus digest 输出顺序
  - 当前主线候选不应在下方候选池里重复出现
- `popup.js` 改为消费 focus core，而不是继续内联维护 digest / preview 逻辑
- 当前候选池现在会优先展示“主线之外”的备选项；如果当前只有一条主线，会明确提示而不是重复渲染同一条卡片
- runtime file / syntax check / popup HTML / options HTML 已同步接入新的共享核心

## 0.2.75

- `收件箱` 视图做了第一轮真压缩：把“当前生效加成 / 评分说明”从工作台主线里挪回 `加成` 页签
- `focus` 区新增紧凑 digest strip，只保留当前主线、候选规模、队列规模和待复查压力
- 当前候选池预览从 `5` 条收成 `3` 条，减少 popup 首屏滚动压力
- `signals` 页签现在同时承担语言 / 主题 / 当前生效加成 / 评分说明，信息归位更接近插件控制台
- 这是一次结构减重，而不是样式漂移：工作台更聚焦“现在该处理什么”

## 0.2.74

- `replydrop-attribution-core.js` 新增 `buildAttributionInsightTargets()`，把 attribution insight 的优先级选择从 `popup.js` 提升到共享纯逻辑
- attribution insight 现在默认只取最强的 2 张，而不是把 `handle / topic / lane` 三张都堆出来
- `popup.js` 的 attribution memory 改为消费共享 insight targets，减少内联排序与选择逻辑
- Growth 区里的 attribution memory 更像插件信息卡，而不是又一段长列表
- 新增 attribution-core 回归测试，锁定：
  - strongest two insights 的顺序
  - 弱记忆不应生成 attribution insight

## 0.2.73

- Growth Dashboard 做了一轮 compact pass：核心指标卡从 10 张收成 6 张，保留执行/回访真相但降低扫描成本
- `replydrop-growth-core.js` 新增：
  - `buildCompactGrowthMetrics()`
  - `buildGrowthTruthItems()`
- compact growth 卡片与 truth strip 的选择规则改为共享纯逻辑，减少 `popup.js` 内部硬编码
- `popup.js` 不再在 Growth 区重复渲染 `作者回流 / 复查中 / 已结案 / 已发出` 大卡；这些信息改为进入 compact strip 或指标 meta
- attribution memory 在没有真实内容时不再空占一个面板，Growth 区块更像插件而不是长页面
- 新增 growth-core 回归测试，锁定 compact card 集与 compact truth strip 的输出顺序和关键值

## 0.2.72

- 抽出 popup 路由状态共享规则，`replydrop-popup-ui-core.js` 现在会统一处理主页签 / 工作台二级页签 / 队列筛选的可用性与回退逻辑
- 新增 `resolvePopupUiPrefs()` 与 `buildPopupUiPrefs()`，避免分层视图规则继续散落在 `popup.js`
- `popup.js` 切页、切工作台区块、切队列筛选现在都走共享 popup UI 核心，invalid patch 不会再把当前有效状态冲掉
- `switchTab()` 改为使用归一化后的真实目标 tab 更新按钮和 panel，不再依赖原始输入值
- `options.html` 现在也加载全部共享核心文件，popup 与 options 不再走两套不同的 UI 逻辑 fallback
- 新增 popup-ui-core 回归测试，覆盖：
  - `desk` 不可用时的回退
  - invalid patch 保持当前分层状态
  - 切主页签时保留已选中的工作台二级区块

## 0.2.71

- `markTweetAsReplied()` 改为使用 fresh shipment pickup 状态，不再从旧的 `pickupChecks / reviewStage / nextReviewAt / settledAt` 继承回访节奏
- 同一条 source tweet 再次 shipped 时，会重置为新的 `pending -> first-check` 回访循环，而不是沿用旧的 `follow-up / settled`
- fresh shipment 也会清空旧 pickup 观测值与作者回流标记，避免把上一轮 shipped 的结果错误带到新一轮
- `replydrop-pickup-core.js` 新增 `buildFreshPickupReviewState()`，并补上回归测试锁住该语义
- `background.js` 的 pickup fallback 逻辑与 pickup core 对齐，避免 core 缺失时节奏计算退化

## 0.2.70

- `background.js` 现在会在 `markTweetAsReplied()` 与 `recordPickupSnapshot()` 中真正落地 pickup review cadence，并把 `reviewStage / nextReviewAt / settledAt` 同步写入 `pickupWatch` 与 `replyDetails`
- `popup.js` rehydrate 不再丢失 `publishWatch` 的 `failed / cooldown / snoozed / attempts / cooldownUntil / snoozeUntil`，也会保留 pickup review cadence 字段
- Growth Dashboard / growth badge / feedback meta 改为看全部到期复查工作，不再只把首次检查的 `pending` 当成唯一信号
- README 文档链接改为仓库相对路径，GitHub 打开时不再跳到本地 `/Users/admin/...`

## 0.2.69

- 抽出 `replydrop-popup-ui-core.js`，把 popup 分层导航与视图状态归一化收敛成共享纯逻辑
- 抽出 `replydrop-growth-core.js`，把 Growth Dashboard 的 queue / publish / pickup / review 聚合从 `popup.js` 中拆出
- 新增 `tests/replydrop-popup-ui-core.test.cjs` 与 `tests/replydrop-growth-core.test.cjs`
- Growth Dashboard 现在会额外显示 `待收口 / 复查中 / 已结案 / 巡检覆盖`，不再只看浅层计数
- 增长动作卡优先盯失败/更紧急的 publish-watch 恢复项，而不是随便抓第一条

## 0.2.68

- 新增 GitHub Actions 校验工作流 `.github/workflows/validate.yml`
- 新增 issue templates、PR template，补齐对外协作入口
- 新增 `.editorconfig` 与 `SUPPORT.md`
- 重写 `CONTRIBUTING.md`，让本地验证、提交流程和边界约束与当前仓状态一致
- popup 记住上次打开的主页签、工作台二级页签和队列筛选，不再每次都回默认视图

## 0.2.67

- 给 `工作台` 加入二级导航：`收件箱 / 草稿 / 看板 / 队列 / 关系 / 反馈`
- 不再把工作台所有模块一次性堆在同一条长页里，切回更接近插件的分层操作方式
- 每个二级页签补上数量 badge，打开时能直接看到候选、队列、反馈等规模
- 将 `增长脉冲` 明确提升为 `Growth Dashboard` 命名，降低“找不到数据看板”的歧义

## 0.2.66

- 收紧 popup 头部密度，压缩标题、计数块和总开关卡片的尺寸
- 将界面语言切换提前到总开关前面，避免被埋在概览页里
- 移除头部里过于臃肿、又像按钮却不能点击的“唯一入口”大卡
- 将入口说明改成更轻的提示行，减少插件首屏的网页感和堆叠感

## 0.2.65

- 抽出 `replydrop-attribution-core.js`，把 attribution 记忆与候选排队默认槽位逻辑收敛到共享核心
- 新增 `tests/replydrop-attribution-core.test.cjs`
- popup 改为优先消费共享 attribution 核心，减少 `popup.js` 内部策略漂移

## 0.2.64

- 抽出 `replydrop-workflow-core.js`，统一 reply queue 排序与 publish-watch 状态归一逻辑
- 新增 `tests/replydrop-workflow-core.test.cjs`
- `background.js` / `popup.js` 改为优先调用 workflow 共享核心

## 0.2.63

- 抽出 `replydrop-pickup-core.js`，统一 pickup 状态与 post-ship review cadence 的纯逻辑
- 新增 `tests/replydrop-pickup-core.test.cjs`
- `background.js` / `popup.js` 改为优先调用 pickup 共享核心

## 0.2.62

- 新增 `scripts/package-release.sh`
- 发版包改为从 `scripts/runtime-files.txt` 读取运行时文件，避免把说明文档和临时文件打进扩展 zip

## 0.2.61

- 新增 `scripts/validate-release.mjs`
- 一次跑完运行时文件存在性、`manifest` 版本、语法检查、测试和文档同步检查

## 0.2.60

- 新增 `scripts/runtime-files.txt`
- 为扩展运行时、共享核心和最终 zip 内容建立单一来源清单

## 0.2.59

- 新增 `CODE_OF_CONDUCT.md`
- 新增 `SECURITY.md`
- 新增 `LICENSE`，默认按 MIT 开源分发

## 0.2.58

- 新增 `SMOKE-TEST.md`
- 新增 `RELEASING.md`
- 补齐手工冒烟验证与正式发版步骤

## 0.2.57

- 新增 `ARCHITECTURE.md`
- 新增 `PRIVACY.md`
- README 补齐架构、验证、发布与隐私文档入口

## 0.2.56

- 将 `replydrop-p2.55.zip` 恢复为独立可维护基线目录 `x-reply-scorer-p2.55-reset`
- 补齐 `.gitignore`、`OPEN-SOURCE-RESET-AUDIT.md`、`ROADMAP.md`、`CONTRIBUTING.md`
- 修正 README 版本与本地安装路径漂移

## 0.2.55

- 新增 shipped reply 的 pickup-watch 基线记忆：
  - `pending`
  - `quiet`
  - `picked-up`
  - `author-engaged`
- shipped reply 现在会保留：
  - baseline replies / likes / views
  - pickup check count
  - pickup deltas
  - visible author re-engagement marker
- popup archive 从“发送记录”升级为可操作的 post-ship 工作区：
  - `查接住`
  - `重新复查`
  - 打开原帖
  - 打开可见作者回流
- Growth Pulse 开始反映更真实的 post-ship 状态，而不只是抽象增长指标
- attribution memory 开始把 pickup 质量纳入排序，而不只看 shipped 数量
