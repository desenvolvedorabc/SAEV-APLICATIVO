/* eslint-disable react/jsx-key */
import {
  MdOutlineGroup,
  MdTimeline,
  MdListAlt,
  MdOutlineFactCheck,
  MdOutlineCalculate,
  MdMenuBook,
  MdOutlineGroupWork,
} from "react-icons/md";
import Alunos from "public/assets/images/alunos.svg";
import Chair from "public/assets/images/chair.svg";
import AlunosDesempenho from "public/assets/images/alunos-desempenho.svg";
import { CardsGroup } from "./styledComponents";
import CardRelatorio from "../../cardRelatorio";

import { useMemo } from "react";
import { useAuth } from "src/context/AuthContext";
import { useGetSubPerfil } from "src/services/sub-perfis.service";

type Area = {
  ARE_NOME: string;
  ARE_DESCRICAO: string;
  ARE_ID: string;
};

export default function RelatoriosEscolas({ escola, munId = "0" }) {
  const { user } = useAuth();
  const { data  }= useGetSubPerfil(user?.USU_SPE?.SPE_ID, !!user?.USU_SPE?.SPE_ID)
  const areas = data?.AREAS ?? []

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
        icon={<MdMenuBook color={"#3E8277"} size={40} />}
        link={`/series`}
        ARE_NOME={["SER", "JOR_PED"]}
        title={"Séries"}
        subTitle={escola?.SERIES}
      />,
      <CardRelatorio
        icon={<MdOutlineGroupWork color={"#3E8277"} size={40} />}
        link={"/turmas"}
        ARE_NOME={["TUR", "JOR_PED"]}
        title={"Turmas"}
        subTitle="Por Escola"
      />,
      <CardRelatorio
        icon={<Alunos color={"#3E8277"} size={40} />}
        link={`/municipio/${munId}/escola/${escola?.ESC_ID}/alunos`}
        ARE_NOME={["ALU"]}
        title={"Alunos"}
        subTitle={escola?.TOTAL_ALUNOS?.toLocaleString("pt-BR")}
      />,
      <CardRelatorio
        icon={<MdOutlineGroup color={"#3E8277"} size={40} />}
        link={"/usuarios"}
        ARE_NOME={["USU"]}
        title={"Usuários"}
        subTitle={escola?.TOTAL_USUARIOS?.toLocaleString("pt-BR")}
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
  }, [escola, areas]);

  return (
    <>
      {/* {escola ?  */}
      {/* <CardsGroup>
        <CardRelatorio
          icon={<MdOutlineCalculate color={"#3E8277"} size={40} />}
          link={"/alunos"}
          title="Resultados"
          subTitle="Síntese Geral"
        />
        <CardRelatorio
          icon={<MdListAlt color={"#3E8277"} size={40} />}
          link={"/alunos"}
          title="Resultados"
          subTitle="Por Descritores"
        />
        <CardRelatorio
          icon={<MdOutlineFactCheck color={"#3E8277"} size={40} />}
          link={"/alunos"}
          title={"Lançamentos"}
          subTitle="Por Escola"
        />
        <CardRelatorio
          icon={<MdOutlineFactCheck color={"#3E8277"} size={40} />}
          link={"/alunos"}
          title={"Enturmação"}
          subTitle="Por Escola"
        />
        <CardRelatorio
          icon={<MdTimeline color={"#3E8277"} size={40} />}
          link={"/alunos"}
          title={"Linha Evolutiva"}
          subTitle="Turmas, Séries e Edição"
        />
        <CardRelatorio
          icon={<Chair color={"#3E8277"} size={40} />}
          link={"/alunos"}
          title={"Infrequência"}
          subTitle="Por Escola"
        />
        <CardRelatorio
          icon={<AlunosDesempenho color={"#3E8277"} size={40} />}
          link={`/municipio/${munId}/escolas`}
          title={"Desempenho"}
          subTitle="Por Aluno"
        />
        <CardRelatorio
          icon={<MdMenuBook color={"#3E8277"} size={40} />}
          link={`/municipio/${munId}/escolas`}
          title={"Séries"}
          subTitle={escola?.SERIES}
        />
        <CardRelatorio
          icon={<MdOutlineGroupWork color={"#3E8277"} size={40} />}
          link={"/alunos"}
          title={"Turmas"}
          subTitle="Por Escola"
        />
        <CardRelatorio
          icon={<Alunos color={"#3E8277"} size={40} />}
          link={"/alunos"}
          title={"Alunos"}
          subTitle={escola?.TOTAL_ALUNOS}
        />
        <CardRelatorio
          icon={<MdOutlineGroup color={"#3E8277"} size={40} />}
          link={"/alunos"}
          title={"Usuários"}
          subTitle={escola?.TOTAL_USUARIOS}
        /> */}
      <CardsGroup>{formattedCards.map((data) => data)}</CardsGroup>
      {/* : <></>} */}
    </>
  );
}
