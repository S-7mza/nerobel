@echo off
chcp 65001 >nul
title Nerobel Production FTP Publisher
setlocal

rem Locate Python executable
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set "PY_CMD=python"
    goto :RUN_PUBLISH
)

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set "PY_CMD=py"
    goto :RUN_PUBLISH
)

if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
    set "PY_CMD=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
    goto :RUN_PUBLISH
)

echo [ERREUR] Python n'a pas ete detecte sur ce systeme.
echo Veuillez installer Python ou l'ajouter a la variable d'environnement PATH.
pause
exit /b 1

:RUN_PUBLISH
"%PY_CMD%" "%~dp0scripts\publish_ftp.py" %*
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [INFO] Processus termine avec le code d'erreur %ERRORLEVEL%.
    echo.
)
pause
