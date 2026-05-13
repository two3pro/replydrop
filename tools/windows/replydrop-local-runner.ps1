param(
  [Parameter(Mandatory = $true)]
  [string]$Action,
  [string]$TweetId = "",
  [string]$Draft = "",
  [string]$DraftFile = "",
  [ValidateSet("auto", "chrome", "brave")]
  [string]$Browser = "auto",
  [string]$BrowserPath = "",
  [string]$TargetUrl = "https://x.com/home",
  [int]$TimeoutMs = 30000
)

$ErrorActionPreference = "Stop"

function Resolve-BrowserPath {
  param(
    [string]$Preferred,
    [string]$ExplicitPath
  )

  if ($ExplicitPath -and (Test-Path $ExplicitPath)) {
    return (Resolve-Path $ExplicitPath).Path
  }

  $chromeCandidates = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe",
    "$env:LocalAppData\Google\Chrome\Application\chrome.exe"
  )

  $braveCandidates = @(
    "$env:ProgramFiles\BraveSoftware\Brave-Browser\Application\brave.exe",
    "$env:ProgramFiles(x86)\BraveSoftware\Brave-Browser\Application\brave.exe",
    "$env:LocalAppData\BraveSoftware\Brave-Browser\Application\brave.exe"
  )

  $runningNames = @()
  foreach ($name in @("brave", "chrome")) {
    if (Get-Process -Name $name -ErrorAction SilentlyContinue) {
      $runningNames += $name
    }
  }

  if ($Preferred -eq "brave") {
    foreach ($candidate in $braveCandidates) {
      if (Test-Path $candidate) { return $candidate }
    }
  }

  if ($Preferred -eq "chrome") {
    foreach ($candidate in $chromeCandidates) {
      if (Test-Path $candidate) { return $candidate }
    }
  }

  if ($runningNames -contains "brave") {
    foreach ($candidate in $braveCandidates) {
      if (Test-Path $candidate) { return $candidate }
    }
  }

  if ($runningNames -contains "chrome") {
    foreach ($candidate in $chromeCandidates) {
      if (Test-Path $candidate) { return $candidate }
    }
  }

  foreach ($candidate in ($chromeCandidates + $braveCandidates)) {
    if (Test-Path $candidate) {
      return $candidate
    }
  }

  return ""
}

$root = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$runner = Join-Path $root "tools\windows\replydrop-local-runner.js"
$node = (Get-Command node).Source
$resolvedBrowserPath = Resolve-BrowserPath -Preferred $Browser -ExplicitPath $BrowserPath

$args = @(
  $runner,
  "--action", $Action,
  "--target-url", $TargetUrl,
  "--timeout-ms", $TimeoutMs
)

if ($TweetId) {
  $args += @("--tweet-id", $TweetId)
}
if ($Draft) {
  $args += @("--draft", $Draft)
}
if ($DraftFile) {
  $args += @("--draft-file", (Resolve-Path $DraftFile).Path)
}
if ($resolvedBrowserPath) {
  $args += @("--browser-path", $resolvedBrowserPath)
}

& $node @args
exit $LASTEXITCODE
