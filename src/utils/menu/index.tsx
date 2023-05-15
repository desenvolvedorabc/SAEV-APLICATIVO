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
} from "react-icons/md";
import Aluno from "public/assets/images/alunosMenu.svg";
import Log from "public/assets/images/log.svg";

import { parseCookies } from "nookies";

const cookies = parseCookies();
const id = cookies["USU_ID"];

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
