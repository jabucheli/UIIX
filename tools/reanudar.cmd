@echo off
REM ============================================================
REM Reanudar el trabajo en ESTE computador.
REM Comprueba el entorno, verifica la presentacion, muestra el
REM estado git de los dos repos y recuerda donde vive la doc.
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

if not exist "node_modules\jsdom" (
  echo   jsdom no instalado - ejecutando npm install...
  call npm install
  if errorlevel 1 (echo   npm install fallo & exit /b 1)
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

if not exist "..\..\tesis\0\index.html" (
  echo   FALTA la app hermana ..\..\tesis\0\index.html
  echo   La presentacion la embebe desde el bloque Riesgo del slide 7.
  echo   Deben existir como carpetas hermanas:  D:\ejemplo\presentacion  y  D:\ejemplo\tesis
  exit /b 1
)
echo   app hermana OK: ..\..\tesis\0

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
  echo  [3/5] Pruebas de la app de tesis - pestana Pruebas
  echo ============================================================
  call node app_cdp.js out\reanudar_pruebas.png --tab=pruebas --run
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
echo   --------------------------------
git -C ..\..\tesis status --short --branch 2>nul || echo   (tesis no es un repo git)

echo.
echo ============================================================
echo  [5/5] Donde seguir
echo ============================================================
echo   Guia de continuidad .: ..\CONTINUIDAD.md
echo   Estado de la app .....: ..\..\tesis\0\docs\ESTADO.md
echo   Reglas de la app .....: ..\..\tesis\AGENTS.md
echo   Capturas .............: tools\out\  (slide07.png, slide07_ff1.png, ...)
echo.
echo   Verificar despues de cada cambio:
echo     verify-all.cmd shot          ^(presentacion^)
echo     node app_cdp.js out\x.png --tab=pruebas --run   ^(app^)
echo.
echo   Al dejar de trabajar (guardar sin perdidas):
echo     respaldo.cmd                 ^(commit git + zip en D:\ejemplo\respaldos^)
echo     respaldo.cmd estado          ^(que queda sin commitear y donde van^)
echo.
echo REANUDACION COMPLETA
exit /b 0
