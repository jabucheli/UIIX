param(
    [Parameter(Position = 0)][ValidateSet('ahora', 'estado', 'agendar', 'quitar', 'verificar', 'paquete')][string]$Modo = 'ahora',
    [Parameter(Position = 1)][string]$Hora = '18:00',
    [string]$Destino = $env:RESPALDO_DIR,
    [ValidateRange(1, 365)][int]$Conservar = 14,
    [string]$NodeExe = 'node',
    [string]$GitExe = 'git'
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'paquete-integridad.ps1')
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$app = Join-Path $root 'presentacion-web\ntp330'
$taskName = 'Respaldo Presentacion Tesis'
if (-not $Destino) { $Destino = Join-Path (Split-Path $root) 'respaldos' }
if ($Modo -eq 'paquete') { $Destino = Join-Path $PSScriptRoot 'out\traspaso' }
$Destino = [IO.Path]::GetFullPath($Destino)

function Invoke-Git([string]$Repo, [string[]]$Arguments) {
    $ErrorActionPreference = 'Continue'
    $output = @(& $GitExe -C $Repo @Arguments 2>&1)
    if ($LASTEXITCODE -ne 0) { throw "Git: $($output -join ' ')" }
    return @($output | ForEach-Object { "$_" })
}

function Get-GitState([string]$Repo) {
    if (-not (Test-Path -LiteralPath (Join-Path $Repo '.git'))) { return @{ disponible = $false } }
    return [ordered]@{
        disponible = $true
        head = (Invoke-Git $Repo @('rev-parse', 'HEAD')) -join ''
        rama = (Invoke-Git $Repo @('rev-parse', '--abbrev-ref', 'HEAD')) -join ''
        cambios = @(Invoke-Git $Repo @('status', '--porcelain=v1', '--untracked-files=all'))
    }
}

function Invoke-Check([string]$Script, [string]$Report) {
    $ErrorActionPreference = 'Continue'
    try {
        $output = @(& $NodeExe (Join-Path $PSScriptRoot $Script) 2>&1)
        $code = $LASTEXITCODE
        Write-Utf8 $Report ($output -join "`r`n")
        if ($code -eq 0) { return 'OK' }
    }
    catch { Write-Utf8 $Report $_.ToString() }
    return 'FALLA'
}

function Copy-Project([string]$Source, [string]$Target, [string[]]$Generated, [string]$Report) {
    & robocopy.exe $Source $Target /E /XJ /XD .git node_modules $Generated /XF .git '~$*' '~WRL*' '*.tmp' '*.out' f /R:1 /W:1 /NJH /NJS /NFL /NDL /NP | Out-File -LiteralPath $Report -Encoding utf8
    if ($LASTEXITCODE -ge 8) { throw "Robocopy no pudo copiar $Source. Informe: $Report" }
    foreach ($file in Get-ChildItem -LiteralPath $Target -Recurse -File -Force) {
        $original = Join-Path $Source (Get-RelativeFile $Target $file.FullName)
        if ((Get-FileHash -LiteralPath $original -Algorithm SHA256).Hash -ne
            (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash) {
            throw "El archivo cambio durante la copia: $original. Repita el respaldo."
        }
    }
}

function Write-BackupLog([string]$Message) {
    Add-Content -LiteralPath (Join-Path $Destino 'respaldo.log') -Encoding utf8 -Value ((Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + ' | ' + $Message)
}

try {
    if ($Modo -eq 'agendar') {
        if ($Hora -notmatch '^([01][0-9]|2[0-3]):[0-5][0-9]$') { throw 'Hora no valida. Usar HH:mm, por ejemplo 18:00.' }
        $nodePath = (Get-Command $NodeExe -ErrorAction Stop).Source
        $gitPath = (Get-Command $GitExe -ErrorAction Stop).Source
        $arguments = '-NoProfile -NonInteractive -ExecutionPolicy Bypass -File "{0}" ahora -Destino "{1}" -NodeExe "{2}" -GitExe "{3}" -Conservar {4}' -f $PSCommandPath, $Destino, $nodePath, $gitPath, $Conservar
        $action = New-ScheduledTaskAction -Execute (Join-Path $PSHOME 'powershell.exe') -Argument $arguments -WorkingDirectory $PSScriptRoot
        $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Hours 1)
        $principal = New-ScheduledTaskPrincipal -UserId ([Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType Interactive -RunLevel Limited
        Register-ScheduledTask -TaskName $taskName -Action $action -Trigger (New-ScheduledTaskTrigger -Daily -At $Hora) -Settings $settings -Principal $principal -Description 'Copia verificada de presentacion con NTP 330 integrado; recupera horarios omitidos al volver a estar disponible.' -Force | Out-Null
        Write-Output "TAREA CREADA: $taskName, diaria a las $Hora. Destino: $Destino"
        exit 0
    }
    if ($Modo -eq 'quitar') {
        if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
            Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
        }
        Write-Output 'Tarea eliminada.'
        exit 0
    }
    if ($Modo -eq 'estado') {
        Write-Output "RESPALDOS: $Destino"
        foreach ($repo in @($root)) {
            Write-Output "`n$repo"
            $state = Get-GitState $repo
            if ($state.disponible) {
                Write-Output ("Rama: " + $state.rama + ' | HEAD: ' + $state.head + ' | cambios: ' + @($state.cambios).Count)
                $state.cambios | Write-Output
            } else { Write-Output 'Sin historial Git local.' }
        }
        $latest = Join-Path $Destino 'ultimo-respaldo.json'
        if (Test-Path -LiteralPath $latest) { [IO.File]::ReadAllText($latest) | Write-Output }
        $packages = @(Get-ChildItem -LiteralPath $Destino -Filter 'presentacion-tesis-*.zip' -File -ErrorAction SilentlyContinue | Sort-Object Name -Descending)
        $packages | Select-Object Name,Length,LastWriteTime | Format-Table -AutoSize
        if (-not $packages.Count) { Write-Output 'SIN RESPALDOS: ejecutar guardar.cmd.' }
        $log = Join-Path $Destino 'respaldo.log'
        if (Test-Path -LiteralPath $log) { Get-Content -LiteralPath $log -Tail 5 | Write-Output }
        $task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
        if ($task) {
            Get-ScheduledTaskInfo -TaskName $taskName | Select-Object LastRunTime,LastTaskResult,NextRunTime | Format-List
        } else { Write-Output 'SIN TAREA: ejecutar guardar.cmd agendar.' }
        Write-Output 'Datos NTP330: exportar el JSON desde Catalogo; el almacenamiento del navegador no se copia automaticamente.'
        exit 0
    }
    if ($Modo -eq 'verificar') {
        $last = Get-ChildItem -LiteralPath $Destino -Filter 'presentacion-tesis-*.zip' -File | Sort-Object Name -Descending | Select-Object -First 1
        if (-not $last) { throw 'No hay un ZIP para verificar.' }
        Test-ProjectPackage $last.FullName | Format-List
        Write-Output 'INTEGRIDAD OK'
        exit 0
    }

    foreach ($project in @($root)) {
        if ($Destino.Equals($project, [StringComparison]::OrdinalIgnoreCase) -or
            $Destino.StartsWith($project.TrimEnd('\') + '\', [StringComparison]::OrdinalIgnoreCase)) {
            if ($Modo -ne 'paquete') { throw 'El respaldo debe guardarse fuera del proyecto presentacion.' }
        }
    }
    if (-not (Test-Path -LiteralPath (Join-Path $app '0\index.html'))) { throw "Falta la app integrada: $app\0\index.html" }
    New-Item -ItemType Directory -Path $Destino -Force | Out-Null
    $work = Join-Path $PSScriptRoot 'out'
    New-Item -ItemType Directory -Path $work -Force | Out-Null
    try { $lock = [IO.File]::Open((Join-Path $work 'respaldo.lock'), 'OpenOrCreate', 'ReadWrite', 'None') }
    catch { throw 'Ya hay un respaldo en curso. Espere a que termine.' }
    $stamp = (Get-Date -Format 'yyyyMMdd-HHmmss-fff') + '-' + [guid]::NewGuid().ToString('N').Substring(0, 8)
    $run = Join-Path $work ('respaldo-' + $stamp)
    $tree = Join-Path $run 'tree'
    $reports = Join-Path $tree 'comprobaciones'
    New-Item -ItemType Directory -Path $reports -Force | Out-Null

    Write-Output '[1/4] Verificacion e historial del trabajo'
    $checks = [ordered]@{}
    foreach ($check in @('map_check.js', 'focus_check.js', 'verificar-inventario.js')) {
        $checks[$check] = Invoke-Check $check (Join-Path $reports ($check + '.txt'))
        Write-Output ("  $check : " + $checks[$check])
    }
    $warnings = @()
    if (@($checks.Values | Where-Object { $_ -ne 'OK' }).Count) {
        $warnings += 'Hay verificaciones en rojo; se guarda el trabajo igualmente.'
    }
    $git = [ordered]@{}
    foreach ($name in @('presentacion')) {
        $repo = $root
        $bundle = Join-Path $tree ("historial-$name.bundle")
        try {
            $git[$name] = Get-GitState $repo
            if ($git[$name].disponible) {
                Invoke-Git $repo @('bundle', 'create', $bundle, '--all', 'HEAD') | Out-Null
                Invoke-Git $repo @('bundle', 'verify', $bundle) | Out-Null
            } else { $warnings += "Sin historial Git en $name; se guardan sus archivos." }
        }
        catch {
            $warnings += "No se pudo guardar el historial de $name : $_"
            $git[$name] = @{ disponible = $false }
            if (Test-Path -LiteralPath $bundle) { Remove-Item -LiteralPath $bundle -Force }
        }
    }

    Write-Output '[2/4] Copia del proyecto integrado y JSON exportados'
    $generated = @((Join-Path $PSScriptRoot 'out'), (Join-Path $app '0\pruebas\out'))
    Copy-Project $root (Join-Path $tree 'presentacion') $generated (Join-Path $reports 'copia-presentacion.txt')
    $data = Join-Path $app '0\pruebas\out\respaldos'
    $jsons = @(Get-ChildItem -LiteralPath $data -Filter '*.json' -File -ErrorAction SilentlyContinue)
    if ($jsons.Count) {
        New-Item -ItemType Directory -Path (Join-Path $tree 'datos-respaldo') | Out-Null
        foreach ($json in $jsons) { Copy-Item -LiteralPath $json.FullName -Destination (Join-Path $tree 'datos-respaldo') }
    }
    $snapshot = [ordered]@{
        formato = 2; estructura = 'proyecto-integrado'; fechaUTC = [DateTime]::UtcNow.ToString('o'); equipo = $env:COMPUTERNAME
        origenPresentacion = $root; moduloNTP330 = 'presentacion-web/ntp330/0'; verificaciones = $checks; git = $git
        jsonExportados = @($jsons.Name); avisos = $warnings
        datosNavegador = 'Se incluyen los JSON exportados. Exportar desde Catalogo a presentacion-web/ntp330/0/pruebas/out/respaldos.'
    }
    Write-Utf8 (Join-Path $tree 'ESTADO.json') ($snapshot | ConvertTo-Json -Depth 8)
    $readme = @'
RESPALDO DEL PROYECTO PRESENTACION CON NTP 330 INTEGRADO

Todo el trabajo esta dentro de la carpeta presentacion.
La app del slide 7 esta en presentacion\presentacion-web\ntp330\0\index.html.
El ZIP incluye archivos guardados, cambios pendientes de commit e historial Git.
MANIFIESTO.json verifica SHA256 de cada archivo; el .zip.sha256 verifica el ZIP.

RECUPERAR EN UNA CARPETA NUEVA, SIN SOBRESCRIBIR EL TRABAJO:
1. Desde el proyecto actual:
   recuperar.cmd -Paquete "D:\ruta\presentacion-tesis-FECHA.zip" -Destino "D:\ejemplo\recuperacion-FECHA"
2. Si falta el proyecto actual, extraer este ZIP en una carpeta NUEVA y ejecutar:
   powershell -NoProfile -ExecutionPolicy Bypass -File presentacion\tools\recuperar.ps1 -CarpetaExtraida "."
3. Doble clic en presentacion\iniciar.cmd para verificar y continuar (Node.js 22+ y Chrome).

Las evaluaciones del navegador necesitan exportacion JSON desde Catalogo.
datos-respaldo contiene solo los JSON que ya se habian exportado; puede incluir ejemplos de pruebas.
Para los detalles: presentacion\RESPALDO.md, CONTINUIDAD.md y TRASPASO.md.
ESTADO.json registra comprobaciones, cambios Git y avisos en el momento de la copia.
'@
    Write-Utf8 (Join-Path $tree 'LEEME.txt') $readme

    Write-Output '[3/4] ZIP unico y comprobacion SHA256 de todos los archivos'
    & (Join-Path $PSScriptRoot 'traspaso-empaquetar.ps1') -Tree $tree -Out $Destino -Stamp $stamp
    $package = Join-Path $Destino ("presentacion-tesis-$stamp.zip")
    $checked = Test-ProjectPackage $package
    $summary = [ordered]@{
        fechaUTC = $snapshot.fechaUTC; paquete = $package; sha256 = $checked.sha256
        archivos = $checked.archivos; verificaciones = $checks; avisos = $warnings
    }
    $latest = Join-Path $Destino 'ultimo-respaldo.json'
    Write-Utf8 ($latest + '.partial') ($summary | ConvertTo-Json -Depth 6)
    Move-Item -LiteralPath ($latest + '.partial') -Destination $latest -Force
    Write-BackupLog ("OK | zip=" + [IO.Path]::GetFileName($package) + ' | archivos=' + $checked.archivos + ' | avisos=' + $warnings.Count)

    Write-Output '[4/4] Rotacion despues de verificar la nueva copia'
    if ($Modo -ne 'paquete') {
        $old = @(Get-ChildItem -LiteralPath $Destino -Filter 'presentacion-tesis-*.zip' -File | Where-Object {
            $_.Name -match '^presentacion-tesis-\d{8}-\d{4}(?:\d{2}-\d{3}-[0-9a-f]{8})?\.zip$'
        } | Sort-Object Name -Descending | Select-Object -Skip $Conservar)
        foreach ($file in $old) {
            Remove-Item -LiteralPath $file.FullName
            if (Test-Path -LiteralPath ($file.FullName + '.sha256')) { Remove-Item -LiteralPath ($file.FullName + '.sha256') }
        }
    }
    Remove-Item -LiteralPath $run -Recurse -Force
    $warnings | ForEach-Object { Write-Output "AVISO: $_" }
    Write-Output "RESPALDO COMPLETADO: $package"
    Write-Output 'INTEGRIDAD OK. Para continuar: iniciar.cmd. Para consultar: guardar.cmd estado.'
    exit 0
}
catch {
    $message = $_.ToString()
    if ($run) { $message += " | Copia de trabajo conservada en $run" }
    if (Test-Path -LiteralPath $Destino) {
        try { Write-BackupLog ('ERROR | ' + $message) } catch { }
    }
    [Console]::Error.WriteLine('ERROR: ' + $message)
    exit 1
}
finally { if ($lock) { $lock.Dispose() } }
