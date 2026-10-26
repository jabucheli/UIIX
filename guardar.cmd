@echo off
setlocal
call "%~dp0tools\respaldo.cmd" %*
set "RESULTADO=%errorlevel%"
if "%~1"=="" pause
exit /b %RESULTADO%
