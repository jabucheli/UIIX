param(
    [string]$Tree = '',
    [string]$Out  = '',
    [string]$Stamp = ''
)

# Empaqueta el arbol de staging (tes + tesis + respaldos + historial + LEEME)
# en un unico .zip. Lo llama tools/traspaso.cmd paquete.
# Uso:
#   powershell -NoProfile -ExecutionPolicy Bypass -File traspaso-empaquetar.ps1 `
#       -Tree "C:\...\tree" -Out "D:\...\out\traspaso" -Stamp "20261007-1850"

$ErrorActionPreference = 'Stop'

if ($Stamp -eq '') { $Stamp = Get-Date -Format 'yyyyMMdd-HHmm' }
if ($Out -eq '')   { $Out = Join-Path $PSScriptRoot 'out\traspaso' }

if (-not (Test-Path $Tree) -or -not (Test-Path (Join-Path $Tree 'tes'))) {
    throw "No existe el arbol de staging en: $Tree"
}

$items = @()
foreach ($n in @('tes', 'tesis', 'LEEME.txt')) {
    $p = Join-Path $Tree $n
    if (Test-Path $p) { $items += , $p }
}
foreach ($n in @('datos-respaldo', 'historial-tes.bundle', 'historial-tesis.bundle')) {
    $p = Join-Path $Tree $n
    if (Test-Path $p) { $items += , $p }
}

if ($items.Count -eq 0) { throw 'No hay nada que empaquetar en el arbol de staging' }

if (-not (Test-Path $Out)) { New-Item -ItemType Directory -Path $Out -Force | Out-Null }
$zip = Join-Path $Out ("tes-tesis-" + $Stamp + ".zip")

Compress-Archive -Path $items -DestinationPath $zip -Force

$len = (Get-Item $zip).Length
Write-Output ("PAQUETE: " + $zip)
Write-Output ("TAMANO : " + $len + " bytes")
Write-Output ("ITEMS  : " + $items.Count)