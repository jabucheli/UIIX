@echo off
REM ============================================================
REM respaldo.cmd  -  Proceso anti-perdida del proyecto
REM ============================================================
REM Presentacion web (..\presentacion) y la app hermana (..\..\tesis)
REM se respaldan JUNTAS, porque viajan juntas (el slide 7 embebe la app).
REM
REM Uso:
REM   respaldo.cmd               verificacion + git commit + zip + rotar (14)
REM   respaldo.cmd ahora         idem (alias legible)
REM   respaldo.cmd agendar       crea Tarea Programada diaria a las 18:00
REM   respaldo.cmd agendar 20:30 idem, a la hora indicada
REM   respaldo.cmd quitar        elimina la tarea programada
REM   respaldo.cmd estado        estado git + lista de respaldos
REM
REM Donde se guardan:
REM   %RESPALDO_DIR%   por defecto D:\ejemplo\respaldos   (FUERA de las
REM   dos carpetas del proyecto, para que un fallo en presentacion\ o en
REM   tesis\ no se lleve tambien los respaldos). Para mas seguridad,
REM   apunta RESPALDO_DIR a un disco externo o a una carpeta sincronizada.
REM   Rotacion: se conservan los ultimos %KEEP% zips; los demas se borran.
REM
REM Regla clave: NUNCA se salta un respaldo porque las verificaciones
REM fallen en rojo. Se avisa, se commitea lo que haya y se empaqueta
REM igualmente: guardar trabajo malo es mejor que perder trabajo bueno.
REM
REM El zip es del mismo formato que "traspaso.cmd paquete" (mismo ps1,
REM mismas exclusiones, historial git en .bundle y LEEME.txt), solo que
REM sale a una carpeta externa y rota.
REM ============================================================
setlocal
cd /d "%~dp0"

set ROOT=%~dp0..
set HERMANA=%~dp0..\..\tesis
set KEEP=14
set HORA=18:00
set MODO=ahora
set TREE=%TEMP%\respaldo\tree
if "%RESPALDO_DIR%"=="" set RESPALDO_DIR=D:\ejemplo\respaldos

if /I "%~1"=="ahora"   set MODO=ahora
if /I "%~1"=="agendar" set MODO=agendar
if /I "%~1"=="quitar"  set MODO=quitar
if /I "%~1"=="estado"  set MODO=estado
if not "%~2"=="" set HORA=%~2

if "%MODO%"=="agendar" goto :agendar
if "%MODO%"=="quitar"  goto :quitar
if "%MODO%"=="estado"  goto :estado

if not exist "%TEMP%" mkdir "%TEMP%" >nul 2>&1
if not exist "%RESPALDO_DIR%" mkdir "%RESPALDO_DIR%" >nul 2>&1
for /f "usebackq delims=" %%d in (`powershell -NoProfile -Command "Write-Output (Get-Date -Format 'yyyyMMdd-HHmm')"`) do set STAMP=%%d

echo ============================================================
echo  RESPALDO  presentacion + tesis     %DATE% %TIME%
echo ============================================================
echo  Destino: %RESPALDO_DIR%
echo  Rotacion: se conservan los ultimos %KEEP% paquetes

REM -------------------------------------------------------------
echo.
echo  [1/5] Verificacion rapida (map + foco)
echo -------------------------------------------------------------
set VMAP=OK
set VFOC=OK
node map_check.js   > "%TEMP%\respaldo-map.txt"   2>&1
if errorlevel 1 set VMAP=FALLA
node focus_check.js > "%TEMP%\respaldo-focus.txt" 2>&1
if errorlevel 1 set VFOC=FALLA
echo    map_check    : %VMAP%
echo    focus_check  : %VFOC%
if "%VMAP%%VFOC%"=="OKOK" goto :verif_fin
echo.
echo    AVISO: hay verificaciones en rojo.
echo    SE RESPALDA IGUALMENTE - no se pierde trabajo por un test en rojo.
:verif_fin

REM -------------------------------------------------------------
echo.
echo  [2/5] Git: commit automatico de los cambios
echo -------------------------------------------------------------
set VCP=OK
set VCT=OK
call :commit_repo "%ROOT%"    "BUCHELI GARCIA JORGE ALEXANDER" "JABUCHELI@puce.edu.ec" presentacion
if errorlevel 1 set VCP=FALLA
call :commit_repo "%HERMANA%" "Tesis NTP 330"                  "tesis@local"           tesis
if errorlevel 1 set VCT=FALLA

REM -------------------------------------------------------------
echo.
echo  [3/5] Copiando el arbol a %TREE%  (sin .git, node_modules, out, basura)
echo -------------------------------------------------------------
if exist "%TREE%" rmdir /s /q "%TREE%"
mkdir "%TREE%" >nul 2>&1

robocopy "%ROOT%" "%TREE%\presentacion" /E /XD .git node_modules out /XF "~$*" *.tmp f /R:1 /W:1 /NJH /NJS /NFL /NDL /NP >nul
if errorlevel 8 goto :err_robo
echo    presentacion: ok

if not exist "%HERMANA%" goto :sin_hermana
robocopy "%HERMANA%" "%TREE%\tesis" /E /XD .git out node_modules /XF "~$*" *.tmp /R:1 /W:1 /NJH /NJS /NFL /NDL /NP >nul
if errorlevel 8 goto :err_robo
echo    tesis: ok
goto :respaldos_json

:sin_hermana
echo    AVISO: no existe la app hermana "%HERMANA%"
echo    El paquete NO llevara la app de evaluacion de riesgos.

:respaldos_json
if not exist "%HERMANA%\0\pruebas\out\respaldos" goto :historial
mkdir "%TREE%\datos-respaldo" >nul 2>&1
robocopy "%HERMANA%\0\pruebas\out\respaldos" "%TREE%\datos-respaldo" *.json /R:1 /W:1 /NJH /NJS /NFL /NDL /NP >nul
echo    datos-respaldo: ok

:historial
if exist "%ROOT%\.git"    git -C "%ROOT%"    bundle create "%TREE%\historial-presentacion.bundle" --all >nul 2>&1 && echo    historial-presentacion.bundle: ok
if exist "%HERMANA%\.git" git -C "%HERMANA%" bundle create "%TREE%\historial-tesis.bundle" --all >nul 2>&1 && echo    historial-tesis.bundle: ok

>  "%TREE%\LEEME.txt" echo ==================================================
>> "%TREE%\LEEME.txt" echo PAQUETE DE RESPALDO - Tesis doctoral (presentacion + app)
>> "%TREE%\LEEME.txt" echo Generado: %DATE% %TIME%  por tools\respaldo.cmd
>> "%TREE%\LEEME.txt" echo ==================================================
>> "%TREE%\LEEME.txt" echo.
>> "%TREE%\LEEME.txt" echo LAS DOS CARPETAS SON HERMANAS Y VAN JUNTAS:
>> "%TREE%\LEEME.txt" echo   presentacion\  presentacion web + fuentes + herramientas
>> "%TREE%\LEEME.txt" echo   tesis\         app de evaluacion de riesgos NTP 330 (0\)
>> "%TREE%\LEEME.txt" echo Se descomprimen las dos en la MISMA carpeta madre.
>> "%TREE%\LEEME.txt" echo.
>> "%TREE%\LEEME.txt" echo PASOS EN ESTE U OTRO EQUIPO:
>> "%TREE%\LEEME.txt" echo   1. Instalar Node.js 22 o superior.
>> "%TREE%\LEEME.txt" echo   2. Descomprimir manteniendo presentacion\ y tesis\.
>> "%TREE%\LEEME.txt" echo   3. cd presentacion\tools  y luego:  npm install
>> "%TREE%\LEEME.txt" echo   4. doble clic en presentacion\iniciar.cmd  (o reanudar.cmd)
>> "%TREE%\LEEME.txt" echo   5. Historial git:
>> "%TREE%\LEEME.txt" echo        git clone historial-presentacion.bundle presentacion
>> "%TREE%\LEEME.txt" echo        git clone historial-tesis.bundle tesis
>> "%TREE%\LEEME.txt" echo.
>> "%TREE%\LEEME.txt" echo PROCEDIMIENTO COMPLETO DE RESTAURACION:
>> "%TREE%\LEEME.txt" echo   presentacion\TRASPASO.md  (y CONTINUIDAD.md para retomar)
>> "%TREE%\LEEME.txt" echo   El indice de verificacion es: cd presentacion\tools ^& verify-all.cmd
echo    LEEME.txt: ok

REM -------------------------------------------------------------
echo.
echo  [4/5] Empaquetando en %RESPALDO_DIR%
echo -------------------------------------------------------------
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0traspaso-empaquetar.ps1" -Tree "%TREE%" -Out "%RESPALDO_DIR%" -Stamp "%STAMP%"
if errorlevel 1 goto :err_zip
set PAQ=%RESPALDO_DIR%\presentacion-tesis-%STAMP%.zip
if not exist "%PAQ%" goto :err_zip
for %%z in ("%PAQ%") do set PAQTAM=%%~zz

REM -------------------------------------------------------------
echo.
echo  [5/5] Rotacion y resumen
echo -------------------------------------------------------------
powershell -NoProfile -Command "Get-ChildItem -Path '%RESPALDO_DIR%\presentacion-tesis-*.zip' -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -Skip %KEEP% | Remove-Item -Force -ErrorAction SilentlyContinue"
set NZIP=0
for /f "delims=" %%z in ('dir /b "%RESPALDO_DIR%\presentacion-tesis-*.zip" 2^>nul') do set /a NZIP+=1

echo    Paquete : %PAQ%
echo    Tamano  : %PAQTAM% bytes
echo    En disco: %NZIP% paquete(s)  (se conservan los %KEEP% mas recientes)
echo    Git     : presentacion=%VCP%  tesis=%VCT%
echo    Verif.  : map=%VMAP%  foco=%VFOC%

>> "%RESPALDO_DIR%\respaldo.log" echo %DATE% %TIME% ^| verif map=%VMAP% foco=%VFOC% ^| git presentacion=%VCP% tesis=%VCT% ^| zip presentacion-tesis-%STAMP%.zip %PAQTAM% b ^| en disco %NZIP%
echo    Log     : %RESPALDO_DIR%\respaldo.log

if exist "%TREE%" rmdir /s /q "%TREE%" >nul 2>&1

echo.
echo RESPALDO COMPLETADO
echo.
echo   Para que se ejecute solo cada dia:  respaldo.cmd agendar
echo   Para ver el estado:                 respaldo.cmd estado
exit /b 0

REM ============================================================
REM  Subrutina: commit en un repositorio si hay cambios
REM ============================================================
:commit_repo
set CR_PATH=%~1
set CR_NAME=%~2
set CR_MAIL=%~3
set CR_ETIQ=%~4
set CR_N=0
if not exist "%CR_PATH%\.git" goto :cr_sin_git
for /f "delims=" %%c in ('git -C "%CR_PATH%" status --porcelain 2^>nul') do set /a CR_N+=1
if "%CR_N%"=="0" goto :cr_sin_cambios
git -C "%CR_PATH%" add -A
git -C "%CR_PATH%" -c user.name="%CR_NAME%" -c user.email="%CR_MAIL%" commit -q -m "Respaldo automatico %STAMP% (%CR_N% archivo(s))"
if errorlevel 1 goto :cr_err
echo    %CR_ETIQ%: commit con %CR_N% archivo(s)
exit /b 0

:cr_sin_git
echo    %CR_ETIQ%: sin repositorio git (solo se copia al zip)
exit /b 0

:cr_sin_cambios
echo    %CR_ETIQ%: sin cambios pendientes
exit /b 0

:cr_err
echo    %CR_ETIQ%: ERROR al hacer commit (se copia igualmente al zip)
exit /b 1

REM ============================================================
REM  Tarea programada
REM ============================================================
:agendar
echo Creando tarea diaria a las %HORA% ...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Register-ScheduledTask -TaskName 'Respaldo Presentacion Tesis' -Action (New-ScheduledTaskAction -Execute '%~dp0respaldo.cmd' -Argument 'ahora') -Trigger (New-ScheduledTaskTrigger -Daily -At '%HORA%') -Description 'Respaldo diario de presentacion + tesis: verificacion, commit git y zip rotativo en %RESPALDO_DIR%' -Force | Out-Null; Write-Output '  tarea creada: Respaldo Presentacion Tesis  (cada dia a las %HORA%)'"
echo.
echo La tarea abre una ventana de consola durante unos segundos.
echo Para cambiar la hora:   respaldo.cmd agendar 20:30
echo Para eliminarla:        respaldo.cmd quitar
exit /b 0

:quitar
powershell -NoProfile -ExecutionPolicy Bypass -Command "Unregister-ScheduledTask -TaskName 'Respaldo Presentacion Tesis' -Confirm:$false -ErrorAction SilentlyContinue; Write-Output '  tarea eliminada (si existia)'"
exit /b 0

REM ============================================================
REM  Estado
REM ============================================================
:estado
echo ============================================================
echo  ESTADO
echo ============================================================
echo  Destino de respaldos: %RESPALDO_DIR%
echo.
echo  -- presentacion ------------------------------------------------
if not exist "%ROOT%\.git" goto :est_sin_p
set EST_N=0
for /f "delims=" %%c in ('git -C "%ROOT%" status --porcelain 2^>nul') do set /a EST_N+=1
echo    cambios sin commitear: %EST_N%
git -C "%ROOT%" log --oneline -3 2>nul
goto :est_tesis

:est_sin_p
echo    sin repositorio git

:est_tesis
echo.
echo  -- tesis -------------------------------------------------------
if not exist "%HERMANA%\.git" goto :est_sin_t
set EST_T=0
for /f "delims=" %%c in ('git -C "%HERMANA%" status --porcelain 2^>nul') do set /a EST_T+=1
echo    cambios sin commitear: %EST_T%
git -C "%HERMANA%" log --oneline -3 2>nul
goto :est_zips

:est_sin_t
echo    sin repositorio git

:est_zips
echo.
echo  -- respaldos (ultimo primero) ---------------------------------
if not exist "%RESPALDO_DIR%" goto :est_sin_zip
dir /b /o-d "%RESPALDO_DIR%\presentacion-tesis-*.zip" 2>nul
goto :est_log

:est_sin_zip
echo    todavia no hay ninguno - lanza: respaldo.cmd

:est_log
if not exist "%RESPALDO_DIR%\respaldo.log" goto :est_tarea
echo.
echo  -- ultimas ejecuciones ---------------------------------------
powershell -NoProfile -Command "Get-Content '%RESPALDO_DIR%\respaldo.log' -Tail 5"

:est_tarea
echo.
echo  -- tarea programada -------------------------------------------
powershell -NoProfile -Command "$t=Get-ScheduledTask -TaskName 'Respaldo Presentacion Tesis' -ErrorAction SilentlyContinue; if ($t) { Write-Output ('    activa, estado: ' + $t.State) } else { Write-Output '    NO creada - lanzar: respaldo.cmd agendar' }"
exit /b 0

REM ============================================================
REM  Errores
REM ============================================================
:err_robo
echo.
echo ERROR: robocopy no pudo copiar el arbol completo.
exit /b 1

:err_zip
echo.
echo ERROR: no se pudo comprimir el paquete.
echo        Revisa el mensaje de powershell de arriba.
exit /b 1
