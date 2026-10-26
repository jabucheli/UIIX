@echo off
REM ============================================================
REM  INICIAR - Arranque rapido de la presentacion web de tesis
REM ============================================================
REM  Doble clic en este archivo para dejar lista la sesion:
REM    1. Comprueba Node.js, Chrome y dependencias (jsdom).
REM    2. Ejecuta la verificacion completa (tools\reanudar.cmd).
REM    3. Abre la presentacion en el navegador.
REM
REM  Uso desde consola (los argumentos se pasan a reanudar.cmd):
REM    iniciar.cmd            -> verificar + abrir
REM    iniciar.cmd shot       -> ademas genera las capturas PNG
REM    iniciar.cmd app        -> ademas verifica la app NTP 330 integrada
REM    iniciar.cmd shot app   -> todo
REM ============================================================
setlocal enabledelayedexpansion
cd /d "%~dp0"

set CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe

echo ============================================================
echo  PRESENTACION WEB - TESIS DOCTORAL
echo  Carpeta: %CD%
echo ============================================================
echo.

echo [1/4] Comprobando Node.js...
where node >nul 2>&1
if errorlevel 1 (
  echo   FALTA Node.js 22+.
  echo   Instalalo desde https://nodejs.org y vuelve a ejecutar iniciar.cmd.
  echo.
  pause
  exit /b 1
)
for /f "delims=" %%v in ('node --version') do echo   node %%v
node -e "if (Number(process.versions.node.split('.')[0]) < 22) process.exit(1)"
if errorlevel 1 (
  echo   Se requiere Node.js 22 o superior.
  pause
  exit /b 1
)
echo.

echo [2/4] Comprobando Chrome...
if exist "%CHROME%" (
  echo   Chrome OK
) else (
  echo   AVISO: Chrome no esta en "%CHROME%".
  echo          La verificacion funcionara pero no generara capturas.
  echo          Si esta en otra ruta, edita la linea set CHROME= de tools\verify-all.cmd.
)
echo.

echo [3/4] Comprobando dependencias de verificacion (jsdom)...
if not exist "tools\node_modules\jsdom" (
  echo   jsdom no instalado - ejecutando npm ci en tools...
  pushd tools
  call npm ci
  if errorlevel 1 (
    echo   npm ci fallo. Revise su conexion o Node.js.
    popd
    pause
    exit /b 1
  )
  popd
) else (
  echo   jsdom OK
)
echo.

echo [4/4] Verificacion completa de la presentacion...
call tools\reanudar.cmd %*
if errorlevel 1 (
  echo.
  echo LA VERIFICACION FALLO - revise lo anterior.
  echo.
  pause
  exit /b 1
)

echo.
echo ============================================================
echo  Abriendo la presentacion en el navegador...
echo ============================================================
start "" "%~dp0presentacion-web\index.html"

echo.
echo  Guia de continuidad : CONTINUIDAD.md
echo  Guardar al terminar : guardar.cmd  ^(respaldo del proyecto integrado^)
echo  Estado de las copias: guardar.cmd estado
echo  Recuperacion        : recuperar.cmd
echo  Cierre y traspaso   : TRASPASO.md  (tools\traspaso.cmd paquete)
echo  Capturas            : tools\out\
echo.
echo ARRANQUE COMPLETO
echo.
pause
exit /b 0
