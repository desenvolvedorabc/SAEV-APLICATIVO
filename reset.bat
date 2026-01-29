@echo off
REM Script de Reset - SAEV Frontend

echo ==========================================
echo    SAEV Frontend - Reset
echo ==========================================
echo.
echo [AVISO] Este script ira:
echo   - Remover node_modules
echo   - Remover arquivo .env.development
echo   - Remover yarn.lock
echo   - Remover .next
echo.
echo Deseja continuar? (S/N)
set /p CONFIRM=

if /i not "%CONFIRM%"=="S" (
    echo Cancelado.
    pause
    exit /b 0
)

echo.
echo [INFO] Removendo dependencias...
if exist node_modules rmdir /s /q node_modules
if exist yarn.lock del yarn.lock
if exist .env.development del .env.development
if exist .next rmdir /s /q .next
echo [OK] Limpeza concluida

echo.
echo [OK] Reset concluido!
echo.
echo Para reinstalar: setup.bat
echo.
pause
