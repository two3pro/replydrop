# ReplyDrop

Language: [中文](./README.md) | English

ReplyDrop is a local-first browser extension for X. It scores already-visible posts in your timeline, helps you find reply-worthy windows before they close, and keeps reply workflow state on your device.

Open source, free, local-first, and zero data upload by default.

Current version: `0.2.234`

![ReplyDrop GitHub hero](./docs/assets/replydrop-github-hero.png)

<p align="center">
  <a href="./SMOKE-TEST.md">Quick Start</a> ·
  <a href="./AUTOMATION.md">ReplyDropAPI</a> ·
  <a href="./docs/store/CHROME-WEB-STORE-LISTING.md">Store Listing</a> ·
  <a href="./PRIVACY.md">Privacy</a>
</p>

| Live discovery | Local workflow | Executor ready |
| --- | --- | --- |
| Scores posts already rendered in the current X timeline and marks high-value reply windows | Reply queue, publish watch, pickup review, attribution memory, and settings stay in the browser | `window.ReplyDropExecutor` / `window.ReplyDropAPI` lets Codex, OpenClaw, Hermes, Claude, or any local CDP script read shortlist context, open the real composer, submit, verify, and skip safely |

## Why It Exists

ReplyDrop is not a cloud dashboard and not an unattended mass-posting bot. It is a lightweight browser extension that helps users and local agents choose better X replies:

- It scans the visible X / Twitter timeline and scores reply opportunities locally.
- It favors posts with realistic interaction potential instead of only boosting giant accounts.
- It tracks reply queue, publish handoff, pickup review, attribution memory, and growth signals in `chrome.storage.local`.
- It exposes a stable page-world automation API for local agents through `window.ReplyDropExecutor`.
- It can package post text, scoring details, traffic signals, media references, and route hints for external AI agents.
- It does not call a remote AI model, upload timeline data to ReplyDrop servers, or run a background auto-posting service.

## Latest Updates

Version `0.2.234` fixes human draft empty-state regressions:

- Human draft mode no longer returns zero primary candidates just because `ready_now` is empty.
- When `ready_now` is empty, high-score `watch_later` items and preview-writable `needs_detail_context` items are promoted into main `candidates` as `human_fallback`.
- Timeline preview composers opened from a target card now lock to the fresh pending target, fixing false `context-not-locked` failures on submit.
- `runExecutorAction({ action: 'reply-from-timeline', tweetId, draft })` now opens and submits in one stable preview-card flow when a draft is provided.
- `getExecutorInbox()` now returns `candidateDiagnostics`, `safeCandidateCount`, `blockedCandidateCount`, `topFilteredCodes`, `topBlockedCodes`, and `topHumanReviewCodes` for redacted stress testing.
- Agents can report why a candidate entered or missed the automatic lane without printing post text, URLs, handles, or risk words.
- Candidate context now exposes `execution.timelineInlineReplyEligible`, `preferredOpenMode`, and `preferredAction`.
- Agents should use `replyFromTimeline` / `runExecutorAction({ action: 'reply-from-timeline' })` when the visible homepage card has enough text context, skipping detail-page navigation.
- Detail-page opening is still used when media, quote cards, show-more text, or incomplete context requires recheck.
- Auto mode no longer keyword-blocks Web3, crypto, trading, investment, reward, political, official, or promo topics; those signals are handled by scoring and live recheck instead.
- Same-author protection now only blocks the third consecutive reply to the same account, instead of blocking any repeat author during the day.
- Media posts without built-in visual summaries can still enter the executor lane so external agents can use `getMediaBundle()` / OCR / vision and write a real reply.
- The hard gate remains the live detail-page recheck: below send floor or skip-recommended still does not auto-send.
- Executor sampling now scans a wider 64-item window before filtering, then returns the best 16 automatic candidates so low-value front-page clutter does not starve the lane.
- No-candidate rounds now expose a 60-second timeout policy and diagnostics instead of letting agents wait for several minutes.
- Auto-send now excludes more Web3 / DeFi / airdrop / yield / trading-tool / portfolio-finance bait from the automatic lane while keeping human discovery flow-first.
- AI executor inbox is now split into `auto_safe`, `human_review`, and `blocked`; only `auto_safe` appears in `candidates`.
- When `auto_safe` is empty, low-risk `human_review` items can enter `auto_fallback` so the executor does not stall on an otherwise usable page.
- `pickDiagnostics` reports scanned / visible / filtered counts, no-auto-safe status, and the top excluded items for faster stress-test debugging.
- Auto-send now blocks political violence / assassination wording, comment rewards such as 10U, and investment subscription / signal bait.
- Auto-send now removes duplicate authors, unresolved short video / meme media, directional crypto trades, withdrawal / funds-safety incidents, and official alcohol / promo posts from the automatic lane.
- Political, violent, controversial, or otherwise sensitive posts are no longer hard-blocked by default. ReplyDrop keeps them as risk tags, but the ranking now prioritizes exposure window and reply opportunity.
- `getDraftTargets()` no longer moves high-score posts out of the main draft lane just because they carry risk / political / broadcast / promo labels.
- High-score `queue-tonight` / `queue-tomorrow` items can still appear in the external draft main lane when the current reply window is useful.
- Added X GraphQL traffic features such as velocity, reply ratio, and traffic phase to improve reply-window scoring.
- Added `refreshRecommendations()` and `emptyInboxRecovery`, so agents must refresh or scroll-rescan before reporting an empty round.
- Added 90-second target guidance and a 120-second hard timeout for executor flows.
- Added a snapshot-based external draft workflow: `getDraftTargets()` now returns `snapshotId`, `capturedAt`, and `collaborationPolicy` so AI agents generate copyable drafts in the current chat without refreshing, queueing, or sending unless the human explicitly asks.
- Added draft target location metadata: `rank`, `visibleOnPage`, `domIndex`, `handle`, `score`, `ageMinutes`, `textPreview`, and `mediaKind`, while keeping the waterdrop badge score-only.
- Added `aiHints.draftAngleHints` so high-flow wealth / asset stories can remain visible in human preview mode while drafts are constrained to neutral behavioral-finance angles and avoid investment advice, buy / sell language, price predictions, ticker promotion, and FOMO.
- Added `needsDetailContext`, `mediaContextMissing`, `draftContextLabel`, and `contextCompleteness` so homepage drafts are clearly marked as quick previews when media, quote cards, or hidden detail text may carry the main meaning.
- Added `setMediaSummary()` so external agents can run OCR / vision on `getMediaBundle()` URLs and write the visual summary back into ReplyDrop before drafting.
- Added local fallback snapshots so `getExecutorInbox()` does not fail just because background state sync is late.
- Tightened scoring against X payout / revenue flex posts, follower bait, big-account low-info controversy questions, political / official broadcasters, crypto wealth narratives, and one-way viral traffic.
- Restored media competitiveness when the caption or available metadata is meaningful, while still flagging low-confidence image / video posts for external vision handling.

## Screenshots

![ReplyDrop popup home](./docs/assets/replydrop-popup-home.png)

![ReplyDrop dashboard tabs](./docs/assets/replydrop-dashboard-tabs.png)

![ReplyDrop growth dashboard](./docs/assets/replydrop-growth-dashboard.png)

## Automation API

ReplyDrop injects a page-world global object only on `x.com`:

```js
window.ReplyDropExecutor
```

The legacy alias remains available:

```js
window.ReplyDropAPI
```

Common calls:

```js
await window.ReplyDropExecutor.getCapabilities()
await window.ReplyDropExecutor.getCandidates()
await window.ReplyDropExecutor.getMediaBundle("2045354208548069468")
await window.ReplyDropExecutor.setMediaSummary({ tweetId: "2045354208548069468", summary: "visual summary", ocrText: "OCR text", confidence: 0.8 })
await window.ReplyDropExecutor.getTrafficSnapshot("2045354208548069468")
await window.ReplyDropExecutor.getDraftTargets({ limit: 6 })
await window.ReplyDropExecutor.getDraftContext("2045354208548069468")
await window.ReplyDropExecutor.setDraftPreview({ tweetId: "2045354208548069468", replyText: "your finished draft" })
await window.ReplyDropExecutor.refreshRecommendations({ mode: "scroll", pages: 2 })
await window.ReplyDropExecutor.getExecutorInbox({ limit: 6 })
await window.ReplyDropExecutor.getExecutorContext("2045354208548069468")
await window.ReplyDropExecutor.replyFromTimeline({ tweetId: "2045354208548069468", draft: "your reply text" })
await window.ReplyDropExecutor.openComposer({ tweetId: "2045354208548069468", draft: "your reply text" })
await window.ReplyDropExecutor.submitReply({ autoLikeIfChinese: true })
await window.ReplyDropExecutor.runExecutorAction({ action: "reply", tweetId: "2045354208548069468", draft: "your reply text" })
await window.ReplyDropExecutor.skipCandidate("2045354208548069468")
```

See [AUTOMATION.md](./AUTOMATION.md) for return shapes, failure reasons, CDP examples, empty-inbox recovery, and timeout rules.

## Local Install

1. Open `chrome://extensions` in Chrome or Brave.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this repository root.
5. Open `x.com` or `twitter.com`, then wait a few seconds for ReplyDrop to scan visible posts.

## Privacy

ReplyDrop reads already-rendered public content inside the browser tab and stores workflow state locally in `chrome.storage.local`. It does not require a ReplyDrop account, does not upload timeline data to ReplyDrop-owned servers, and does not use a remote AI API by default.

See [PRIVACY.md](./PRIVACY.md) for the full boundary.
