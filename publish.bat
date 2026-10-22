@echo off
chcp 65001 >nul
title Nerobel Production FTP Publisher
python "%~dp0scripts\publish_ftp.py" %*
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERREUR] Le deploiement a echoue. Verifiez les messages ci-dessus.
    echo.
)
pause
