@echo off
setlocal
pushd "%~dp0"
node verificar-inventario.js
if errorlevel 1 goto :error
if "%~1"=="" goto :inventario
if /I "%~1"=="todo" goto :todo
if /I "%~1"=="paquete" goto :paquete
echo Uso: traspaso.cmd [paquete ^| todo]
goto :error

:todo
call reanudar.cmd app
if errorlevel 1 goto :error

:paquete
call respaldo.cmd paquete
if errorlevel 1 goto :error
popd
exit /b 0

:inventario
echo INVENTARIO COMPLETO. Para empaquetar: traspaso.cmd paquete
popd
exit /b 0

:error
popd
exit /b 1
