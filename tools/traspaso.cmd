@echo off
REM ============================================================
REM traspaso.cmd  -  Proceso de guardado y traspaso de la carpeta presentacion
REM ============================================================
REM Asegura que la carpeta contenga TODO lo necesario para retomar el
REM trabajo en este u otro computador y, en modo "paquete", genera un
REM .zip portable que se puede guardar y llevar donde sea.
REM
REM Uso:
REM   traspaso.cmd             inventario + estado git (verificacion)
REM   traspaso.cmd paquete     ademas genera tools\out\traspaso\presentacion-tesis-*.zip
REM   traspaso.cmd todo        paquete + verificacion completa (verify-all.cmd)
REM
REM El .zip incluye:
REM   presentacion\  las carpetas y archivos de la tesis (sin .git, sin
REM                  node_modules, sin tools\out, sin basura de Office)
REM   tesis\         la app hermana de evaluacion de riesgos (sin .git, sin
REM                  0\pruebas\out); NECESARIA: el slide 7 la embebe
REM   datos-respaldo\  respaldos JSON de evaluaciones si existen en
REM                    ..\..\tesis\0\pruebas\out\respaldos
REM   historial-*.bundle  copia del historial git (para restaurar commits)
REM   LEEME.txt  instrucciones de restauracion en el equipo nuevo
REM
REM Nota: flujo sin bloques parentizados; en cmd los bloques ( ... ) con
REM salto de linea solo-feed dan fallos de parseo.
REM ============================================================
setlocal
cd /d "%~dp0"

set ROOT=%~dp0..
set HERMANA=%~dp0..\..\tesis
set OUT=%CD%\out\traspaso
set TREE=%TEMP%\traspaso\tree
set MODO=inventario

:parse
if /I "%~1"=="paquete" set MODO=paquete
if /I "%~1"=="todo"    set MODO=todo
shift
if not "%~1"=="" goto parse

echo ============================================================
echo  [1/5] Inventario de archivos necesarios
echo ============================================================
node verificar-inventario.js
if errorlevel 1 goto :incompleto

if "%MODO%"=="todo" goto :verificar_todo
goto :traspa

:verificar_todo
echo.
echo ============================================================
echo  [2/5] Verificacion completa (verify-all.cmd)
echo ============================================================
call verify-all.cmd
if errorlevel 1 exit /b 1
goto :traspa

:traspa
if "%MODO%"=="inventario" goto :solo_inventario

echo.
echo ============================================================
echo  [3/5] Copiando el arbol a %TREE%\  (sin .git, node_modules, out, basura)
echo ============================================================
if exist "%TREE%" rmdir /s /q "%TREE%"
mkdir "%TREE%" >nul 2>&1

REM --- presentacion ---------------------------------------
robocopy "%ROOT%" "%TREE%\presentacion" /E /XD .git node_modules out /XF "~$*" *.tmp f /R:1 /W:1 /NJH /NJS /NFL /NDL /NP >nul
if errorlevel 8 goto :err_robo
echo   presentacion: ok (%ROOT%)

REM --- tesis (app hermana) --------------------------------
if not exist "%HERMANA%" goto :sin_hermana
robocopy "%HERMANA%" "%TREE%\tesis" /E /XD .git out node_modules /XF "~$*" *.tmp /R:1 /W:1 /NJH /NJS /NFL /NDL /NP >nul
if errorlevel 8 goto :err_robo
echo   tesis: ok (%HERMANA%)
goto :tras_resp

:sin_hermana
echo   AVISO: no existe la app hermana "%HERMANA%"
echo   El paquete NO llevara la app de evaluacion de riesgos.
goto :tras_resp

REM --- respaldos JSON de evaluaciones (si hay) ------------
:tras_resp
if not exist "%HERMANA%\0\pruebas\out\respaldos" goto :sin_respaldos
mkdir "%TREE%\datos-respaldo" >nul 2>&1
robocopy "%HERMANA%\0\pruebas\out\respaldos" "%TREE%\datos-respaldo" *.json /R:1 /W:1 /NJH /NJS /NFL /NDL /NP >nul
if errorlevel 8 goto :err_robo
echo   datos-respaldo: ok
goto :tras_hist

:sin_respaldos
echo   sin respaldos JSON de evaluaciones (no se copia datos-respaldo)
goto :tras_hist

REM --- historial git (bundle) -----------------------------
:tras_hist
if exist "%ROOT%\.git"    git -C "%ROOT%"    bundle create "%TREE%\historial-presentacion.bundle" --all >nul 2>&1 && echo   historial-presentacion.bundle: ok
if exist "%HERMANA%\.git" git -C "%HERMANA%" bundle create "%TREE%\historial-tesis.bundle" --all >nul 2>&1 && echo   historial-tesis.bundle: ok

REM --- LEEME.txt -------------------------------------------
>  "%TREE%\LEEME.txt" echo ==================================================
>> "%TREE%\LEEME.txt" echo PAQUETE DE TRASPASO - Tesis doctoral (presentacion + app)
>> "%TREE%\LEEME.txt" echo Generado: %DATE% %TIME%  por tools\traspaso.cmd paquete
>> "%TREE%\LEEME.txt" echo ==================================================
>> "%TREE%\LEEME.txt" echo.
>> "%TREE%\LEEME.txt" echo LAS DOS CARPETAS SON HERMANAS Y VAN JUNTAS:
>> "%TREE%\LEEME.txt" echo   presentacion\  presentacion web + fuentes + herramientas
>> "%TREE%\LEEME.txt" echo   tesis\         app de evaluacion de riesgos NTP 330 (0\)
>> "%TREE%\LEEME.txt" echo Se descomprimen las dos en la MISMA carpeta madre, por
>> "%TREE%\LEEME.txt" echo ejemplo D:\ejemplo\presentacion y D:\ejemplo\tesis.
>> "%TREE%\LEEME.txt" echo.
>> "%TREE%\LEEME.txt" echo PASOS EN EL EQUIPO NUEVO:
>> "%TREE%\LEEME.txt" echo   1. Instalar Node.js 22 o superior.
>> "%TREE%\LEEME.txt" echo   2. Descomprimir el zip manteniendo presentacion\ y tesis\.
>> "%TREE%\LEEME.txt" echo   3. cd presentacion\tools  y luego:  npm install
>> "%TREE%\LEEME.txt" echo   4. doble clic en presentacion\iniciar.cmd  (o  reanudar.cmd)
>> "%TREE%\LEEME.txt" echo      Si Chrome no esta en la ruta por defecto, editar CHROME
>> "%TREE%\LEEME.txt" echo      en tools\verify-all.cmd y tools\reanudar.cmd
>> "%TREE%\LEEME.txt" echo   5. La presentacion se abre en el navegador (presentacion-web\index.html).
>> "%TREE%\LEEME.txt" echo      La app de evaluacion se abre desde el bloque Riesgo del slide 7.
>> "%TREE%\LEEME.txt" echo   6. Historial git:
>> "%TREE%\LEEME.txt" echo        git clone historial-presentacion.bundle presentacion
>> "%TREE%\LEEME.txt" echo        git clone historial-tesis.bundle tesis
>> "%TREE%\LEEME.txt" echo      La app guarda los datos en localStorage: las evaluaciones
>> "%TREE%\LEEME.txt" echo      solo viajan con el JSON de datos-respaldo\.
>> "%TREE%\LEEME.txt" echo.
>> "%TREE%\LEEME.txt" echo DOCUMENTACION:
>> "%TREE%\LEEME.txt" echo   presentacion\CONTINUIDAD.md  - como retomar (este u otro equipo)
>> "%TREE%\LEEME.txt" echo   presentacion\TRASPASO.md     - este proceso en detalle
>> "%TREE%\LEEME.txt" echo   tesis\AGENTS.md     - reglas de la app
>> "%TREE%\LEEME.txt" echo   tesis\0\docs\ESTADO.md  - estado de la app

echo.
echo ============================================================
echo  [4/5] Empaquetando en tools\out\traspaso\
echo ============================================================
if not exist "%OUT%" mkdir "%OUT%"

for /f "usebackq delims=" %%d in (`powershell -NoProfile -Command "$d=Get-Date -Format 'yyyyMMdd-HHmm'; Write-Output $d"`) do set STAMP=%%d

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0traspaso-empaquetar.ps1" -Tree "%TREE%" -Out "%OUT%" -Stamp "%STAMP%"
if errorlevel 1 goto :err_zip

for /f "delims=" %%z in ('dir /b /o-d "%OUT%\presentacion-tesis-*.zip"') do set PAQ=%OUT%\%%z& goto :paq_listo
goto :err_zip

:paq_listo
for %%z in ("%PAQ%") do set PAQTAM=%%~zz

echo.
echo ============================================================
echo  [5/5] Resumen
echo ============================================================
echo   Paquete generado: %PAQ%
echo   Tamano:           %PAQTAM% bytes
echo   Guardarlo con el resto del trabajo o llevarlo a otro equipo.
echo.
echo   Para restaurar en el equipo nuevo, ver LEEME.txt dentro del zip
echo   y presentacion\TRASPASO.md.
echo.
echo TRASPASO COMPLETADO
exit /b 0

:solo_inventario
echo.
echo  [2/5] verificacion completa omitida - usa: traspaso.cmd todo
echo.
echo  OK - inventario completo. Para generar el paquete: traspaso.cmd paquete
exit /b 0

:incompleto
echo.
echo  FALTA algo requerido - no se construye paquete incompleto.
exit /b 1

:err_robo
echo.
echo ERROR: robocopy no pudo copiar el arbol completo.
exit /b 1

:err_zip
echo.
echo ERROR: no se pudo comprimir el paquete.
exit /b 1
