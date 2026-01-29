# SAEV Frontend (Aplicativo)

Frontend do Sistema de Avaliação Educar pra Valer, desenvolvido com Next.js e React.

## Conteúdo

* [Início Rápido](#-início-rápido)
* [Descrição do Projeto](#-descrição-do-projeto)
* [Funcionalidades](#-funcionalidades)
* [Como utilizar](#%EF%B8%8F-como-utilizar)
* [Configuração dos arquivos](#-configuração-dos-arquivos)
* [Bibliotecas, Frameworks e Dependências](#%EF%B8%8F-bibliotecas-frameworks-e-dependências)

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js 22 ou superior** (OBRIGATÓRIO)
- Yarn
- **Backend rodando** (SAEV-SERVIDOR em http://localhost:3003)

### Instalação e Execução Automática

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

O script irá:
1. Verificar pré-requisitos (Node >= 22)
2. Instalar dependências
3. Instalar tipos TypeScript compatíveis
4. Criar arquivo `.env.development`
5. **Iniciar o frontend automaticamente** em modo desenvolvimento

⚠️ **IMPORTANTE**: O backend deve estar rodando antes de iniciar o frontend!

### Instalação Manual

Se preferir fazer manualmente:

#### 1. Instalar Dependências
```bash
yarn install
```

#### 2. Configurar Ambiente
```bash
cp .env.example .env.development
```

Edite o `.env.development` se necessário (valores padrão já funcionam).

#### 3. Iniciar Aplicação
```bash
yarn dev
```

### Acessar

- **Frontend**: http://localhost:3000
- **Login**:
  - Email: `admin@saev.com`
  - Senha: `admin123`

## 📖 Descrição do Projeto

O produto SAEV tem por principal fundamento de funcionamento um sistema de avaliação, como importância no auxílio da gestão educacional na rede de ensino municipal. O software gera uma informação sistematizada sobre o estágio de aprendizagem dos alunos, possibilitando a análise e compreensão pela equipe do município, subsidiando a formulação de uma política que adote o foco na aprendizagem e permita tomada de decisões estratégicas de acordo com a realidade de cada município. A avaliação como um dos principais fatores desenvolvidos no produto, permite identificar as iniquidades educacionais existentes nas redes, apontados os estágios para cada escola, turma e aluno.

## 📱 Funcionalidades

Cadastro de municípios, escolas e alunos associados ao projeto SAEV.
Cadastro de Avaliações administradas pela associação, podendo ser definidos disciplinas, séries e turmas para cada avaliação tanto como os gabaritos e matrizes de referência do que está sendo avaliado.
Geração de relatórios com resultados e parâmetros que demonstram o desempenho, nível e participação dos alunos, podendo ver verificado por diferentes leveis, como por aluno, série, escola, etc.

## 🛠️ Como utilizar

### Requisitos

Necessário ter instalado no computador:
- **[Node.js 22+](https://nodejs.org/en/)** (OBRIGATÓRIO - versões 16, 18, 20 ou 21 NÃO funcionam)
- [Yarn](https://yarnpkg.com/)

### Instalação Rápida (Recomendado)

Execute o script de setup automático:

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

O script faz tudo automaticamente e já inicia o projeto!

### Instalação Manual

Clonar o projeto entrando no código fonte do repositório e clicando no botão code, utilizando a url disponível no terminal aberto na pasta onde se deseja salvar o projeto

![IMGCLONE](https://github.com/desenvolvedorabc/SAEV-APLICATIVO/blob/main/imgClone.png)

Após clonar, abrir o terminal e acessar a pasta onde está localizado o projeto e rodar o código
``` yarn install ``` para instalar as configurações e pacotes das dependências utilizadas.

Finalizada a instalação utilizar o comando ``` yarn dev ``` para rodar o projeto em ambiente de desenvolvimento ou ``` yarn build ``` depois ``` yarn start ``` para rodar como seria em ambiente de produção.

Também é necessário ter o backend rodando e conectado para conseguir utilizar esse programa, para isso clone o repositório disponível no link [https://github.com/desenvolvedorabc/SAEV-SERVIDOR](https://github.com/desenvolvedorabc/SAEV-SERVIDOR) e siga os passos do readme para inicializar, insira também o endereço em que rodará o backend no .env.development seguindo o padrão de variáveis disponível no .env.exemple

## 📁 Configuração dos arquivos

![IMGFILES](https://github.com/desenvolvedorabc/SAEV-APLICATIVO/blob/main/imgFiles.png)

Os arquivos são organizados em pastas:

- **Pages**: Onde estão os arquivos das páginas, onde no padrão next as urls são geradas utilizando o nome dos arquivos e hierarquia de pastas dentro da pages.
- **Public**: Contem as imagens utilizadas no template do sistema e arquivos estáticos disponíveis para download.
- **Src**: Possui os códigos com os components e funções, disponibilizado da seguinte forma:
  - **Components**: Contem os componentes usados nas páginas, organizados em pastas pela tela em que pertencem ou pela função do componente.
  - **Context**: Arquivo dos contextos disponibilizando variáveis que podem ser utilizadas em vários arquivos.
  - **Lib**: Configuração de bibliotecas.
  - **Services**: arquivos com funções para conexão e comunicação com a API.
  - **Shared**: estilizações de componentes utilizando styled components que são utilizados em diversos componentes.
  - **Utils**: Funções e informações de utilidade para uso geral.

![IMGSRC](https://github.com/desenvolvedorabc/SAEV-APLICATIVO/blob/main/imgSrc.png)

- **Styles**: arquivos de estilo global.
- **Temp**: pasta de arquivos temporários utilizados no upload.
- **.env**: arquivo onde fica a rota de conexão com a API.
- **.env.development**: arquivo com a rota de conexão com a API para o ambiente de desenvolvimento.
- O restante dos arquivos são de configurações do projeto.

## ⚙️ Configuração (.env.development)

```env
NODE_ENV=development

# URL da API backend (sem o /v1, é adicionado automaticamente)
NEXT_PUBLIC_API_URL=http://localhost:3003

# URL de importação (geralmente a mesma)
NEXT_PUBLIC_API_URL_IMPORT=http://localhost:3003

# URL do domínio frontend
NEXT_PUBLIC_DOMAIN_URL=http://localhost:3000

# Itens por página
NEXT_PUBLIC_LIMIT_PAGE=10
```

⚠️ **Nota**: O prefixo `/v1` é adicionado automaticamente pelo service de API.

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
yarn dev           # Modo desenvolvimento
yarn build         # Build para produção
yarn start         # Rodar build de produção
yarn lint          # Executar linter
```

### Outras Portas
```bash
yarn dev -p 3001   # Rodar na porta 3001
```

## 🐛 Troubleshooting

### Erro: "Node engine incompatible"
Você precisa de Node.js 22 ou superior. Atualize em https://nodejs.org/

### Erro: "Port 3000 already in use"
```bash
# Opção 1: Usar outra porta
yarn dev -p 3001

# Opção 2: Matar processo
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Erro: "Failed to fetch" ou "Network Error"
Certifique-se que o backend está rodando:
```bash
# Verificar se backend responde
curl http://localhost:3003/api
# Deve retornar a página do Swagger
```

### Menu vazio após login
O backend não tem as áreas configuradas. Execute:
```bash
cd ../SAEV-SERVIDOR
docker exec -i db mysql -uroot -papp abc_saev < sql/3-insertArea.sql
docker exec -i db mysql -uroot -papp abc_saev < sql/10-insertSubPerfilArea.sql
```

### Erro 404 nas chamadas da API
Verifique se:
1. Backend está rodando (http://localhost:3003)
2. Variável `NEXT_PUBLIC_API_URL` está correta
3. Backend está com prefixo `/v1` configurado

## 🔐 Credenciais Padrão

- **Email**: admin@saev.com
- **Senha**: admin123
- **Perfil**: SAEV Admin (acesso total)

## 🛠️ Bibliotecas, Frameworks e Dependências

- React.JS
- Next.JS
- Typescript
- Material-UI
- Material-UI Color
- SVGR
- React Query
- Axios
- Date-fns
- Date-fns-tz
- File-saver
- Bootstrap
- React-bootstrap
- Firebase-admin
- Firebase-functions
- Formidable
- Formik
- Highcharts
- Jszip
- Jwt-decode
- Nookies
- Polished
- React-csv
- React-dom
- React-dropzone
- React-icons
- React-idle-timer
- React-loading
- React-quill
- React-to-print
- React-Toastify
- Styled-components
- Webpack
- xlxs
- Yup
- Eslint

## 📖 Documentação Adicional

- [README Principal](../README.md)
- [Guia Rápido](../QUICKSTART.md)
- [README Backend](../SAEV-SERVIDOR/README.md)

---

**Versão Node.js necessária:** >= 22.x
**Porta padrão:** 3000
**Backend:** Deve estar em http://localhost:3003
