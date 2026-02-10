param(
  [ValidateSet("deploy", "status")]
  [string]$Action = "deploy"
)

$envFile = Join-Path $PSScriptRoot "..\\.env"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -notmatch '=') { return }
    $name, $value = $_ -split '=', 2
    $value = $value.Trim()
    if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
      $value = $value.Substring(1, $value.Length - 2)
    }
    Set-Item -Path ("Env:" + $name.Trim()) -Value $value
  }
}

$prodDirectUrl = $env:PROD_DIRECT_URL
if (-not $prodDirectUrl) {
  Write-Error "PROD_DIRECT_URL no está configurada en .env"
  exit 1
}

$env:DATABASE_URL = $prodDirectUrl
$env:DIRECT_URL = $prodDirectUrl

npx prisma migrate $Action
exit $LASTEXITCODE
