$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Write-Utf8([string]$Path, [string]$Text) {
    [IO.File]::WriteAllText($Path, $Text, (New-Object Text.UTF8Encoding $false))
}

function Get-RelativeFile([string]$Root, [string]$Path) {
    $base = [IO.Path]::GetFullPath($Root).TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
    $full = [IO.Path]::GetFullPath($Path)
    if (-not $full.StartsWith($base, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Archivo fuera del arbol: $Path"
    }
    return $full.Substring($base.Length).Replace('\', '/')
}

function Assert-PackagePath([string]$Path) {
    if ([string]::IsNullOrWhiteSpace($Path) -or $Path.Contains('\') -or
        $Path.Contains(':') -or $Path.StartsWith('/') -or
        @($Path.TrimEnd('/') -split '/' | Where-Object { $_ -in @('', '.', '..') }).Count) {
        throw "Ruta no valida dentro del paquete: $Path"
    }
}

function Get-StreamHash([IO.Stream]$Stream) {
    $sha = [Security.Cryptography.SHA256]::Create()
    try { return [BitConverter]::ToString($sha.ComputeHash($Stream)).Replace('-', '').ToLowerInvariant() }
    finally { $sha.Dispose() }
}

function New-PackageManifest([string]$Tree) {
    $files = @(Get-ChildItem -LiteralPath $Tree -Recurse -File -Force | Where-Object {
        (Get-RelativeFile $Tree $_.FullName) -ne 'MANIFIESTO.json'
    } | Sort-Object FullName | ForEach-Object {
        [ordered]@{
            ruta = Get-RelativeFile $Tree $_.FullName
            bytes = $_.Length
            sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
        }
    })
    $manifest = [ordered]@{ formato = 1; creadoUTC = [DateTime]::UtcNow.ToString('o'); archivos = $files }
    Write-Utf8 (Join-Path $Tree 'MANIFIESTO.json') ($manifest | ConvertTo-Json -Depth 6)
}

function Test-ProjectPackage([string]$Path) {
    $Path = (Get-Item -LiteralPath $Path).FullName
    $hash = (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant()
    if (Test-Path -LiteralPath ($Path + '.sha256')) {
        $expected = [IO.File]::ReadAllText($Path + '.sha256').Trim().Split(' ')[0]
        if ($expected -notmatch '^[a-fA-F0-9]{64}$' -or $expected -ne $hash) {
            throw "SHA256 del ZIP no coincide: $Path"
        }
    }
    $zip = [IO.Compression.ZipFile]::OpenRead($Path)
    try {
        $entries = @{}
        foreach ($entry in $zip.Entries) {
            Assert-PackagePath $entry.FullName
            if ($entry.FullName.EndsWith('/')) { continue }
            if ($entries.ContainsKey($entry.FullName)) { throw "Entrada duplicada: $($entry.FullName)" }
            $entries[$entry.FullName] = $entry
        }
        if (-not $entries.ContainsKey('MANIFIESTO.json')) {
            throw 'El ZIP no tiene MANIFIESTO.json. Para copias antiguas, consultar RESPALDO.md.'
        }
        $reader = New-Object IO.StreamReader ($entries['MANIFIESTO.json'].Open())
        try { $manifest = $reader.ReadToEnd() | ConvertFrom-Json }
        finally { $reader.Dispose() }
        if ($manifest.formato -ne 1 -or -not @($manifest.archivos).Count) { throw 'Manifiesto no valido.' }
        $seen = @{}
        $bytes = [long]0
        foreach ($file in $manifest.archivos) {
            Assert-PackagePath $file.ruta
            if ($file.ruta -eq 'MANIFIESTO.json' -or $seen.ContainsKey($file.ruta)) {
                throw "Archivo duplicado en el manifiesto: $($file.ruta)"
            }
            $seen[$file.ruta] = $true
            if (-not $entries.ContainsKey($file.ruta)) { throw "Falta en el ZIP: $($file.ruta)" }
            $entry = $entries[$file.ruta]
            if ($entry.Length -ne $file.bytes) { throw "Tamano incorrecto: $($file.ruta)" }
            $stream = $entry.Open()
            try { $actual = Get-StreamHash $stream }
            finally { $stream.Dispose() }
            if ($file.sha256 -notmatch '^[a-fA-F0-9]{64}$' -or $actual -ne $file.sha256) {
                throw "Contenido alterado: $($file.ruta)"
            }
            $bytes += $entry.Length
        }
        if ($entries.Count -ne $seen.Count + 1) { throw 'Hay archivos sin registrar en el manifiesto.' }
        foreach ($required in @('presentacion/presentacion-web/index.html', 'presentacion/tools/inventario.json',
            'LEEME.txt', 'ESTADO.json')) {
            if (-not $seen.ContainsKey($required)) { throw "Falta un archivo esencial: $required" }
        }
        $integrated = $seen.ContainsKey('presentacion/presentacion-web/ntp330/0/index.html')
        if (-not $integrated -and -not $seen.ContainsKey('tesis/0/index.html')) {
            throw 'Falta la aplicacion NTP 330 en el paquete.'
        }
        if ($integrated) {
            foreach ($required in @('presentacion/presentacion-web/ntp330/0/vendor/jspdf.umd.min.js',
                'presentacion/presentacion-web/ntp330/0/vendor/jspdf.plugin.autotable.min.js')) {
                if (-not $seen.ContainsKey($required)) { throw "Falta un archivo esencial: $required" }
            }
        }
        return [pscustomobject]@{ paquete = $Path; sha256 = $hash; archivos = $seen.Count; bytes = $bytes; creadoUTC = $manifest.creadoUTC; integrado = $integrated }
    }
    finally { $zip.Dispose() }
}

function Test-ExtractedPackage([string]$Tree) {
    $manifest = [IO.File]::ReadAllText((Join-Path $Tree 'MANIFIESTO.json')) | ConvertFrom-Json
    foreach ($file in $manifest.archivos) {
        Assert-PackagePath $file.ruta
        $path = Join-Path $Tree $file.ruta
        if (-not (Test-Path -LiteralPath $path -PathType Leaf) -or
            (Get-Item -LiteralPath $path).Length -ne $file.bytes -or
            (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash -ne $file.sha256) {
            throw "La copia extraida no coincide: $($file.ruta)"
        }
    }
}
