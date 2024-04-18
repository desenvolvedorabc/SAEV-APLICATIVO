import {
  MdOutlineHome,
  MdChair,
  MdOutlineGroupAdd,
  MdOutlineFactCheck,
  MdOutlineCorporateFare,
  MdOutlineCalendarToday,
  MdTimeline,
  MdOutlineLibraryAddCheck,
  MdOutlineVerifiedUser,
  MdOutlineImportExport,
  MdOutlineSettings,
  MdOutlineSupervisorAccount,
  MdListAlt,
  MdCheckCircleOutline,
  MdOutlineCalculate,
  MdHorizontalRule,
  MdOutlineFiberManualRecord,
  MdOutlineFilterVintage,
  MdOutlineGroupWork,
  MdOutlineMessage,
  MdImportExport,
  MdOutlineSchool,
} from "react-icons/md";
import { BsBook } from "react-icons/bs";
import Aluno from "public/assets/images/alunosMenu.svg";
import Log from "public/assets/images/log.svg";
import AvaliacaoOnline from "public/assets/images/avaliação-on.svg";
import Download from "public/assets/images/download.svg";
import RelatorioExterno from "public/assets/images/carbon_report.svg";
import RelatorioInfrequencia from "public/assets/images/relatorio-infrequencia1.svg";
import RelatorioNaoAvaliados from "public/assets/images/nao-avaliado.svg";
import RelatorioCorRaca from "public/assets/images/cor-raca.svg";
import Alunos from "public/assets/images/alunosMenu.svg";
import Sintetic from "public/assets/images/sintetic.svg";

export const PERFISLINKS = [
  {
    grupo: "",
    items: [
      {
        name: "Home",
        path: "/",
        ARE_NOME: "HOME",
        validate: true,
        icon: <MdOutlineHome size={22} />,
      },
      {
        name: "Municípios",
        path: "/municipios",
        ARE_NOME: "MUN",
        icon: <MdOutlineCorporateFare size={22} />,
      },
      {
        name: "Escolas",
        path: "/municipio/null/escolas",
        ARE_NOME: "ESC",
        icon: <MdOutlineSchool size={22} />,
      },
      {
        name: "Alunos",
        path: `/municipio/${null}/escola/${null}/alunos`,
        ARE_NOME: "ALU",
        icon: <Alunos size={22} color={'#fff'} />,
      },
      {
        name: "Lançar Resultados",
        path: "/lancar-resultados",
        ARE_NOME: "LAN_RES",
        icon: <MdOutlineFactCheck size={22} />,
      },
      {
        name: "Infrequência",
        path: "/infrequencia",
        ARE_NOME: "INF",
        icon: <MdChair size={22} />,
      },
      {
        name: "Enturmar Alunos",
        path: "/enturmar-alunos",
        ARE_NOME: "ENT_ALU",
        icon: <MdOutlineGroupAdd size={22} />,
      },
      {
        name: "Transferência",
        path: "/transferencias",
        ARE_NOME: "TRF_ALU",
        icon: <MdOutlineImportExport size={22} />,
      },
      {
        name: "Turmas",
        ARE_NOME: "TUR",
        path: "/turmas",
        icon: <MdOutlineGroupWork size={22} />,
      },
    ],
  },
  {
    grupo: "RELATÓRIOS",
    ARE_NOME: "REL",
    items: [
      {
        name: "Síntese Geral",
        ARE_NOME: "SINT_GER",
        path: "/sintese-geral",
        icon: <MdOutlineCalculate size={22} />,
      },
      {
        name: "Descritores",
        ARE_NOME: "DESC",
        path: "/resultados-descritores",
        icon: <MdListAlt size={22} />,
      },
      {
        name: "Linha Evolutiva",
        ARE_NOME: "LIN_EVO",
        path: "/linha-evolutiva",
        icon: <MdTimeline size={22} />,
      },
      {
        name: "Evolução de Leitura",
        ARE_NOME: "EVO_LEI",
        path: "/evolucao-de-leitura",
        icon: <BsBook size={22} />,
      },
      {
        ARE_NOME: "NIV_DES",
        name: "Nível de Desempenho",
        path: "/nivel-desempenho",
        icon: <MdHorizontalRule size={22} />,
      },
      {
        name: "Lançamentos",
        ARE_NOME: "LANC",
        path: "/lancamentos",
        icon: <MdOutlineFactCheck size={22} />,
      },
      {
        name: "Enturmação",
        ARE_NOME: "ENTU",
        path: "/enturmacao",
        icon: <MdOutlineGroupAdd size={22} />,
      },
      {
        name: "Relatórios Externos",
        ARE_NOME: "REL_EXT",
        path: "/relatorios-externos",
        icon: <RelatorioExterno size={22} />,
      },
      {
        name: "Infrequência",
        ARE_NOME: "REL_IFR",
        path: "/relatorio-infrequencia",
        icon: <RelatorioInfrequencia size={22} />,
      },
      {
        name: "Não Avaliados",
        ARE_NOME: "REL_NAL",
        path: "/relatorio-nao-avaliados",
        icon: <RelatorioNaoAvaliados size={22} />,
      },
      {
        name: "Resultado: Cor/Raça",
        ARE_NOME: "REL_COR",
        path: "/relatorio-cor-raca",
        icon: <RelatorioCorRaca size={22} />,
      },
      {
        name: "Sintético de Testes",
        ARE_NOME: "SIN_TEST",
        path: "/relatorio-sintetico-de-testes",
        icon: <Sintetic size={22} />,
      },
    ],
  },
  {
    ARE_NOME: "AVA",
    grupo: "AVALIAÇÕES",
    items: [
      {
        name: "Edições",
        ARE_NOME: "EDI",
        path: "/edicoes",
        icon: <MdOutlineLibraryAddCheck size={22} />,
      },
      {
        name: "Testes",
        ARE_NOME: "TES",
        path: "/testes",
        icon: <MdCheckCircleOutline size={22} />,
      },
      {
        name: "Matriz de Referência",
        ARE_NOME: "MAT_REF",
        path: "/matrizes-de-referencia",
        icon: <MdListAlt size={22} />,
      },
      {
        name: "Avaliação Online",
        ARE_NOME: "AVA_ON",
        path: "/avaliacao-online",
        icon: <AvaliacaoOnline size={18} />,
      },
    ],
  },
  {
    ARE_NOME: "JOR_PED",
    grupo: "OUTROS CADASTROS",
    items: [
      {
        name: "Ano Letivo",
        ARE_NOME: "ANO_LET",
        path: "/anos",
        icon: <MdOutlineCalendarToday size={22} />,
      },
      {
        name: "Disciplinas",
        ARE_NOME: "DISC",
        path: "/disciplinas",
        icon: <MdOutlineFilterVintage size={22} />,
      },
      {
        name: "Séries",
        ARE_NOME: "SER",
        path: "/series",
        icon: <MdOutlineFiberManualRecord size={22} />,
      },
    ],
  },
  {
    grupo: "GESTÃO DE ACESSO",
    items: [
      {
        name: "Usuários",
        ARE_NOME: "USU",
        path: "/usuarios",
        icon: <MdOutlineSupervisorAccount size={22} />,
      },
      {
        name: "Perfis de Acesso",
        ARE_NOME: "PER_ACES",
        path: "/perfis-de-acesso",
        icon: <MdOutlineVerifiedUser size={22} />,
      },
    ],
  },
  {
    grupo: "OUTROS",
    items: [
      {
        name: "Mensagens",
        ARE_NOME: "MEN",
        path: `/mensagens`,
        icon: <MdOutlineMessage size={22} />,
      },
       {
        name: "Importar Dados",
        ARE_NOME: "IMP_EXP",
        path: `/importar-dados`,
        icon: <MdImportExport size={22} />,
      },
      {
       name: "Exportar Microdados",
       ARE_NOME: "EXP_DAD",
       path: `/exportar-dados`,
       icon: <Download size={22} />,
      },
      {
        name: "Logs do Sistema",
        ARE_NOME: "LOG_SIS",
        path: `/logs`,
        icon: <Log size={22} />,
      },
      {
        name: "Minha Conta",
        ARE_NOME: "MCO",
        path: `/minha-conta`,
        validate: true,
        icon: <MdOutlineSettings size={22} />,
      },
    ],
  },
];

export const ADMINLINKS = [
  {
    grupo: "",
    items: [
      {
        name: "Home",
        path: "/",
        ARE_NOME: "HOME",
        validate: true,
        icon: <MdOutlineHome size={22} />,
      },
      {
        name: "Municípios",
        path: "/municipios",
        ARE_NOME: "MUN",
        icon: <MdOutlineCorporateFare size={22} />,
      },
      {
        name: "Escolas",
        path: "",
        isNotMenu: true,
        ARE_NOME: "ESC",
        icon: <Aluno size={22} />,
      },
      {
        name: "Professores",
        path: "",
        isNotMenu: true,
        ARE_NOME: "PRO",
        icon: <Aluno size={22} />,
      },
      {
        name: "Alunos",
        path: "/alunos",
        isNotMenu: true,
        ARE_NOME: "ALU",
        icon: <Aluno size={22} />,
      },
      {
        name: "Lançar Resultados",
        path: "/lancar-resultados",
        ARE_NOME: "LAN_RES",
        icon: <MdOutlineFactCheck size={22} />,
      },
      {
        name: "Infrequência",
        path: "/infrequencia",
        ARE_NOME: "INF",
        icon: <MdChair size={22} />,
      },
      {
        name: "Enturmar Alunos",
        path: "/enturmar-alunos",
        ARE_NOME: "ENT_ALU",
        icon: <MdOutlineGroupAdd size={22} />,
      },
      {
        name: "Transferência",
        path: "/transferencias",
        ARE_NOME: "TRF_ALU",
        icon: <MdOutlineImportExport size={22} />,
      },
    ],
  },
  {
    grupo: "RELATÓRIOS",
    ARE_NOME: "REL",
    items: [
      {
        name: "Síntese Geral",
        ARE_NOME: "SINT_GER",
        path: "/sintese-geral",
        icon: <MdOutlineCalculate size={22} />,
      },
      {
        name: "Descritores",
        ARE_NOME: "DESC",
        path: "/resultados-descritores",
        icon: <MdListAlt size={22} />,
      },
      {
        name: "Linha Evolutiva",
        ARE_NOME: "LIN_EVO",
        path: "/linha-evolutiva",
        icon: <MdTimeline size={22} />,
      },
      {
        name: "Evolução de Leitura",
        ARE_NOME: "EVO_LEI",
        path: "/evolucao-de-leitura",
        icon: <BsBook size={22} />,
      },
      {
        ARE_NOME: "NIV_DES",
        name: "Nível de Desempenho",
        path: "/nivel-desempenho",
        icon: <MdHorizontalRule size={22} />,
      },
      {
        name: "Lançamentos",
        ARE_NOME: "LANC",
        path: "/lancamentos",
        icon: <MdOutlineFactCheck size={22} />,
      },
      {
        name: "Enturmação",
        ARE_NOME: "ENTU",
        path: "/enturmacao",
        icon: <MdOutlineGroupAdd size={22} />,
      },
      {
        name: "Relatórios Externos",
        ARE_NOME: "REL_EXT",
        path: "/relatorios-externos",
        icon: <RelatorioExterno size={22} />,
      },
      {
        name: "Infrequência",
        ARE_NOME: "REL_IFR",
        path: "/relatorio-infrequencia",
        icon: <RelatorioInfrequencia size={22} />,
      },
      {
        name: "Não Avaliados",
        ARE_NOME: "REL_NAL",
        path: "/relatorio-nao-avaliados",
        icon: <RelatorioNaoAvaliados size={22} />,
      },
      {
        name: "Resultado: Cor/Raça",
        ARE_NOME: "REL_COR",
        path: "/relatorio-cor-raca",
        icon: <RelatorioCorRaca size={22} />,
      },
      {
        name: "Sintético de Testes",
        ARE_NOME: "SIN_TEST",
        path: "/relatorio-sintetico-de-testes",
        icon: <Sintetic size={22} />,
      },
    ],
  },
  {
    ARE_NOME: "AVA",
    grupo: "AVALIAÇÕES",
    items: [
      {
        name: "Edições",
        ARE_NOME: "EDI",
        path: "/edicoes",
        icon: <MdOutlineLibraryAddCheck size={22} />,
      },
      {
        name: "Testes",
        ARE_NOME: "TES",
        path: "/testes",
        icon: <MdCheckCircleOutline size={22} />,
      },
      {
        name: "Matriz de Referência",
        ARE_NOME: "MAT_REF",
        path: "/matrizes-de-referencia",
        icon: <MdListAlt size={22} />,
      },
      {
        name: "Avaliação Online",
        ARE_NOME: "AVA_ON",
        path: "/avaliacao-online",
        icon: <AvaliacaoOnline size={18} />,
      },
    ],
  },
  {
    ARE_NOME: "JOR_PED",
    grupo: "OUTROS CADASTROS",
    items: [
      {
        name: "Ano Letivo",
        ARE_NOME: "ANO_LET",
        path: "/anos",
        icon: <MdOutlineCalendarToday size={22} />,
      },
      {
        name: "Disciplinas",
        ARE_NOME: "DISC",
        path: "/disciplinas",
        icon: <MdOutlineFilterVintage size={22} />,
      },
      {
        name: "Séries",
        ARE_NOME: "SER",
        path: "/series",
        icon: <MdOutlineFiberManualRecord size={22} />,
      },
    ],
  },
  {
    grupo: "GESTÃO DE ACESSO",
    items: [
      {
        name: "Usuários",
        ARE_NOME: "USU",
        path: "/usuarios",
        validate: true,
        icon: <MdOutlineSupervisorAccount size={22} />,
      },
      {
        name: "Perfis de Acesso",
        ARE_NOME: "PER_ACES",
        path: "/perfis-de-acesso",
        validate: true,
        icon: <MdOutlineVerifiedUser size={22} />,
      },
    ],
  },
  {
    grupo: "OUTROS",
    items: [
      {
        name: "Mensagens",
        ARE_NOME: "MEN",
        path: `/mensagens`,
        icon: <MdOutlineMessage size={22} />,
      },
       {
        name: "Importar Dados",
        ARE_NOME: "IMP_EXP",
        path: `/importar-dados`,
        icon: <MdImportExport size={22} />,
      },
      {
       name: "Exportar Microdados",
       ARE_NOME: "EXP_DAD",
       path: `/exportar-dados`,
       icon: <Download size={22} />,
      },
      {
        name: "Logs do Sistema",
        ARE_NOME: "LOG_SIS",
        path: `/logs`,
        icon: <Log size={22} />,
      },
      {
        name: "Minha Conta",
        ARE_NOME: "MCO",
        path: `/minha-conta`,
        validate: true,
        icon: <MdOutlineSettings size={22} />,
      },
    ],
  },
];
