$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location -LiteralPath $projectRoot

$listener = Get-NetTCPConnection -LocalAddress 127.0.0.1 -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
  Select-Object -First 1

if ($listener) {
  $portPid = $listener.OwningProcess
  $process = Get-Process -Id $portPid -ErrorAction SilentlyContinue

  if ($process) {
    Write-Host "Port 3000 is already used by PID $portPid ($($process.ProcessName)); stopping it first."
    Stop-Process -Id $portPid -Force
    Start-Sleep -Seconds 1
  }
}

npx next dev --hostname 127.0.0.1 --port 3000
