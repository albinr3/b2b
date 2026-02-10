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

$prodDatabaseUrl = $env:PROD_DATABASE_URL
if (-not $prodDatabaseUrl) {
  $prodDatabaseUrl = $env:DATABASE_URL_PROD
}

$prodDirectUrl = $env:PROD_DIRECT_URL
if (-not $prodDirectUrl) {
  $prodDirectUrl = $prodDatabaseUrl
}

if (-not $prodDatabaseUrl) {
  Write-Error "PROD_DATABASE_URL (o DATABASE_URL_PROD) no está configurada en .env"
  exit 1
}

$env:DATABASE_URL = $prodDatabaseUrl
$env:DIRECT_URL = $prodDirectUrl

npx prisma migrate $Action
exit $LASTEXITCODE
