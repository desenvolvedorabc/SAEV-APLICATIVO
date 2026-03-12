import { Form } from "react-bootstrap";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { ButtonGroup, Card, ButtonArea } from "./styledComponents";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ErrorText from "src/components/ErrorText";
import ModalConfirmacao from "src/components/modalConfirmacao";
import ModalAviso from "src/components/modalAviso";
import Router from "next/router";
import ModalPergunta from "src/components/modalPergunta";
import ButtonVermelho from "src/components/buttons/buttonVermelho";
import { Autocomplete, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import brLocale from "date-fns/locale/pt-BR";
import { format } from "date-fns";
import { isValidDate } from "src/utils/validate";
import { EditionTypeEnum } from "src/services/avaliaoces.service";

import TestePage from "../testePage";
import MunPage from "../munPage";
import ModalDuplicate from "../modalDuplicate";
import { useFormEditAssessment } from "./useFormEditAssessment";

export default function FormEditAvaliacao({ avaliacao }) {
  const {
    dataYears,
    selectedYear,
    handleChangeYear,
    onKeyDown,
    formik,
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
    changeListAdd,
    changeListMunAdd,
    listMunAdd,
    setModalShowQuestion,
    setModalShowWarning,
    ModalShowConfirm,
    setModalShowConfirm,
    modalStatus,
    modalShowQuestion,
    changeAvaliacao,
    active,
    modalShowConfirmQuestion,
    setModalShowConfirmQuestion,
    modalShowWarning,
    modalShowDuplicate,
    isDisabled,
    errorMessage,
  } = useFormEditAssessment(avaliacao);

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        onKeyDown={onKeyDown}
      >
        <Card>
          <div className="d-flex gap-3 flex-column">
            <div className="d-flex gap-3">
              <div className="" style={{ width: 226 }}>
                <Autocomplete
                  style={{ background: "#FFF" }}
                  className=""
                  id="ano"
                  size="small"
                  value={selectedYear}
                  noOptionsText="Ano"
                  options={dataYears?.items ? dataYears?.items : []}
                  getOptionLabel={(option) => `${option?.ANO_NOME}`}
                  onChange={(_event, newValue) => {
                    handleChangeYear(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} label="Ano" />
                  )}
                />
                {formik.errors.AVA_ANO ? (
                  <ErrorText>{formik.errors.AVA_ANO}</ErrorText>
                ) : null}
              </div>
              <div className="" style={{ width: 226 }}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="AVA_NOME"
                  id="AVA_NOME"
                  value={formik.values.AVA_NOME}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.errors.AVA_NOME ? (
                  <ErrorText>{formik.errors.AVA_NOME}</ErrorText>
                ) : null}
              </div>
              <div className="" style={{ width: 226 }}>
                <Autocomplete
                  style={{ background: "#FFF" }}
                  className=""
                  id="tipo"
                  size="small"
                  disabled={avaliacao.AVA_ID ? true : false}
                  value={
                    formik.values.AVA_TIPO
                      ? {
                          label:
                            formik.values.AVA_TIPO === EditionTypeEnum.GERAL
                              ? "Geral"
                              : "Específico",
                          value: formik.values.AVA_TIPO,
                        }
                      : null
                  }
                  noOptionsText="Tipo"
                  options={[
                    { label: "Geral", value: EditionTypeEnum.GERAL },
                    { label: "Específico", value: EditionTypeEnum.ESPECIFICO },
                  ]}
                  getOptionLabel={(option) => option.label}
                  onChange={(_event, newValue: any) => {
                    formik.setFieldValue(
                      "AVA_TIPO",
                      newValue?.value ?? null,
                      true
                    );
                  }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} label="Tipo" />
                  )}
                />
                {formik.errors.AVA_TIPO ? (
                  <ErrorText>{formik.errors.AVA_TIPO}</ErrorText>
                ) : null}
              </div>

              {avaliacao.AVA_ID === true ? null : (
                <div className="" style={{ width: 120 }}>
                  <ButtonWhite
                    onClick={() => {
                      setModalShowDuplicate(true);
                    }}
                  >
                    Duplicar
                  </ButtonWhite>
                </div>
              )}
            </div>

            <div className="d-flex gap-3">
              <div className="" style={{ width: 226 }}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  locale={brLocale}
                >
                  <DatePicker
                    disablePast
                    openTo="year"
                    views={["year", "month", "day"]}
                    label="Data Início da Prova:"
                    value={dataInicio}
                    onError={(error) => {
                      if (error === "invalidDate") {
                        setErrorDataInicioText("Data inválida");
                        return;
                      }
                      if (!error) {
                        setErrorDataInicioText("");
                      }
                    }}
                    onChange={(val) => {
                      if (val && isValidDate(val)) {
                        const formattedDate = format(
                          new Date(val),
                          "yyyy-MM-dd 23:59:59"
                        );
                        setDataInicio(formattedDate);
                        formik.setFieldValue(
                          "AVA_DT_INICIO",
                          formattedDate,
                          true
                        );
                        return;
                      }
                      setDataInicio(null);
                      formik.setFieldValue("AVA_DT_INICIO", null, true);
                    }}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        sx={{ backgroundColor: "#FFF" }}
                      />
                    )}
                  />
                </LocalizationProvider>
                {errorDataInicioText ? (
                  <ErrorText>{errorDataInicioText}</ErrorText>
                ) : null}
              </div>
              <div className="" style={{ width: 226 }}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  locale={brLocale}
                >
                  <DatePicker
                    disablePast
                    openTo="year"
                    views={["year", "month", "day"]}
                    label="Data Fim da Prova:"
                    value={dataFim}
                    minDate={dataInicio ? new Date(dataInicio) : undefined}
                    onError={(error) => {
                      if (error === "invalidDate") {
                        setErrorDataFimText("Data inválida");
                        return;
                      }
                      if (error === "minDate") {
                        setErrorDataFimText("Data inferior à data de início");
                        return;
                      }
                      if (!error) {
                        setErrorDataFimText("");
                      }
                    }}
                    onChange={(val) => {
                      if (val && isValidDate(val)) {
                        const formattedDate = format(
                          new Date(val),
                          "yyyy-MM-dd 23:59:59"
                        );
                        setDataFim(formattedDate);
                        formik.setFieldValue("AVA_DT_FIM", formattedDate, true);
                        return;
                      }
                      setDataFim(null);
                      formik.setFieldValue("AVA_DT_FIM", null, true);
                    }}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        sx={{ backgroundColor: "#FFF" }}
                      />
                    )}
                  />
                </LocalizationProvider>
                {errorDataFimText ? (
                  <ErrorText>{errorDataFimText}</ErrorText>
                ) : null}
              </div>
            </div>
          </div>
        </Card>
        <div>
          <div className="d-flex">
            <ButtonArea
              type="button"
              onClick={() => {
                setAreaActive(true);
              }}
              active={areaActive}
              className="me-2"
            >
              Testes
            </ButtonArea>
            <ButtonArea
              type="button"
              onClick={() => {
                setAreaActive(false);
              }}
              active={!areaActive}
            >
              Municípios
            </ButtonArea>
          </div>
          {areaActive ? (
            <TestePage
              listTestesAdd={listTestesAdd}
              changeListAdd={changeListAdd}
              listSelected={formik.values.AVA_TES}
            />
          ) : (
            <MunPage
              changeListMunAdd={changeListMunAdd}
              listMunAdd={listMunAdd}
              listSelected={formik.values.AVA_AVM}
            />
          )}
        </div>
        <ButtonGroup>
          <div>
            {formik.values.AVA_ATIVO && avaliacao.AVA_ID ? (
              <ButtonVermelho
                onClick={(e) => {
                  e.preventDefault();
                  setModalShowQuestion(true);
                }}
              >
                Desativar
              </ButtonVermelho>
            ) : null}

            {!formik.values.AVA_ATIVO && avaliacao.AVA_ID ? (
              <ButtonPadrao
                onClick={(e) => {
                  e.preventDefault();
                  setModalShowQuestion(true);
                }}
              >
                Ativar
              </ButtonPadrao>
            ) : null}
          </div>
          <div className="d-flex">
            <div style={{ width: 160 }}>
              <ButtonWhite
                onClick={() => {
                  setModalShowWarning(true);
                }}
              >
                Cancelar
              </ButtonWhite>
            </div>
            <div className="ms-3" style={{ width: 160 }}>
              <ButtonPadrao
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  formik.handleSubmit(e);
                }}
                disable={!formik.isValid || isDisabled}
              >
                Salvar
              </ButtonPadrao>
            </div>
          </div>
        </ButtonGroup>
      </Form>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false);
          modalStatus && Router.reload();
        }}
        text={
          modalStatus
            ? `Edição "${formik.values.AVA_NOME}" ${
                avaliacao.AVA_ID === true ? "adicionado" : "alterado"
              } com sucesso!`
            : errorMessage
        }
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeAvaliacao()}
        buttonNo={!active ? "Não Desativar" : "Não Ativar"}
        buttonYes={"Sim, Tenho Certeza"}
        text={`Você está ${
          !active === true ? "ativando(a)" : "desativando(a)"
        } o(a) “${
          formik.values.AVA_NOME
        }”, isso tirará todos os acessos, os dados serão desconsiderados do relatório. Você pode ${
          active === true ? "ativar" : "desativar"
        } novamente a qualquer momento.`}
        status={active}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => {
          setModalShowConfirmQuestion(false);
        }}
        text={
          modalStatus
            ? `${formik.values.AVA_NOME} ${
                active === true ? "ativado" : "desativado"
              } com sucesso!`
            : `Erro ao ${active ? "ativar" : "desativar"}`
        }
        status={modalStatus}
      />
      <ModalAviso
        show={modalShowWarning}
        onHide={() => setModalShowWarning(false)}
        onConfirm={() => {
          Router.push("/edicoes");
        }}
        buttonYes={"Sim, Descartar Informações"}
        buttonNo={"Não Descartar Informações"}
        text={`Ao confirmar essa opção todas as informações serão perdidas.`}
      />
      <ModalDuplicate
        show={modalShowDuplicate}
        onHide={() => {
          setModalShowDuplicate(false);
        }}
        avaliacao={avaliacao}
      />
    </>
  );
}
