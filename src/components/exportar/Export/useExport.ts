import { useState, useEffect } from "react";
import { useAuth } from "src/context/AuthContext";
import { queryClient } from "src/lib/react-query";
import { useGetYears } from "src/services/anos.service";
import { useGetAssessmentsRelease } from "src/services/avaliaoces.service";
import { useGetStates } from "src/services/estados.service";
import {
  getExportEvaluation,
  getExportStudents,
  getExportInfrequency,
  getExportTemplate,
  getExportEvaluationDataStandardized,
} from "src/services/exportar.service";
import { useGetSeries } from "src/services/series.service";

export function useExport() {
  const [type, setType] = useState("");
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [rede, setRede] = useState(null);
  const [redeList, setRedeList] = useState([]);
  const [year, setYear] = useState(null);
  const [edition, setEdition] = useState(null);
  const [serie, setSerie] = useState(null);
  const [format, setFormat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (
        user?.USU_SPE?.role === "ESTADO" ||
        user?.USU_SPE?.role === "MUNICIPIO_ESTADUAL"
      ) {
        setRedeList(["ESTADUAL"]);
      } else if (user?.USU_SPE?.role === "MUNICIPIO_MUNICIPAL") {
        setRedeList(["MUNICIPAL"]);
      } else if (user?.USU_SPE?.role === "ESCOLA") {
        setRedeList([user?.USU_ESC?.ESC_TIPO]);
      } else {
        setRedeList(["ESTADUAL", "MUNICIPAL"]);
      }
    }
  }, [user]);

  const { data: states, isLoading: isLoadingStates } = useGetStates();

  const { data: dataYear, isLoading: isLoadingYear } = useGetYears(
    null,
    1,
    999999,
    null,
    "DESC",
    true
  );

  const { data: editionsList, isLoading: isLoadingEdition } =
    useGetAssessmentsRelease(
      null,
      1,
      99999,
      null,
      null,
      city?.MUN_ID,
      null,
      null,
      null,
      year,
      null,
      type === "Avaliação" ||
        type === "Template-Avaliação" ||
        type === "Avaliação-Normalizada"
    );

  const { data: serieList, isLoading: isLoadingSerie } = useGetSeries(
    null,
    1,
    99999,
    null,
    "ASC",
    null,
    "1"
  );

  const getDisabled = () => {
    if (
      user?.USU_SPE?.role !== "ESTADO" &&
      user?.USU_SPE?.role !== "SAEV" &&
      !city
    ) {
      return true;
    }

    if (type === "Template-Avaliação") {
      if (year && edition && state && rede && serie) {
        return false;
      }
    } else if (type && state && rede && format && !isDisabled) {
      if (type === "Avaliação" && !edition) {
        return true;
      }

      if (type === "Avaliação-Normalizada" && !edition) {
        return true;
      }
      if (type !== "Alunos" && !year) {
        return true;
      }
      return false;
    }
    return true;
  };

  const handleExport = async () => {
    setIsDisabled(true);
    let response = null;
    try {
      if (type === "Avaliação") {
        response = await getExportEvaluation(
          state?.id,
          city?.MUN_ID,
          rede,
          year,
          edition?.AVA_ID,
          format
        );
      } else if (type === "Alunos") {
        response = await getExportStudents(
          state?.id,
          city?.MUN_ID,
          rede,
          format
        );
      } else if (type === "Infrequência") {
        response = await getExportInfrequency(
          state?.id,
          city?.MUN_ID,
          rede,
          year,
          format
        );
      } else if (type === "Template-Avaliação") {
        response = await getExportTemplate(
          state?.id,
          edition?.AVA_ID,
          city?.MUN_ID,
          rede,
          serie?.SER_ID
        );
      } else if (type === "Avaliação-Normalizada") {
        response = await getExportEvaluationDataStandardized(
          state?.id,
          city?.MUN_ID,
          rede,
          year,
          edition?.AVA_ID,
          format
        );
      }
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }
    if (!response?.data?.message) {
      setModalOpen(true);
      setModalStatus(true);
      queryClient.invalidateQueries(["history-export"]);
    } else {
      setModalStatus(false);
      setModalOpen(true);
      setErrorMessage(response.data.message || "Erro ao exportar dados");
    }
  };

  const handleChangeCity = (newValue) => {
    setCity(newValue);
    setEdition(null);
    setSerie(null);
    setRede(null);
  };

  const handleChangeRede = (newValue) => {
    setRede(newValue);
  };

  const handleChangeType = (newValue) => {
    setType(newValue);
    setYear(null);
    setEdition(null);
    setRede(null);
  };

  const handleChangeState = (newValue) => {
    setState(newValue);
    type !== "Template-Avaliação" && setYear(null);
    handleChangeCity(null);
    setEdition(null);
    setRede(null);
  };

  const getYearList = () => {
    if (dataYear?.items) {
      let listNumber = dataYear?.items.map((x) => {
        return Number(x.ANO_NOME);
      });

      return listNumber.filter(
        (value, index, array) => array.indexOf(value) === index
      );
    }

    return [];
  };

  const getEditionDisable = () => {
    if (type != "Avaliação" && type != "Avaliação-Normalizada") return true;
    if (!year || !state) return true;
    return false;
  };

  return {
    type,
    handleChangeType,
    setState,
    setYear,
    setEdition,
    setCity,
    setSerie,
    getYearList,
    year,
    isLoadingYear,

    state,
    states,
    handleChangeState,
    city,
    handleChangeCity,

    rede,
    redeList,
    handleChangeRede,

    edition,
    isLoadingEdition,
    editionsList,
    getEditionDisable,
    format,
    setFormat,

    serie,
    serieList,
    isLoadingSerie,

    handleExport,
    getDisabled,
    modalOpen,
    setModalOpen,
    modalStatus,
    errorMessage,
  };
}
