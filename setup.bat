@echo off
REM Script de Setup e Inicializacao - SAEV Frontend
REM Execute este script para configurar e iniciar o frontend automaticamente

echo ==========================================
echo   SAEV Frontend - Setup e Inicializacao
echo ==========================================
echo.

REM Verificar Node.js
echo [INFO] Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado
    echo   Instale Node.js 22.x LTS: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%a in ('node -v') do set "NODE_MAJOR=%%a"
set "NODE_MAJOR=%NODE_MAJOR:~1%"
if %NODE_MAJOR% LSS 22 (
    echo [ERRO] Node.js %NODE_MAJOR%.x encontrado, mas e necessario Node.js 22 ou superior
    echo   Versao atual:
    node -v
    echo   Instale Node.js 22.x LTS: https://nodejs.org/
    pause
    exit /b 1
)
node -v
echo [OK] Node.js encontrado
echo.

REM Verificar Yarn
echo [INFO] Verificando Yarn...
where yarn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Yarn nao encontrado. Instalando...
    call npm install -g yarn
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Falha ao instalar Yarn
        pause
        exit /b 1
    )
)
call yarn --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Yarn nao esta disponivel
    pause
    exit /b 1
)
echo [OK] Yarn encontrado
echo.

echo ==========================================
echo    Instalando Dependencias
echo ==========================================
echo.

call yarn install
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar dependencias
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas
echo.

echo ==========================================
echo    Configurando Tipos TypeScript
echo ==========================================
echo.

echo [INFO] Removendo versoes incompativeis dos tipos...
call yarn remove @types/react @types/react-dom @types/node 2>nul

echo [INFO] Instalando tipos compativeis com React 17...
call yarn add --dev @types/react@17.0.38 @types/react-dom@17.0.11 @types/node@18.11.18
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Falha ao instalar tipos, mas continuando...
) else (
    echo [OK] Tipos do TypeScript instalados
)

REM Limpar cache do Next.js para evitar problemas
echo [INFO] Limpando cache do Next.js...
if exist .next rmdir /s /q .next
echo [OK] Cache limpo
echo.

echo ==========================================
echo    Configurando Ambiente
echo ==========================================
echo.

if exist .env.development (
    echo [OK] Arquivo .env.development ja existe
) else (
    if exist .env.example (
        echo [INFO] Criando arquivo .env.development...
        copy .env.example .env.development >nul
        echo [OK] Arquivo .env.development criado
    ) else (
        echo [ERRO] Arquivo .env.example nao encontrado
        pause
        exit /b 1
    )
)
echo.

echo ==========================================
echo    Iniciando Frontend
echo ==========================================
echo.
echo [INFO] O frontend sera iniciado em modo desenvolvimento...
echo [INFO] Acesse em: http://localhost:3000
echo.
echo [IMPORTANTE] Certifique-se de que o backend esta rodando!
echo   Backend deve estar em: http://localhost:3003
echo.

REM Iniciar o servidor
call yarn dev
