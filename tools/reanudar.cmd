@echo off
REM ============================================================
REM Reanudar el trabajo en ESTE computador.
REM Comprueba el entorno, verifica la presentacion, muestra el
REM estado git del proyecto integrado y recuerda donde vive la doc.
REM
REM Uso:   reanudar.cmd          entorno + verificacion (sin capturas)
REM        reanudar.cmd shot     ademas genera los PNG en tools\out\
REM        reanudar.cmd app      entorno + verificacion + pruebas de la app (52/52)
REM        reanudar.cmd shot app  todo
REM ============================================================
setlocal enabledelayedexpansion
cd /d "%~dp0"

set SHOT=
set APP=
:parse
if /I "%~1"=="shot"  set SHOT=shot
if /I "%~1"=="app"   set APP=app
shift
if not "%~1"=="" goto parse

echo ============================================================
echo  [1/5] Entorno
echo ============================================================
where node >nul 2>&1
if errorlevel 1 (
  echo   FALTA Node.js 22+  - instalar desde https://nodejs.org
  exit /b 1
)
for /f "delims=" %%v in ('node --version') do echo   node %%v
node -e "if (Number(process.versions.node.split('.')[0]) < 22) process.exit(1)"
if errorlevel 1 (echo   Se requiere Node.js 22 o superior & exit /b 1)

if not exist "node_modules\jsdom" (
  echo   jsdom no instalado - ejecutando npm ci...
  call npm ci
  if errorlevel 1 (echo   npm ci fallo & exit /b 1)
) else (
  echo   jsdom OK
)

set CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe
if exist "%CHROME%" (
  echo   Chrome OK
) else (
  echo   AVISO: Chrome no esta en "%CHROME%" - verify-all omite capturas.
  echo          Si esta en otra ruta, editar set CHROME= en verify-all.cmd.
)

if not exist "..\presentacion-web\ntp330\0\index.html" (
  echo   FALTA la app integrada ..\presentacion-web\ntp330\0\index.html
  echo   Revisar el modulo NTP 330 de este mismo proyecto.
  exit /b 1
)
echo   app integrada OK: ..\presentacion-web\ntp330\0
node verificar-inventario.js > out-inventario.tmp 2>&1
if errorlevel 1 (
  type out-inventario.tmp
  del out-inventario.tmp
  exit /b 1
)
del out-inventario.tmp
echo   inventario completo OK

echo.
echo ============================================================
echo  [2/5] Verificacion de la presentacion
echo ============================================================
set VARGS=
if "%SHOT%"=="shot" set VARGS=shot
call verify-all.cmd %VARGS%
if errorlevel 1 exit /b 1

if "%APP%"=="app" (
  echo.
  echo ============================================================
  echo  [3/5] Verificacion completa de la app NTP 330 integrada
  echo ============================================================
  call node ..\presentacion-web\ntp330\0\pruebas\verificar.js
  if errorlevel 1 exit /b 1
  call node integration_check.js
  if errorlevel 1 exit /b 1
) else (
  echo.
  echo  [3/5] pruebas de la app omitidas - usa: reanudar.cmd app
)

echo.
echo ============================================================
echo  [4/5] Estado git (hay cambios sin confirmar?)
echo ============================================================
git -C .. status --short --branch 2>nul || echo   (presentacion no es un repo git)

echo.
echo ============================================================
echo  [5/5] Donde seguir
echo ============================================================
echo   Guia de continuidad .: ..\CONTINUIDAD.md
echo   Estado de la app .....: ..\presentacion-web\ntp330\0\docs\ESTADO.md
echo   Reglas de la app .....: ..\presentacion-web\ntp330\AGENTS.md
echo   Capturas .............: tools\out\  (slide07.png, slide07_ff1.png, ...)
echo.
echo   Verificar despues de cada cambio:
echo     verify-all.cmd shot          ^(presentacion^)
echo     node app_cdp.js out\x.png --tab=pruebas --run   ^(app^)
echo.
echo   Al dejar de trabajar (guardar sin perdidas):
echo     ..\guardar.cmd               ^(ZIP verificado de archivos e historial^)
echo     ..\guardar.cmd estado        ^(copias, avisos y proxima ejecucion^)
echo     ..\recuperar.cmd              ^(ayuda para recuperar en carpeta nueva^)
echo.
echo REANUDACION COMPLETA
exit /b 0
