#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const LOCAL_RUNNER_HOST = "127.0.0.1";
const LOCAL_RUNNER_PORT = 38947;

function parseArgs(argv) {
  const options = {
    action: "doctor",
    tweetId: "",
    draft: "",
    draftFile: "",
    browserPath: "",
    targetUrl: "https://x.com/home",
    timeoutMs: 30000
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];
    switch (token) {
      case "--action":
        options.action = String(next || "").trim() || options.action;
        index += 1;
        break;
      case "--tweet-id":
        options.tweetId = String(next || "").trim();
        index += 1;
        break;
      case "--draft":
        options.draft = String(next || "");
        index += 1;
        break;
      case "--draft-file":
        options.draftFile = String(next || "").trim();
        index += 1;
        break;
      case "--browser-path":
        options.browserPath = String(next || "").trim();
        index += 1;
        break;
      case "--target-url":
        options.targetUrl = String(next || "").trim() || options.targetUrl;
        index += 1;
        break;
      case "--timeout-ms":
        options.timeoutMs = Number.parseInt(next, 10) || options.timeoutMs;
        index += 1;
        break;
      default:
        break;
    }
  }

  return options;
}

function buildCommandPayload(options) {
  const draft = options.draftFile
    ? fs.readFileSync(path.resolve(options.draftFile), "utf8")
    : options.draft;
  return {
    requestId: `replydrop-local-runner:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`,
    action: String(options.action || "").trim().toLowerCase(),
    tweetId: String(options.tweetId || "").trim(),
    draft: String(draft || ""),
    targetUrl: String(options.targetUrl || "").trim() || "https://x.com/home",
    timeoutMs: Math.max(1000, Math.floor(Number(options.timeoutMs || 30000)))
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const command = buildCommandPayload(options);
  const bridgeUrl = `http://${LOCAL_RUNNER_HOST}:${LOCAL_RUNNER_PORT}`;
  let settled = false;
  let timeout = null;

  const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url || "/", bridgeUrl);

    if (req.method === "GET" && requestUrl.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        ok: true,
        host: LOCAL_RUNNER_HOST,
        port: LOCAL_RUNNER_PORT,
        requestId: command.requestId,
        settled
      }));
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/next") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(command));
      return;
    }

    if (req.method === "POST" && requestUrl.pathname === "/result") {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => {
        try {
          const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
          if (String(body?.requestId || "").trim() !== command.requestId) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, reason: "request-not-found" }));
            return;
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true }));
          if (settled) {
            return;
          }
          settled = true;
          clearTimeout(timeout);
          process.stdout.write(`${JSON.stringify(body?.result ?? { ok: false, reason: "missing-result" }, null, 2)}\n`);
          server.close();
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, reason: String(error?.message || error || "invalid-json") }));
        }
      });
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, reason: "not-found" }));
  });

  await new Promise((resolve, reject) => {
    server.once("error", (error) => {
      if (String(error?.code || "").trim() === "EADDRINUSE") {
        reject(new Error(`local-runner-bridge-port-in-use:${LOCAL_RUNNER_PORT}`));
        return;
      }
      reject(error);
    });
    server.listen(LOCAL_RUNNER_PORT, LOCAL_RUNNER_HOST, resolve);
  });

  timeout = setTimeout(() => {
    if (settled) {
      return;
    }
    settled = true;
    process.stderr.write(`${JSON.stringify({
      ok: false,
      reason: "local-runner-timeout",
      requestId: command.requestId,
      bridgeUrl
    }, null, 2)}\n`);
    server.close();
    process.exit(1);
  }, Math.max(1000, Math.floor(Number(options.timeoutMs || 30000))));
}

main().catch((error) => {
  process.stderr.write(`${JSON.stringify({
    ok: false,
    reason: String(error?.message || error || "local-runner-failed")
  }, null, 2)}\n`);
  process.exit(1);
});
