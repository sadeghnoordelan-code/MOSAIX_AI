param(
  [Parameter(Mandatory=$true)][string]$ModelPath,
  [Parameter(Mandatory=$true)][string]$ModelAlias,
  [string]$RuntimePath = 'E:/MOSAIX-AI/.tools/local-ai/runtime/llama-server.exe',
  [int]$ContextSize = 8192,
  [ValidateRange(1,4)][int]$InferenceThreads = 2
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$privateRoot = Join-Path $projectRoot '.local-ai'
if (-not (Test-Path -LiteralPath $ModelPath -PathType Leaf)) { throw 'Model file is missing or incomplete.' }
if (-not (Test-Path -LiteralPath $RuntimePath -PathType Leaf)) { throw 'Local runtime is missing.' }
if ($ContextSize -lt 4096 -or $ContextSize -gt 8192) { throw 'Context must be between 4096 and 8192.' }
if ($ModelAlias -notmatch '^[a-zA-Z0-9._-]+$') { throw 'Invalid model alias.' }
if (Get-NetTCPConnection -LocalPort 11435 -State Listen -ErrorAction SilentlyContinue) { throw 'A runtime already listens on the private port. Stop only the verified project runtime before switching models.' }
New-Item -ItemType Directory -Path $privateRoot -Force | Out-Null
$keyPath = Join-Path $privateRoot 'runtime.key'
if (-not (Test-Path -LiteralPath $keyPath)) {
  $bytes = New-Object byte[] 32
  $random = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  $random.GetBytes($bytes); $random.Dispose()
  [System.IO.File]::WriteAllText($keyPath, [Convert]::ToBase64String($bytes))
}
# The private bearer key is readable only by the current Windows account and SYSTEM.
$currentSid = [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value
& icacls.exe $keyPath /inheritance:r /grant:r "*$($currentSid):(F)" '*S-1-5-18:(F)' | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Could not restrict the private runtime key permissions.' }
$arguments = @('-m', ('"' + (Resolve-Path -LiteralPath $ModelPath).Path + '"'), '--alias', $ModelAlias, '--host', '127.0.0.1', '--port', '11435', '--parallel', '1', '--cache-ram', '0', '--no-cache-idle-slots', '--ctx-size', "$ContextSize", '--threads', "$InferenceThreads", '--threads-batch', '3', '--batch-size', '128', '--ubatch-size', '64', '--n-gpu-layers', '0', '--reasoning', 'off', '--no-webui', '--no-slots', '--no-webui-mcp-proxy', '--no-context-shift', '--log-verbosity', '0', '--api-key-file', ('"' + $keyPath + '"'))
$runtimeProcess = Start-Process -FilePath $RuntimePath -ArgumentList $arguments -WorkingDirectory (Split-Path -Parent $RuntimePath) -WindowStyle Hidden -RedirectStandardOutput (Join-Path $privateRoot 'runtime-out.log') -RedirectStandardError (Join-Path $privateRoot 'runtime-error.log') -PassThru
@{ pid=$runtimeProcess.Id; model=$ModelAlias; modelPath=(Resolve-Path -LiteralPath $ModelPath).Path; context=$ContextSize; threads=$InferenceThreads; parallel=1; promptCacheMiB=0; host='127.0.0.1'; started=(Get-Date).ToUniversalTime().ToString('o') } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $privateRoot 'runtime.json') -Encoding utf8
Write-Output "Private local runtime started: PID $($runtimeProcess.Id), model $ModelAlias. Website activation remains separate from benchmarking."

