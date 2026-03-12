import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useGetYears } from "src/services/anos.service";
import {
  editAssessment,
  createAssessment,
  EditionTypeEnum,
} from "src/services/avaliaoces.service";

type ValidationErrors = Partial<{
  AVA_NOME: string;
  AVA_AVM: string;
  AVA_TES: string;
  AVA_ANO: string;
  AVA_DT_INICIO: string;
  AVA_DT_FIM: string;
  AVA_TIPO: string;
}>;

export function useFormEditAssessment(avaliacao) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalShowDuplicate, setModalShowDuplicate] = useState(false);
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [active, setActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState(true);
  const [areaActive, setAreaActive] = useState(true);
  const [idResp, setIdResp] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [errorDataInicioText, setErrorDataInicioText] = useState("");
  const [errorDataFimText, setErrorDataFimText] = useState("");

  const [listTestesAdd, setListTestesAdd] = useState([]);
  const [listMunAdd, setListMunAdd] = useState([]);

  const { data: dataYears } = useGetYears(null, 1, 999999, null, "DESC", true);

  useEffect(() => {
    let find = dataYears?.items?.find((x) => x.ANO_NOME == avaliacao.AVA_ANO);

    if (find) {
      setSelectedYear(find);
    }
  }, [avaliacao.AVA_ANO, dataYears]);

  useEffect(() => {
    if (avaliacao.AVA_DT_INICIO) {
      setDataInicio(avaliacao.AVA_DT_INICIO);
    }
    if (avaliacao.AVA_DT_FIM) {
      setDataFim(avaliacao.AVA_DT_FIM);
    }
  }, [avaliacao.AVA_DT_INICIO, avaliacao.AVA_DT_FIM]);

  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!values.AVA_NOME) {
      errors.AVA_NOME = "Campo obrigatório";
    } else if (values.AVA_NOME.length < 6) {
      errors.AVA_NOME = "Deve ter no minimo 6 caracteres";
    }
    if (!values.AVA_TES) {
      errors.AVA_TES = "Campo obrigatório";
    }
    if (!values.AVA_ANO) {
      errors.AVA_ANO = "Campo obrigatório";
    }
    if (!values.AVA_TIPO) {
      errors.AVA_TIPO = "Campo obrigatório";
    }
 
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      AVA_NOME: avaliacao.AVA_NOME,
      AVA_ANO: avaliacao.AVA_ANO,
      AVA_TIPO: avaliacao.AVA_TIPO || EditionTypeEnum.GERAL,
      AVA_AVM: avaliacao.AVA_AVM,
      AVA_TES: avaliacao.AVA_TES,
      AVA_ATIVO: avaliacao.AVA_ATIVO,
      AVA_DT_INICIO: avaliacao.AVA_DT_INICIO || null,
      AVA_DT_FIM: avaliacao.AVA_DT_FIM || null,
    },
    validate,
    onSubmit: async (values) => {
      setIsDisabled(true);

      values.AVA_ATIVO = avaliacao.AVA_ID ? avaliacao.AVA_ATIVO : true;
      values.AVA_AVM?.forEach((value) => {
        value.id = value.AVM_MUN_ID;
      });

      let response;

      try {
        response = avaliacao.AVA_ID
          ? await editAssessment(avaliacao.AVA_ID, values)
          : await createAssessment(values);
      } catch (err) {
        setIsDisabled(false);
      } finally {
        setIsDisabled(false);
      }

      if (
        response.status === 200 &&
        response.data.AVA_NOME === values.AVA_NOME
      ) {
        setIdResp(response.data.AVA_ID);
        setModalStatus(true);
        setModalShowConfirm(true);
      } else {
        setErrorMessage(
          response.data.message || "Erro ao criar/atualizar avaliação"
        );
        setModalStatus(false);
        setModalShowConfirm(true);
        values.AVA_AVM?.forEach((value) => {
          value.id = value.AVM_MUN_ID + value.AVM_TIPO;
        });
      }
    },
  });

  async function changeAvaliacao() {
    setModalShowQuestion(false);
    avaliacao = {
      AVA_ID: avaliacao.AVA_ID,
      AVA_ATIVO: !formik.values.AVA_ATIVO,
    };

    setIsDisabled(true);
    let response = null;
    try {
      response = await editAssessment(avaliacao.AVA_ID, avaliacao);
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }

    if (
      response.status === 200 &&
      response.data.AVA_NOME === avaliacao.AVA_NOME
    ) {
      setActive(avaliacao.AVA_ATIVO);
      setModalShowConfirmQuestion(true);
      setModalStatus(true);
      formik.values.AVA_ATIVO = avaliacao.AVA_ATIVO;
    } else {
      setModalStatus(false);
      setModalShowConfirmQuestion(true);
    }
  }

  const changeListAdd = (list) => {
    setListTestesAdd(list);
    formik.values.AVA_TES = list;
    formik.setTouched({ ...formik.touched, ["AVA_TES"]: true });
    formik.handleChange;
  };

  const changeListMunAdd = (list) => {
    setListMunAdd(list);
    formik.values.AVA_AVM = list;
    formik.setTouched({ ...formik.touched, ["AVA_AVM"]: true });
    formik.handleChange;
  };

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  useEffect(() => {
    if (formik.values.AVA_TES) {
      let list = [];
      formik.values.AVA_TES.map((x) => {
        list.push({
          id: x.TES_ID,
          TES_ID: x.TES_ID,
          TES_NOME: x.TES_NOME,
          TES_DIS: x.TES_DIS?.DIS_NOME,
          TES_ANO: x.TES_ANO,
        });
      });
      changeListAdd(list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formik.values.AVA_AVM) {
      let list = [];
      formik.values.AVA_AVM.map((x) => {
        list.push({
          assessmentCountyId: x.AVM_ID,
          id: x.AVM_MUN?.MUN_ID + x.AVM_TIPO,
          AVM_MUN_ID: x.AVM_MUN?.MUN_ID,
          AVM_MUN_NOME: x.AVM_MUN?.MUN_NOME,
          AVM_DT_INICIO: x.AVM_DT_INICIO,
          AVM_DT_FIM: x.AVM_DT_FIM,
          AVM_DT_DISPONIVEL: x.AVM_DT_DISPONIVEL,
          AVM_ATIVO: x.AVM_ATIVO,
          AVM_TIPO: x.AVM_TIPO,
        });
      });
      changeListMunAdd(list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeYear = (newValue) => {
    setSelectedYear(newValue);
    formik.setFieldValue("AVA_ANO", newValue?.ANO_NOME, true);
  };

  return {
    dataYears,
    selectedYear,
    handleChangeYear,
    onKeyDown,
    formik,
    changeListAdd,
    changeListMunAdd,
    idResp,
    modalStatus,
    modalShowQuestion,
    modalShowConfirmQuestion,
    changeAvaliacao,
    setModalShowQuestion,
    dataInicio,
    dataFim,
    setErrorDataInicioText,
    setDataInicio,
    errorDataInicioText,
    setErrorDataFimText,
    setDataFim,
    errorDataFimText,
    setModalShowDuplicate,
    setAreaActive,
    listTestesAdd,
    areaActive,
    listMunAdd,
    setModalShowWarning,
    ModalShowConfirm,
    setModalShowConfirm,
    active,
    setModalShowConfirmQuestion,
    modalShowWarning,
    modalShowDuplicate,
    isDisabled,
    errorMessage,
  };
}
