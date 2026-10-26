$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'paquete-integridad.ps1')
$base = Join-Path $PSScriptRoot ('out\pruebas-respaldo-' + [guid]::NewGuid().ToString('N'))
$project = Join-Path $base "origen con espacio y 'apostrofe\presentacion"
$app = Join-Path $project 'presentacion-web\ntp330'
$destination = Join-Path $base "respaldos con espacio y 'apostrofe"
$tools = Join-Path $project 'tools'
$passed = 0

function Assert-Test([bool]$Condition, [string]$Message, [string]$Detail = '') {
    if (-not $Condition) { throw "FALLA: $Message $Detail" }
    $script:passed++
    Write-Output "OK $script:passed - $Message"
}

function New-FixtureFile([string]$Path, [string]$Text) {
    New-Item -ItemType Directory -Path (Split-Path $Path) -Force | Out-Null
    Write-Utf8 $Path $Text
}

function Invoke-Fixture([string]$Script, [string[]]$Arguments) {
    $ErrorActionPreference = 'Continue'
    $text = @(& (Join-Path $PSHOME 'powershell.exe') -NoProfile -NonInteractive -ExecutionPolicy Bypass -File $Script @Arguments 2>&1)
    $code = $LASTEXITCODE
    return @{ code = $code; text = $text -join "`n" }
}

function Assert-Rejected([string]$Package, [string]$Message) {
    $rejected = $false
    try { Test-ProjectPackage $Package | Out-Null } catch { $rejected = $true }
    Assert-Test $rejected $Message
}

try {
    New-Item -ItemType Directory -Path $tools -Force | Out-Null
    foreach ($script in @('respaldo.ps1', 'paquete-integridad.ps1', 'traspaso-empaquetar.ps1', 'recuperar.ps1')) {
        Copy-Item -LiteralPath (Join-Path $PSScriptRoot $script) -Destination $tools
    }
    $clone = Join-Path $base 'historial de prueba'
    $ErrorActionPreference = 'Continue'
    $gitOutput = @(& git clone --no-checkout --no-hardlinks -- (Split-Path $PSScriptRoot) $clone 2>&1)
    $gitCode = $LASTEXITCODE
    $ErrorActionPreference = 'Stop'
    if ($gitCode -ne 0) { throw "No se pudo clonar el historial para la prueba: $($gitOutput -join ' ')" }
    & robocopy.exe (Join-Path $clone '.git') (Join-Path $project '.git') /E /R:1 /W:1 /NJH /NJS /NFL /NDL /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { throw 'No se pudo preparar el historial de prueba.' }
    Remove-Item -LiteralPath $clone -Recurse -Force
    & git -C $project read-tree HEAD
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo preparar el indice de prueba.' }
    $originalHead = & git -C $project rev-parse HEAD
    New-FixtureFile (Join-Path $project 'presentacion-web\index.html') '<h1>Trabajo pendiente de guardar</h1>'
    New-FixtureFile (Join-Path $project '.gitignore') 'node_modules/'
    [IO.File]::SetAttributes((Join-Path $project '.gitignore'), [IO.FileAttributes]::Hidden)
    New-FixtureFile (Join-Path $tools 'inventario.json') '{"proyecto":"prueba"}'
    New-FixtureFile (Join-Path $tools 'verificar-inventario.js') 'console.log("INVENTARIO OK");'
    New-FixtureFile (Join-Path $tools 'map_check.js') 'console.log("MAP OK");'
    New-FixtureFile (Join-Path $tools 'focus_check.js') 'console.log("FALLO INTENCIONADO"); process.exit(1);'
    New-FixtureFile (Join-Path $app '0\index.html') '<h1>App integrada</h1>'
    New-FixtureFile (Join-Path $app '0\vendor\jspdf.umd.min.js') 'biblioteca local de prueba'
    New-FixtureFile (Join-Path $app '0\vendor\jspdf.plugin.autotable.min.js') 'biblioteca local de prueba'
    New-FixtureFile (Join-Path $app '0\pruebas\out\respaldos\propio.json') '{"datos":"prueba"}'
    New-FixtureFile (Join-Path $app '0\pruebas\out\omitido.txt') 'salida regenerable'
    foreach ($omit in @('tools\out\omitido.txt', 'tools\node_modules\omitido.js', '~$bloqueo.docx', '~WRL001.tmp')) {
        New-FixtureFile (Join-Path $project $omit) 'excluido'
    }
    $backup = Join-Path $tools 'respaldo.ps1'
    $restore = Join-Path $tools 'recuperar.ps1'
    $run = Invoke-Fixture $backup @('ahora', '-Destino', $destination, '-Conservar', '2')
    Assert-Test ($run.code -eq 0) 'Respaldo con pruebas en rojo y rutas con espacios/apostrofe.' $run.text
    $packages = @(Get-ChildItem -LiteralPath $destination -Filter '*.zip' -File)
    Assert-Test ($packages.Count -eq 1) 'Se crea una copia aunque falle focus_check.'
    $first = $packages[0].FullName
    $checked = Test-ProjectPackage $first
    Assert-Test ($checked.archivos -gt 10 -and (Test-Path -LiteralPath ($first + '.sha256'))) 'Manifiesto completo y SHA256 externo validos.'
    $extracted = Join-Path $base 'recuperacion nueva'
    $run = Invoke-Fixture $restore @('-Paquete', $first, '-Destino', $extracted)
    Assert-Test ($run.code -eq 0) 'Recuperacion comprobada en una carpeta nueva.' $run.text
    $restoredRepo = Join-Path $extracted 'presentacion'
    $restoredHead = & git -C $restoredRepo rev-parse HEAD
    Assert-Test ($LASTEXITCODE -eq 0 -and $restoredHead -eq $originalHead) 'Se recupera el historial real, incluido el directorio .git oculto de Windows.'
    & git -C $restoredRepo diff --cached --quiet
    Assert-Test ($LASTEXITCODE -eq 0) 'El indice recuperado corresponde a HEAD sin sustituir los archivos del ZIP.'
    Assert-Test ([IO.File]::ReadAllText((Join-Path $extracted 'presentacion\presentacion-web\index.html')) -eq '<h1>Trabajo pendiente de guardar</h1>') 'Se conserva el contenido pendiente de commit.'
    Assert-Test (Test-Path -LiteralPath (Join-Path $extracted 'presentacion\.gitignore')) 'Los archivos ocultos viajan en el ZIP.'
    Assert-Test ((Test-Path -LiteralPath (Join-Path $extracted 'datos-respaldo\propio.json')) -and
        -not (Test-Path -LiteralPath (Join-Path $extracted 'presentacion\tools\node_modules')) -and
        -not (Test-Path -LiteralPath (Join-Path $extracted 'presentacion\tools\out')) -and
        -not (Test-Path -LiteralPath (Join-Path $extracted 'presentacion\~$bloqueo.docx'))) 'Se incluyen JSON exportados y se excluyen dependencias, salidas y bloqueos.'
    Assert-Test ((Test-Path -LiteralPath (Join-Path $restoredRepo 'presentacion-web\ntp330\0\index.html')) -and
        -not (Test-Path -LiteralPath (Join-Path $extracted 'tesis'))) 'El paquete recuperado funciona con una sola carpeta de proyecto.'
    Assert-Test ((Test-Path -LiteralPath (Join-Path $restoredRepo 'presentacion-web\ntp330\0\pruebas\out\respaldos\propio.json')) -and
        -not (Test-Path -LiteralPath (Join-Path $restoredRepo 'presentacion-web\ntp330\0\pruebas\out\omitido.txt'))) 'La recuperacion conserva los JSON para el siguiente respaldo y excluye los informes regenerables.'
    $metadata = [IO.File]::ReadAllText((Join-Path $extracted 'ESTADO.json')) | ConvertFrom-Json
    Assert-Test ($metadata.verificaciones.'focus_check.js' -eq 'FALLA' -and @($metadata.avisos).Count -gt 0) 'Los fallos de verificacion quedan registrados dentro de la copia.'
    $run = Invoke-Fixture $restore @('-Paquete', $first, '-Destino', $extracted)
    Assert-Test ($run.code -ne 0) 'La recuperacion rechaza sobrescribir una carpeta existente.'

    $corrupt = Join-Path $base 'corrupto.zip'
    Copy-Item -LiteralPath $first -Destination $corrupt
    Copy-Item -LiteralPath ($first + '.sha256') -Destination ($corrupt + '.sha256')
    $stream = [IO.File]::Open($corrupt, 'Append')
    try { $stream.WriteByte(0) } finally { $stream.Dispose() }
    Assert-Rejected $corrupt 'Se detecta un ZIP alterado por su SHA256 externo.'
    $neverCreated = Join-Path $base 'no debe crearse'
    $run = Invoke-Fixture $restore @('-Paquete', $corrupt, '-Destino', $neverCreated)
    Assert-Test ($run.code -ne 0 -and -not (Test-Path -LiteralPath $neverCreated)) 'Un ZIP corrupto se rechaza antes de crear el destino.'

    $tampered = Join-Path $base 'alterado-interno.zip'
    Copy-Item -LiteralPath $first -Destination $tampered
    $archive = [IO.Compression.ZipFile]::Open($tampered, [IO.Compression.ZipArchiveMode]::Update)
    try {
        $entry = $archive.GetEntry('presentacion/presentacion-web/index.html')
        $entry.Delete()
        $writer = New-Object IO.StreamWriter ($archive.CreateEntry('presentacion/presentacion-web/index.html').Open())
        try { $writer.Write('Contenido alterado') } finally { $writer.Dispose() }
    } finally { $archive.Dispose() }
    Assert-Rejected $tampered 'El manifiesto detecta cambios internos incluso sin archivo .sha256.'
    $traversal = Join-Path $base 'ruta-insegura.zip'
    Copy-Item -LiteralPath $first -Destination $traversal
    $archive = [IO.Compression.ZipFile]::Open($traversal, [IO.Compression.ZipArchiveMode]::Update)
    try { $archive.CreateEntry('../fuera.txt') | Out-Null } finally { $archive.Dispose() }
    Assert-Rejected $traversal 'Se rechazan rutas que salgan de la carpeta de recuperacion.'

    $firstHash = (Get-FileHash -LiteralPath $first).Hash
    $run = Invoke-Fixture $backup @('ahora', '-Destino', $destination, '-Conservar', '2')
    $packages = @(Get-ChildItem -LiteralPath $destination -Filter '*.zip' -File)
    Assert-Test ($run.code -eq 0 -and $packages.Count -eq 2 -and (Get-FileHash -LiteralPath $first).Hash -eq $firstHash) 'Dos ejecuciones consecutivas crean copias distintas sin sobrescribir.'
    $lock = [IO.File]::Open((Join-Path $tools 'out\respaldo.lock'), 'OpenOrCreate', 'ReadWrite', 'None')
    try { $run = Invoke-Fixture $backup @('ahora', '-Destino', $destination, '-Conservar', '2') }
    finally { $lock.Dispose() }
    Assert-Test ($run.code -ne 0 -and @(Get-ChildItem -LiteralPath $destination -Filter '*.zip' -File).Count -eq 2) 'El bloqueo impide respaldos simultaneos sin borrar copias.'
    $run = Invoke-Fixture $backup @('ahora', '-Destino', $destination, '-Conservar', '2')
    Assert-Test ($run.code -eq 0 -and @(Get-ChildItem -LiteralPath $destination -Filter '*.zip' -File).Count -eq 2 -and
        -not (Test-Path -LiteralPath $first) -and -not (Test-Path -LiteralPath ($first + '.sha256'))) 'La rotacion elimina solo copias antiguas y su checksum tras un respaldo valido.'
    $before = @(Get-ChildItem -LiteralPath $destination -Filter '*.zip' -File | ForEach-Object { $_.Name }) -join '|'
    Remove-Item -LiteralPath (Join-Path $app '0\index.html')
    $run = Invoke-Fixture $backup @('ahora', '-Destino', $destination, '-Conservar', '2')
    $after = @(Get-ChildItem -LiteralPath $destination -Filter '*.zip' -File | ForEach-Object { $_.Name }) -join '|'
    Assert-Test ($run.code -ne 0 -and $before -eq $after) 'Un respaldo incompleto falla y conserva todas las copias anteriores.'
    $run = Invoke-Fixture $backup @('agendar', '25:99', '-Destino', $destination)
    Assert-Test ($run.code -ne 0) 'Una hora incorrecta devuelve error sin modificar la tarea programada.'
    Write-Output "PRUEBAS DE RESPALDO: $passed/$passed OK"
    Remove-Item -LiteralPath $base -Recurse -Force
}
catch {
    [Console]::Error.WriteLine($_.ToString() + "`nSalidas conservadas en: $base")
    exit 1
}
