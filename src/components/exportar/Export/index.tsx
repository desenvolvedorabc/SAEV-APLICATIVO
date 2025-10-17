import { Autocomplete, TextField } from "@mui/material";
import { BoxFilter, BoxSelect } from "./styledComponents";
import { AutoCompletePagMun } from "src/components/AutoCompletePag/AutoCompletePagMun";
import ButtonWhite from "src/components/buttons/buttonWhite";
import ModalConfirmacao from "src/components/modalConfirmacao";
import { AutoCompletePagMun2 } from "src/components/AutoCompletePag/AutoCompletePagMun2";
import { useExport } from "./useExport";

enum ExportFormat {
  ponto_virgula = "Ponto e Vírgula",
  tabulacao = "Tabulação",
  virgula = "Vírgula",
  pipe = "Pipe",
}

enum enumType {
  ESTADUAL = "Estadual",
  MUNICIPAL = "Municipal",
  PUBLICA = "Publica",
}

export function Export() {
  const {
    type,
    getYearList,
    handleChangeType,
    setCity,
    setEdition,
    setSerie,
    setState,
    setYear,
    city,
    handleChangeCity,
    handleChangeRede,
    handleChangeState,
    isLoadingEdition,
    isLoadingYear,
    rede,
    redeList,
    state,
    states,
    year,
    edition,
    format,
    editionsList,
    serieList,
    isLoadingSerie,
    getEditionDisable,
    handleExport,
    modalOpen,
    setModalOpen,
    modalStatus,
    errorMessage,
    getDisabled,
    serie,
    setFormat,
  } = useExport();

  return (
    <>
      <BoxFilter template={type === "Template-Avaliação"}>
        <BoxSelect border>
          <Autocomplete
            style={{ background: "#FFF" }}
            className=""
            id="type"
            size="small"
            value={type}
            noOptionsText="Tipo de Microdado"
            options={[
              "Alunos",
              "Avaliação",
              "Infrequência",
              "Template-Avaliação",
              "Avaliação-Normalizada",
            ]}
            onChange={(_event, newValue) => {
              handleChangeType(newValue);
              setState(null);
              setYear(null);
              setEdition(null);
              setCity(null);
              setSerie(null);
            }}
            renderInput={(params) => (
              <TextField size="small" {...params} label="Tipo de Microdado" />
            )}
          />
        </BoxSelect>
        {type === "Template-Avaliação" && (
          <BoxSelect border>
            <Autocomplete
              style={{ background: "#FFF" }}
              className=""
              id="type"
              size="small"
              value={year}
              noOptionsText="Ano"
              options={getYearList()}
              onChange={(_event, newValue) => {
                setYear(newValue);
                setEdition(null);
                setState(null);
                setCity(null);
                setSerie(null);
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Ano" />
              )}
              loading={isLoadingYear}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
            />
          </BoxSelect>
        )}
        <BoxSelect border>
          <Autocomplete
            style={{ background: "#FFF" }}
            className=""
            id="type"
            size="small"
            value={state}
            noOptionsText="Estado"
            options={states || []}
            getOptionLabel={(option) => `${option.name}`}
            onChange={(_event, newValue) => {
              handleChangeState(newValue);
            }}
            renderInput={(params) => (
              <TextField size="small" {...params} label="Estado" />
            )}
          />
        </BoxSelect>
        {type !== "Template-Avaliação" ? (
          <>
            <BoxSelect border>
              <AutoCompletePagMun2
                county={city}
                changeCounty={handleChangeCity}
                stateId={state?.id}
                disabled={!state}
              />
            </BoxSelect>
            <BoxSelect border>
              <Autocomplete
                className=""
                id="rede"
                size="small"
                value={rede}
                noOptionsText="Rede"
                options={redeList}
                getOptionLabel={(option) => `${enumType[option]}`}
                onChange={(_event, newValue) => {
                  handleChangeRede(newValue);
                }}
                disabled={!state}
                sx={{
                  background: "#FFF",
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Rede" />
                )}
              />
            </BoxSelect>
            <BoxSelect border>
              <Autocomplete
                style={{ background: "#FFF" }}
                className=""
                id="type"
                size="small"
                value={year}
                noOptionsText="Ano"
                options={getYearList()}
                onChange={(_event, newValue) => {
                  setYear(newValue);
                  setEdition(null);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Ano" />
                )}
                loading={isLoadingYear}
                disabled={type === "Alunos"}
                sx={{
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
              />
            </BoxSelect>
            <BoxSelect border>
              <Autocomplete
                style={{ background: "#FFF" }}
                className=""
                id="type"
                size="small"
                value={edition}
                noOptionsText="Edição"
                options={editionsList?.items ? editionsList?.items : []}
                getOptionLabel={(option) => option.AVA_NOME}
                onChange={(_event, newValue) => {
                  setEdition(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Edição" />
                )}
                loading={isLoadingEdition}
                disabled={getEditionDisable()}
                sx={{
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
              />
            </BoxSelect>
            <BoxSelect>
              <Autocomplete
                style={{ background: "#FFF" }}
                className=""
                id="type"
                size="small"
                value={format}
                noOptionsText="Formato de Exportação"
                options={Object.keys(ExportFormat)}
                getOptionLabel={(option) => ExportFormat[option]}
                onChange={(_event, newValue) => {
                  setFormat(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                    label="Formato de Exportação"
                  />
                )}
                sx={{
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
              />
            </BoxSelect>
          </>
        ) : (
          <>
            <BoxSelect border>
              <AutoCompletePagMun
                county={city}
                changeCounty={handleChangeCity}
                disabled={!year}
              />
            </BoxSelect>
            <BoxSelect border>
              <Autocomplete
                className=""
                id="rede"
                size="small"
                value={rede}
                noOptionsText="Rede"
                options={redeList}
                getOptionLabel={(option) => `${enumType[option]}`}
                onChange={(_event, newValue) => {
                  handleChangeRede(newValue);
                }}
                disabled={!state}
                sx={{
                  background: "#FFF",
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Rede" />
                )}
              />
            </BoxSelect>
            <BoxSelect border>
              <Autocomplete
                style={{ background: "#FFF" }}
                className=""
                id="type"
                size="small"
                value={edition}
                noOptionsText="Edição"
                options={editionsList?.items ? editionsList?.items : []}
                getOptionLabel={(option) => option.AVA_NOME}
                onChange={(_event, newValue) => {
                  setEdition(newValue);
                  setSerie(null);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Edição" />
                )}
                loading={isLoadingEdition}
                disabled={!state}
                sx={{
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
              />
            </BoxSelect>
            <BoxSelect border>
              <Autocomplete
                style={{ background: "#FFF" }}
                className=""
                id="type"
                size="small"
                value={serie}
                noOptionsText="Série"
                options={serieList?.items ? serieList?.items : []}
                getOptionLabel={(option) => option.SER_NOME}
                onChange={(_event, newValue) => {
                  setSerie(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Série" />
                )}
                loading={isLoadingSerie}
                disabled={!edition}
                sx={{
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
              />
            </BoxSelect>
            <BoxSelect>
              <TextField
                style={{ background: "#FFF" }}
                className=""
                id="type"
                size="small"
                value={"CSV - Ponto e vírgula"}
                label="Formato de Exportação"
                disabled
              />
            </BoxSelect>
          </>
        )}

        <div>
          <ButtonWhite
            onClick={() => handleExport()}
            border={true}
            disable={getDisabled()}
          >
            Exportar Dados
          </ButtonWhite>
        </div>
      </BoxFilter>
      <ModalConfirmacao
        show={modalOpen}
        onHide={() => {
          setModalOpen(false);
        }}
        text={
          modalStatus
            ? "Se os filtros combinados gerarem um resultado para exportar, enviaremos um link para o seu e-mail para download"
            : errorMessage
        }
        status={modalStatus}
      />
    </>
  );
}
