/* eslint-disable react/jsx-key */
import { CardsGroup } from "./styledComponents";
import CardRelatorio from "../../cardRelatorio";
import {
  MdOutlineGroup,
  MdOutlineSchool,
  MdTimeline,
  MdListAlt,
  MdOutlineFactCheck,
  MdOutlineCalculate,
} from "react-icons/md";
import Alunos from "public/assets/images/alunos.svg";
import Teacher from "public/assets/images/teacher.svg";
import Chair from "public/assets/images/chair.svg";
import AlunosDesempenho from "public/assets/images/alunos-desempenho.svg";
import { useMemo } from "react";
import { useAuth } from "src/context/AuthContext";
import { useGetSubPerfil } from "src/services/sub-perfis.service";

interface MunicipioData {
  MUN_ID: string;
  MUN_NOME: string;
  MUN_ESCOLAS: number;
  MUN_ALUNOS: number;
  MUN_ENTURMACAO: number;
  MUN_INFREQUENCIA: number;
  MUN_LINHA_EVOL: number;
  MUN_SINTESE: number;
  MUN_DESEMPENHO: number;
  MUN_LANCAMENTOS: number;
  MUN_AVALIACOES: number;
  MUN_PROFESSORES: number;
  MUN_USUARIOS: number;
  MUN_UF: string;
  MUN_LAT: number;
  MUN_LONG: number;
  MUN_STATUS: string;
}

type Area = {
  ARE_NOME: string;
  ARE_DESCRICAO: string;
  ARE_ID: string;
};

export default function Relatorios({ municipio }) {
  const { user } = useAuth();
  const { data: subPerfil  }= useGetSubPerfil(user?.USU_SPE?.SPE_ID, !!user?.USU_SPE?.SPE_ID)

  const areas = subPerfil?.AREAS ?? []

  const formattedCards = useMemo(() => {
    let cards = [
      <CardRelatorio
        icon={<MdOutlineCalculate color={"#3E8277"} size={40} />}
        link={"/sintese-geral"}
        title="Resultados"
        ARE_NOME={["SINT_GER", "REL"]}
        subTitle="Síntese Geral"
      />,
      <CardRelatorio
        icon={<MdListAlt color={"#3E8277"} size={40} />}
        link={"/resultados-descritores"}
        ARE_NOME={["DESC", "REL"]}
        title="Resultados"
        subTitle="Por Descritores"
      />,
      <CardRelatorio
        icon={<MdOutlineFactCheck color={"#3E8277"} size={40} />}
        link={"/lancamentos"}
        ARE_NOME={["LANC", "REL"]}
        title={"Lançamentos"}
        subTitle="Por Escola"
      />,
      <CardRelatorio
        icon={<MdOutlineFactCheck color={"#3E8277"} size={40} />}
        ARE_NOME={["ENTU", "REL"]}
        link={"/enturmacao"}
        title={"Enturmação"}
        subTitle="Por Escola"
      />,
      <CardRelatorio
        icon={<MdTimeline color={"#3E8277"} size={40} />}
        link={"/linha-evolutiva"}
        ARE_NOME={["LIN_EVO", "REL"]}
        title={"Linha Evolutiva"}
        subTitle="Turmas, Séries e Edição"
      />,
      <CardRelatorio
        icon={<Chair color={"#3E8277"} size={40} />}
        link={"/infrequencia"}
        ARE_NOME={["INF"]}
        title={"Infrequência"}
        subTitle="Por Escola"
      />,
      <CardRelatorio
        icon={<AlunosDesempenho color={"#3E8277"} size={40} />}
        link={`/transferencias`}
        ARE_NOME={["TRF_ALU"]}
        title={"Transferências"}
        subTitle="Por Aluno"
      />,
      <CardRelatorio
        icon={<AlunosDesempenho color={"#3E8277"} size={40} />}
        ARE_NOME={["NIV_DES", "REL"]}
        link={"/nivel-desempenho"}
        title={"Desempenho"}
        subTitle="Por Aluno"
      />,
      <CardRelatorio
        icon={<MdOutlineSchool color={"#3E8277"} size={40} />}
        link={`/municipio/${municipio?.MUN_ID}/escolas`}
        ARE_NOME={["ESC"]}
        title={"Escolas"}
        subTitle={municipio?.TOTAL_ESCOLAS?.toLocaleString("pt-BR")}
      />,
      <CardRelatorio
        icon={<Teacher color={"#3E8277"} size={40} />}
        link={`/municipio/${municipio?.MUN_ID}/professores`}
        ARE_NOME={["PRO"]}
        title={"Professores"}
        subTitle={municipio?.TOTAL_PROFESSORES?.toLocaleString("pt-BR")}
      />,
      <CardRelatorio
        icon={<Alunos color={"#3E8277"} size={40} />}
        link={`/municipio/${municipio?.MUN_ID}/escola/${null}/alunos`}
        ARE_NOME={["ALU"]}
        title={"Alunos"}
        subTitle={municipio?.TOTAL_ALUNOS?.toLocaleString("pt-BR")}
      />,
      <CardRelatorio
        icon={<MdOutlineGroup color={"#3E8277"} size={40} />}
        link={"/usuarios"}
        ARE_NOME={["USU"]}
        title={"Usuários"}
        subTitle={municipio?.TOTAL_USUARIOS?.toLocaleString("pt-BR")}
      />,
    ];

    cards = cards.filter((data) => {
      let isVerify = false;

      areas.forEach((area) => {
        if (data.props.ARE_NOME?.includes(area.ARE_NOME)) {
          isVerify = true;
          return;
        }
      });

      if (isVerify) {
        return data;
      }
    });

    return cards;
  }, [municipio, areas]);

  return (
    <>
      {municipio ? (
        <CardsGroup>{formattedCards.map((data) => data)}</CardsGroup>
      ) : (
        <></>
      )}
    </>
  );
}
