param(
    [string]$Tree = '',
    [string]$Out  = '',
    [string]$Stamp = ''
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'paquete-integridad.ps1')

if ($Stamp -eq '') { $Stamp = (Get-Date -Format 'yyyyMMdd-HHmmss-fff') + '-' + [guid]::NewGuid().ToString('N').Substring(0, 8) }
if ($Out -eq '')   { $Out = Join-Path $PSScriptRoot 'out\traspaso' }
if ($Stamp -notmatch '^[0-9a-zA-Z-]+$') { throw 'Identificador de paquete no valido.' }

foreach ($required in @('presentacion', 'LEEME.txt', 'ESTADO.json')) {
    if (-not (Test-Path -LiteralPath (Join-Path $Tree $required))) { throw "Falta en staging: $required" }
}

if (-not (Test-Path -LiteralPath $Out)) { New-Item -ItemType Directory -Path $Out -Force | Out-Null }
$zip = Join-Path $Out ("presentacion-tesis-" + $Stamp + ".zip")
$partial = $zip + '.partial'
if ((Test-Path -LiteralPath $zip) -or (Test-Path -LiteralPath $partial)) { throw "Ya existe: $zip" }

try {
    New-PackageManifest $Tree
    # Entradas con / en todas las versiones de .NET; incluye archivos ocultos como .gitignore.
    $archive = [IO.Compression.ZipFile]::Open($partial, [IO.Compression.ZipArchiveMode]::Create)
    try {
        foreach ($file in Get-ChildItem -LiteralPath $Tree -Recurse -File -Force) {
            [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName,
                (Get-RelativeFile $Tree $file.FullName), [IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
    }
    finally { $archive.Dispose() }
    $checked = Test-ProjectPackage $partial
    Write-Utf8 ($partial + '.sha256') ($checked.sha256 + '  ' + [IO.Path]::GetFileName($zip) + "`r`n")
    Move-Item -LiteralPath $partial -Destination $zip
    Move-Item -LiteralPath ($partial + '.sha256') -Destination ($zip + '.sha256')
    Write-Output ("PAQUETE: " + $zip)
    Write-Output ("TAMANO : " + (Get-Item -LiteralPath $zip).Length + " bytes")
    Write-Output ("INTEGRIDAD OK: " + $checked.archivos + " archivos; SHA256 " + $checked.sha256)
}
finally {
    foreach ($p in @($partial, ($partial + '.sha256'))) {
        if (Test-Path -LiteralPath $p) { Remove-Item -LiteralPath $p -Force }
    }
}
