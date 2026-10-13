Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Storage.StorageFile, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime]

$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and
    $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
  })[0]

function Await($op, $type) {
  $t = $asTask.MakeGenericMethod($type).Invoke($null, @($op))
  $t.Wait(-1) | Out-Null
  $t.Result
}

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage((New-Object Windows.Globalization.Language('es-MX')))
if (-not $engine) { Write-Error 'No OCR engine'; exit 1 }

$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$imgs = @('pt1.png', 'pt2.png', 'pt3.png', 'pt4.png', 'pt5.png')
foreach ($name in $imgs) {
  $path = Join-Path (Join-Path $dir '..') $name
  if (-not (Test-Path $path)) { $path = Join-Path $dir $name }
  $path = [System.IO.Path]::GetFullPath($path)
  $file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($path)) ([Windows.Storage.StorageFile])
  $stream = Await ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
  $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
  $bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
  $result = Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
  $out = Join-Path $dir ('ocr_' + [System.IO.Path]::GetFileNameWithoutExtension($name) + '.txt')
  $lines = @()
  foreach ($line in $result.Lines) { $lines += $line.Text }
  Set-Content -Path $out -Value ($lines -join "`n") -Encoding UTF8
  Write-Host ('OCR ' + $name + ' -> ' + $out + ' (' + $result.Lines.Count + ' lines)')
}
