param(
    [string]$Paquete = '',
    [string]$Destino = '',
    [string]$CarpetaExtraida = ''
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'paquete-integridad.ps1')

function Restore-GitHistory([string]$Tree) {
    foreach ($name in @('presentacion', 'tesis')) {
        $bundle = Join-Path $Tree ("historial-$name.bundle")
        if (-not (Test-Path -LiteralPath $bundle)) { continue }
        $repo = Join-Path $Tree $name
        if (Test-Path -LiteralPath (Join-Path $repo '.git')) {
            throw "Ya existe .git en $repo. El historial solo se restaura en una copia nueva."
        }
        $clone = Join-Path $Tree ('.historial-' + $name + '-' + [guid]::NewGuid().ToString('N'))
        $ErrorActionPreference = 'Continue'
        $output = @(& git clone --no-checkout -- $bundle $clone 2>&1)
        $code = $LASTEXITCODE
        $ErrorActionPreference = 'Stop'
        if ($code -ne 0) { throw "No se pudo recuperar el historial de $name : $($output -join ' ')" }
        # Windows puede impedir renombrar el .git oculto; copiarlo evita depender de ese permiso.
        & robocopy.exe (Join-Path $clone '.git') (Join-Path $repo '.git') /E /XJ /R:1 /W:1 /NJH /NJS /NFL /NDL /NP | Out-Null
        if ($LASTEXITCODE -ge 8) { throw "No se pudo copiar el historial de $name." }
        Remove-Item -LiteralPath $clone -Recurse -Force
        # Carga el indice de HEAD sin escribir archivos: conserva los cambios pendientes del ZIP.
        & git -C $repo read-tree HEAD
        if ($LASTEXITCODE -ne 0) { throw "No se pudo recuperar el indice de $name." }
        Write-Output "Historial recuperado: $name"
    }
}

try {
    if (-not $Paquete -and -not $CarpetaExtraida) {
        Write-Output 'Uso: recuperar.cmd -Paquete "D:\ruta\copia.zip" -Destino "D:\ejemplo\recuperacion-nueva"'
        Write-Output 'El destino debe ser una carpeta NUEVA. La recuperacion comprueba todos los SHA256.'
        Write-Output 'Con un ZIP ya extraido en una carpeta nueva: -CarpetaExtraida "D:\ejemplo\recuperacion-nueva"'
        exit 0
    }
    if ($CarpetaExtraida -and ($Paquete -or $Destino)) { throw 'Usar -CarpetaExtraida o bien -Paquete y -Destino.' }
    if ($CarpetaExtraida) {
        $tree = (Get-Item -LiteralPath $CarpetaExtraida).FullName
        foreach ($name in @('presentacion', 'tesis')) {
            if (Test-Path -LiteralPath (Join-Path $tree "$name\.git")) {
                throw 'La carpeta extraida ya tiene historial Git. Utilice una copia nueva.'
            }
        }
    } else {
        if (-not $Destino) { throw 'Indicar -Destino con una carpeta nueva.' }
        $tree = [IO.Path]::GetFullPath($Destino)
        if (Test-Path -LiteralPath $tree) { throw "El destino ya existe; no se sobrescribe: $tree" }
        if (-not (Test-Path -LiteralPath (Split-Path $tree) -PathType Container)) { throw 'No existe la carpeta madre del destino.' }
        $checked = Test-ProjectPackage $Paquete
        Write-Output ("INTEGRIDAD ZIP OK: " + $checked.archivos + ' archivos')
        if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Instalar Git para recuperar tambien el historial.' }
        [IO.Directory]::CreateDirectory($tree) | Out-Null
        [IO.Compression.ZipFile]::ExtractToDirectory($checked.paquete, $tree)
    }
    Test-ExtractedPackage $tree
    Restore-GitHistory $tree
    $exports = Join-Path $tree 'datos-respaldo'
    if (Test-Path -LiteralPath $exports) {
        $app = Join-Path $tree 'presentacion\presentacion-web\ntp330\0'
        if (-not (Test-Path -LiteralPath (Join-Path $app 'index.html'))) { $app = Join-Path $tree 'tesis\0' }
        $exportsTarget = Join-Path $app 'pruebas\out\respaldos'
        New-Item -ItemType Directory -Path $exportsTarget -Force | Out-Null
        Get-ChildItem -LiteralPath $exports -Filter '*.json' -File | ForEach-Object {
            Copy-Item -LiteralPath $_.FullName -Destination $exportsTarget
        }
    }
    $inventory = Join-Path $tree 'presentacion\tools\verificar-inventario.js'
    if ((Test-Path -LiteralPath $inventory) -and (Get-Command node -ErrorAction SilentlyContinue)) {
        & node $inventory
        if ($LASTEXITCODE -ne 0) { throw 'El inventario recuperado esta incompleto. Revisar el informe anterior.' }
    }
    Write-Output "RECUPERACION COMPLETA: $tree"
    Write-Output ("Continuar con: " + (Join-Path $tree 'presentacion\iniciar.cmd'))
    Write-Output 'Evaluaciones: importar el JSON propio desde Catalogo de la app NTP330.'
    exit 0
}
catch { [Console]::Error.WriteLine('ERROR: ' + $_.ToString()); exit 1 }
