@echo off
setlocal
powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "%~dp0tools\recuperar.ps1" %*
set "RESULTADO=%errorlevel%"
if "%~1"=="" pause
exit /b %RESULTADO%
