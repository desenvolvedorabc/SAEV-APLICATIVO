## Conteúdo

* [Descrição do Projeto](#-descrição-do-projeto)
* [Funcionalidades](#-funcionalidades)
* [Como utilizar](#%EF%B8%8F-como-utilizar)
* [Configuração dos arquivos](#-configuração-dos-arquivos)
* [Bibliotecas, Frameworks e Dependências](#%EF%B8%8F-bibliotecas-frameworks-e-depend%C3%AAncias)


## 📖 Descrição do Projeto

O produto SAEV tem por principal fundamento de funcionamento um sistema de avaliação, como importância no auxílio da gestão educacional na rede de ensino municipal. O software gera uma informação sistematizada sobre o estágio de aprendizagem dos alunos, possibilitando a análise e compreensão pela equipe do município, subsidiando a formulação de uma política que adote o foco na aprendizagem e permita tomada de decisões estratégicas de acordo com a realidade de cada município. A avaliação como um dos principais fatores desenvolvidos no produto, permite identificar as iniquidades educacionais existentes nas redes, apontados os estágios para cada escola, turma e aluno. 


## 📱 Funcionalidades

Cadastro de municípios, escolas e alunos associados ao projeto SAEV.
Cadastro de Avaliações administradas pela associação, podendo ser definidos disciplinas, séries e turmas para cada avaliação tanto como os gabaritos e matrizes de referência do que está sendo avaliado.
Geração de relatórios com resultados e parâmetros que demonstram o desempenho, nível e participação dos alunos, podendo ver verificado por diferentes leveis, como por aluno, série, escola, etc.

## 🛠️ Como utilizar

Necessário ter instalado no computador:
- [NodeJs](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)


Clonar o projeto entrando no código fonte do repositório e clicando no botão code, utilizando a url disponível no terminal aberto na pasta onde se deseja salvar o projeto

![IMGCLONE](https://github.com/desenvolvedorabc/SAEV-APLICATIVO/blob/main/imgClone.png)

Após clonar, abrir o terminal e acessar a pasta onde está localizado o projeto e rodar o código
``` yarn install ``` para instalar as configurações e pacotes das dependências utilizadas.

Finalizada a instalação utilizar o comando ``` yarn dev ``` para rodar o projeto em ambiente de desenvolvimento ou ``` yarn build ``` depois ``` yarn start ``` para rodar como seria em ambiente de produção.

Também é necessário ter o backend rodando e conectado para conseguir utilizar esse programa, para isso clone o repositório disponível no link [https://github.com/desenvolvedorabc/SAEV-SERVIDOR](https://github.com/desenvolvedorabc/SAEV-SERVIDOR) e siga os passos do readme para inicializar, insira também o endereço em que rodará o backend no .env.development seguindo o padrão de variáveis disponível no .env.exemple


## 📁 Configuração dos arquivos

![IMGFILES](https://github.com/desenvolvedorabc/SAEV-APLICATIVO/blob/main/imgFiles.png)

Os arquivos são organizados em pastas:

- Pages: Onde estão os arquivos das páginas, onde no padrão next as urls são geradas utilizando o nome dos arquivos e hierarquia de pastas dentro da pages.
- Public: Contem as imagens utilizadas no template do sistema e arquivos estáticos disponíveis para download.
- Src: Possui os códigos com os components e funções, disponibilizado da seguinte forma:
  - Components: Contem os componentes usados nas páginas, organizados em pastas pela tela em que pertencem ou pela função do componente.
  - Context: Arquivo dos contextos disponibilizando variáveis que podem ser utilizadas em vários arquivos.
  - Lib: Configuração de bibliotecas.
  - Services: arquivos com funções para conexão e comunicação com a API.
  - Shared: estilizações de componentes utilizando styled components que são utilizados em diversos componentes.
  - Utils: Funções e informações de utilidade para uso geral.

![IMGSRC](https://github.com/desenvolvedorabc/SAEV-APLICATIVO/blob/main/imgSrc.png)

- Styles: arquivos de estilo global.
- Temp: pasta de arquivos temporários utilizados no upload.
- .env: arquivo onde fica a rota de conexão com a API.
- .env.development: arquivo com a rota de conexão com a API para o ambiente de desenvolvimento.
- O restante dos arquivos são de configurações do projeto.


## ⚙️ Bibliotecas, Frameworks e Dependências

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