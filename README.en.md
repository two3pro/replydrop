# ReplyDrop

Language: [中文](./README.md) | English

ReplyDrop is a local-first browser extension for X. It scores already-visible posts in your timeline, helps you find reply-worthy windows before they close, and keeps reply workflow state on your device.

Open source, free, local-first, and zero data upload by default.

Current version: `0.2.270`

The Chrome / Brave runtime and the Safari source package now move together on the `0.2.270` shared runtime line; `0.2.250 / 0.2.251` restore the traffic-first homepage timing windows, `0.2.252` completes the reply ledger plus pickup-performance tracking path, `0.2.253` tightens homepage traffic gating again, `0.2.254` separates post heat from reply-slot pickup quality, `0.2.255` separates reply worthiness from execution route, `0.2.256` hardens the send path, `0.2.257` fixes reply-auto / inspect-then-reply routing, `0.2.258` improves candidate supply throughput, `0.2.259` adds transient-failure tolerance plus automatic For You feed correction before executor scans, `0.2.260` keeps high-momentum media posts in the main traffic lane, `0.2.261` tightens executor context handoff, `0.2.262` fixes verified manual-target, composer-input, and reload-resume gaps from live Win Chrome pressure testing, `0.2.263` closes the confirmed `reloading` stall plus direct detail-page timeline fallback gap, `0.2.264` fixes the next pressure-tested layer around detail-page direct replies, repeated resurfacing, and reply-surface UI contamination, `0.2.265` finishes the next executor cleanup around detail-page recheck drift and failed-composer cleanup, `0.2.266` hardens reload recovery for both async and direct detail-page reply actions, `0.2.267` pulls the focus back toward throughput by keeping more strong media posts in the timeline fast lane when their visible text is already enough to draft from, `0.2.268` keeps score waterdrops visible when X opens a tweet inside its detail dialog, `0.2.269` keeps rich-caption media posts from slipping back to detail during quote detection or cached candidate re-hydration, and `0.2.270` keeps high-potential media candidates alive long enough to finish detail inspection before judging their value again.

Version `0.2.270` is about protecting the real detail route, not forcing every media post back into homepage inline reply. If a candidate is already `reply-now / send_now` but still needs OCR, vision, or media summary, opening detail should keep it alive through inspection instead of killing it early as `value-dropped-on-open`. The detail-dialog waterdrop visibility fix from `0.2.268` stays on this release line too.

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

Version `0.2.270` closes the next batch of pressure-tested workflow gaps:

- high-potential `reply-now / send_now` image and video posts are no longer dropped as `value-dropped-on-open` just because media inspection has not finished yet when detail first opens
- `detail-inspection-pending` is now treated as route diagnostics instead of a fake hard downgrade, so detail inspection can complete before the post is judged again

Version `0.2.269` closes the next batch of pressure-tested workflow gaps:

- quote/status-link detection is narrower, so rich-caption media posts are less likely to be hard-forced into detail just because the card contains another status URL
- cached `reply-now / send_now` media candidates now preserve their inline quick-draft eligibility during re-hydration instead of silently falling back to detail when no fresh live article is attached

Version `0.2.268` closes the next batch of pressure-tested workflow gaps:

- opening a tweet into X's detail dialog no longer blanks the score waterdrop just because the article is rendered under a `dialog`
- score chrome is now suppressed only for genuine active reply-surface contamination risk, not for normal detail-page inspection

Version `0.2.267` closes the next batch of pressure-tested workflow gaps:

- strong media/video posts with enough timeline text no longer default to detail inspection just because they are moving fast; the fast lane can keep more of them in the main send path
- live routing, candidate context, and send-time recheck now prefer the current page's `timeline_inline` signal when the card is genuinely workable, instead of getting dragged back to detail too easily by stale cache state
- detail inspection remains available when quote/show-more/media context is genuinely needed, but it is treated as a fallback route rather than the default tax on hot visual posts

Version `0.2.266` closes the next batch of pressure-tested workflow gaps:

- reload-interrupted async handoffs no longer jump to terminal `replydrop-api-document-reloaded` after a single shaky resume; they wait for a target-ready detail page and retry only a narrower set of reload/surface failures
- direct `replyFromTimeline(payload)` calls now create a local handoff too, so a detail-page document reload can still resume the action path or at least finish cleanup on the next document
- exhausted reload resumes now clean the reply surface before final rejection, reducing the chance of leaving an empty disabled composer behind

Version `0.2.265` closes the next batch of pressure-tested workflow gaps:

- open-stage live recheck now reuses live detail-page context completeness plus media-sampling hints, so detail-route media posts are less likely to be blocked by stale preview-shaped rechecks
- failed `reply-from-timeline` / `inspect-then-reply` / `reply` / `submit-reply` actions now clean up the lingering empty composer, and when the current detail page still stays stuck open, the executor reloads the target detail page back to a clean state
- timeline-to-detail fallback now stays inside the shared executor failure/cleanup path, instead of short-circuiting around it on a failed detail open

Version `0.2.264` closes the next batch of pressure-tested workflow gaps:

- direct detail-page `replyFromTimeline(payload)` calls no longer self-bounce to `home` before the detail fallback path can take over
- explicit current-page target resolution now prefers the live visible status URL, which also makes `skipCandidate(tweetId)` work more reliably from the current detail page
- recently failed or skipped targets enter a temporary cooldown instead of resurfacing immediately, and active reply surfaces hide score/decor layers on the target card

Version `0.2.263` finishes the two remaining executor gaps confirmed in the Win Chrome follow-up:

- pending async detail-route tickets no longer hang forever in `state="reloading"` when the target page is still mounting after reload; the resumed handoff now re-schedules itself until the target is actually reachable
- direct `replyFromTimeline(payload)` calls now share the same executor routing and detail fallback as `runExecutorAction({ action: "reply-from-timeline" })`, so explicit detail-page targets do not bounce back to an empty home composer

Version `0.2.262` turns the verified Win Chrome handoff issues into concrete mainline fixes:

- explicit current-detail manual targets no longer get blocked just because live recheck says `value-dropped-on-open` or `value-below-send-floor`; the diagnostic remains, but it no longer overrides a human who already opened that target
- `getCandidateContext()` / `getExecutorContext()` now rebuild a usable live context for explicit current-page targets even when the tweet is not in `recentCandidates` or the queue
- composer writes now require the real `contenteditable` node, re-run a stronger paste-like input lifecycle when text is visible but the send button is still disabled, and async `beginExecutorAction()` tickets now survive detail-page reloads through a resumable handoff path

Version `0.2.261` is an execution-path hotfix that keeps the candidate context stable once a reply action starts:

- executor actions now carry a `candidateSnapshot`, so `reply-auto`, composer open, timeline reply, detail inspection, and submit no longer depend solely on a second runtime lookup to rediscover the same target
- `timeline-inline-required` is now treated like a transient routing failure rather than an immediate denylist-worthy failure
- live recheck now reuses inline/detail/context-completeness hints from the candidate snapshot, reducing route drift after opening the target

Version `0.2.260` keeps strong media candidates in the main traffic lane instead of treating them as fragile edge cases:

- media sampling meta can now promote high-momentum image/video posts, override route buckets, and classify crowded growth-bait setups without automatically downgrading them just because they need detail inspection
- candidate summaries and context scoring now expose `trafficOverrideEligible`, `mediaSamplingPromoted`, `growthBaitSignal`, `growthBaitCrowded`, `needsDetailContext`, `mediaContextMissing`, `mediaVelocityInspectionHint`, and `mediaSummaryAvailable`
- transient failures such as `candidate-not-found`, `round-idle-timeout`, `value-dropped-on-open`, `value-below-send-floor`, `score-degraded-below-average`, and `score-below-agent-send-floor` are now treated as tolerable round failures instead of immediately poisoning the loop

Version `0.2.259` stops wasting good targets on transient execution failures and keeps the executor anchored to the Home For You feed:

- transient failures such as `begin-failed`, `context-not-locked`, `reply-target-lost`, or `ticket-not-found` no longer automatically denylist a target for the rest of the round
- `getExecutorInbox()` and `refreshRecommendations()` now verify the active Home tab and auto-correct back to `For You` before scanning, while reporting the selected feed in diagnostics
- live rechecks now tolerate small score / exposure drift for previously `reply-now` timeline-inline candidates instead of immediately forcing `skip-recommended`

Version `0.2.255` keeps media posts in sampling and routes them to detail inspection instead of downgrading:

- `scorer.js` no longer pushes media posts down just because OCR or vision context is still missing.
- `content.js` now separates `replyWorthinessState` from `executionRoute`, so media flags only decide the route and no longer force `review_needed` or `skip`.
- Green waterdrops now mean "worth immediate handling", while timeline, panel, and executor routing all share the same sendability semantics.

Version `0.2.254` splits post heat from reply pickup scoring:

- `scorer.js` now exposes `postBlastScore`, `replyPickupScore`, `executionScore`, and `predictedCommentExposure`.
- A new `heatReplyGapPenalty` punishes hot parent posts whose reply slot is actually weak.
- `content.js` now routes candidate payloads, execution rechecks, auto-safe decisions, fallback reasons, and panel sorting around predicted comment exposure plus execution quality.

Version `0.2.253` keeps the new reply ledger/performance pipeline from `0.2.252`, but pulls homepage traffic gating back toward the live manual workflow:

- The `0-60` minute and `60-120` minute homepage traffic thresholds are higher again, so weak early traffic does not drift into `reply-now`.
- `computeTimingWindowPenalty` now bites earlier and harder, especially once a post moves past the first clean acceleration window.
- Live `broadcastAccount` detection can still surface as a zero-weight risk marker, but it no longer deducts score by itself.
- The popup now exposes a simple export action for `getReplyPerformanceReport({ todayOnly: true, limit: 500 })`.

Version `0.2.252` completes the Chrome / Brave reply ledger and performance tracking path:

- `markShipped` now carries stable fields such as `ledgerId`, `roundId`, `sessionId`, `replyUrl`, `replyTweetId`, and `sendResult` instead of relying on parent-thread URL matching alone.
- The public executor layer now exposes `getReplyLedger`, `exportReplyLedger`, `importReplyLedger`, `capturePickupSnapshot`, `captureReplyPerformance`, `refreshReplyPerformance`, and `getReplyPerformanceReport`.
- The goal is to keep the `0.2.250 / 0.2.251` traffic-first scoring behavior intact while making shipped replies easier to restore, audit, and export.

Version `0.2.251` tightens homepage timing and traffic tuning without changing the blue-check gate, mutual lift, media allowance, or topic-neutral policy:

- `45-60` minute posts now need stronger proof before they stay in the live reply lane.
- The `60-120` minute lane now asks for stronger absolute views, stronger velocity, and a thinner reply floor.
- `120+` minute leftovers lose positive window support earlier and pick up a stricter stale drop.

Version `0.2.250` moves Chrome / Brave onto the new traffic-first, topic-neutral scoring line and syncs it into the Safari `0.2.249` source package:

- Rising posts inside `0-60` minutes can now surface with only hundreds to low-thousands of views, while the `60-120` minute lane now demands stronger traffic and thinner reply floors.
- Topic or account category alone no longer suppresses political, media, or official posts; timing, velocity, crowding, and reply distribution now decide whether they stay live.
- Mutual / follow-up / remembered relationship lanes get more lift, the blue-check-only automatic gate stays in place, and `background.js` now logs per-core-script import failures.

Version `0.2.236` fixes human draft mismatch and visible-post packing gaps:

- Human draft targets now always expose post-level anchors such as `targetTweetId`, `targetUrl`, `lead`, and `selectionHint`, so same-handle multi-post pages no longer rely on handle-only matching.
- `getDraftTargets()` now backfills scored posts that are visibly on screen but missing from the runtime candidate pack, so they still appear in `candidates`, `filteredCandidates`, or `visibleScoredPosts`.
- Same-handle collision risk is now explicit through `sameHandlePostCount`, helping manual workflows avoid cross-reply mistakes.

Version `0.2.235` relaxes candidate timing routes:

- `crowded` no longer falls straight into tomorrow; it now maps to `queue-tonight`.
- The `watch` threshold is lowered from 58 to 54 so mid-band 55-57 candidates are not auto-buried in backlog.
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

## Downloads

- Chrome / Brave runtime package: [replydrop-p2.270.zip](./downloads/replydrop-p2.270.zip)
  - Runtime package for Chrome, Brave, Edge, and other Chromium browsers.
  - Unzip it first, then load the extracted folder through `chrome://extensions`.
- Safari for macOS source package: [replydrop-safari-open-source-0.2.270.zip](./downloads/replydrop-safari-open-source-0.2.270.zip)
  - Includes the Safari extension source, Xcode project, MIT license, and install notes.
  - This is a source-open / local self-sign package, not an official signed app download.
  - You need your own Apple ID / Team to sign locally. See `INSTALL.md` inside the package.
- Version note:
  - Chrome / Brave now uses the `0.2.270` public baseline in this repo.
  - The Safari source package is also synced to `0.2.270`.

## Local Install

1. Open `chrome://extensions` in Chrome or Brave.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this repository root.
5. Open `x.com` or `twitter.com`, then wait a few seconds for ReplyDrop to scan visible posts.

## Privacy

ReplyDrop reads already-rendered public content inside the browser tab and stores workflow state locally in `chrome.storage.local`. It does not require a ReplyDrop account, does not upload timeline data to ReplyDrop-owned servers, and does not use a remote AI API by default.

See [PRIVACY.md](./PRIVACY.md) for the full boundary.
