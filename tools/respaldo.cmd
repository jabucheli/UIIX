@echo off
setlocal
powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "%~dp0respaldo.ps1" %*
exit /b %errorlevel%
