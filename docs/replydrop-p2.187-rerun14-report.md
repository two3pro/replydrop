# ReplyDrop p2.187 rerun14 report

## Conclusion

- Version under test: `0.2.187`
- Sample count doubled from 7 to `14` attempts.
- Real visible reply successes: `11`
- Open-time score-drop skips: `3`
- End-of-run browser location: `https://x.com/home`

## Corrected items from last round

- The runner now returns to home after every send attempt and also finishes on home.
- The runner calls `submitReply({ autoLikeIfChinese: true })`.
- If inbox recommendations are insufficient, the runner refreshes home and continues searching.

## What happened

- Three targets were correctly blocked by `openComposer()` with `reasonCode = value-dropped-on-open`:
  - `https://x.com/0xXIAOc/status/2047293546169061799` with `liveScore = 39`
  - `https://x.com/PhyrexNi/status/2047303920650002606` with `liveScore = 43`
  - `https://x.com/dogeofficialceo/status/2047288379105231358` with `liveScore = 41`
- One Chinese success path (`BroLeon`) completed with native auto-like success: `likeAttempted = true`, `likePerformed = true`, `likeState = liked`.
- Non-Chinese success paths repeatedly hit a new plugin exception after the reply was already visible in-thread: `submit-exception: isChinese is not defined`.
  - This did not block the actual reply from appearing.
  - It did block the post-send API result from staying clean on those non-Chinese samples.

## Logs

- Round log: `D:\Users\replydrop-agent\logs\replydrop-p2187-retest-20260423-rerun14.jsonl`
- Summary JSON: `D:\Users\replydrop-agent\logs\replydrop-p2187-rerun14-summary.json`
