param(
  [Parameter(Mandatory=$true)][string]$ModelPath,
  [Parameter(Mandatory=$true)][string]$ModelAlias,
  [switch]$WaitForModel,
  [ValidateRange(1,4)][int]$InferenceThreads = 2,
  [ValidateSet('v3','v4')][string]$EvidenceVersion = 'v4'
)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)
if ($WaitForModel) {
  $deadline = [DateTime]::UtcNow.AddHours(3)
  while (-not (Test-Path -LiteralPath $ModelPath -PathType Leaf)) {
    if ([DateTime]::UtcNow -gt $deadline) { throw 'Model download not complete. Preserve partial download and resume later.' }
    Start-Sleep -Seconds 20
  }
}
& "$PSScriptRoot/start-local-ai.ps1" -ModelPath $ModelPath -ModelAlias $ModelAlias -InferenceThreads $InferenceThreads
$runtimeMeta = Get-Content -Raw -LiteralPath '.local-ai/runtime.json' | ConvertFrom-Json
$runtimeKey = (Get-Content -Raw -LiteralPath '.local-ai/runtime.key').Trim()
try {
  $ready = $false
  for ($attempt=0; $attempt -lt 60; $attempt++) {
    if (-not (Get-Process -Id $runtimeMeta.pid -ErrorAction SilentlyContinue)) { throw 'Model runtime exited before readiness.' }
    try {
      $health = Invoke-WebRequest -Uri 'http://127.0.0.1:11435/health' -Headers @{ Authorization=('Bearer '+$runtimeKey) } -TimeoutSec 2
      if ($health.StatusCode -eq 200) { $ready=$true; break }
    } catch {}
    Start-Sleep -Seconds 2
  }
  if (-not $ready) { throw 'Model readiness timeout.' }
  Write-Output "Running sequential English benchmark for $ModelAlias"
  $env:MOSAIX_BENCHMARK_VERSION=$EvidenceVersion
  node scripts/benchmark-english-ai.ts
  if ($LASTEXITCODE -ne 0) { throw 'English benchmark did not complete.' }
} finally {
  $ownedProcess = Get-Process -Id $runtimeMeta.pid -ErrorAction SilentlyContinue
  if ($ownedProcess -and $ownedProcess.Path -eq 'E:\MOSAIX-AI\.tools\local-ai\runtime\llama-server.exe') { Stop-Process -Id $ownedProcess.Id }
}



