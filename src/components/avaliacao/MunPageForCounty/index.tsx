import { isEqual, isFuture, isPast } from "date-fns";
import TableList from "../tableList";
import { AddSide, Card, Status, Circle, Text } from "./styledComponents";
import { GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import { Dispatch, SetStateAction, useState } from "react";
import ButtonWhite from "src/components/buttons/buttonWhite";
import { format } from "date-fns";
import ModalAlterarPeriodo from "../modalAlterarPeriodo";
import { configurePeriod } from "src/services/assessment-county.service";

enum TypeAssessmentEnum {
  MUNICIPAL = "Municipal",
  ESTADUAL = "Estadual",
}

interface Props {
  listMunAdd: any[];
  setModalShowConfirm: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<any>;
  setCounties: Dispatch<any>;
}

export function MunPageForCounty({
  listMunAdd,
  setErrorMessage,
  setModalShowConfirm,
}: Props) {
  const [selectionTable, setSelectionTable] = useState<GridSelectionModel>([]);
  const [modalShow, setModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const munCol: GridColDef[] = [
    {
      field: "AVM_MUN_NOME",
      headerName: "MUNICÍPIO",
      headerClassName: "header",
      flex: 1,
      sortable: false,
    },
    {
      field: "AVM_TIPO",
      headerName: "REDE",
      renderCell: (cellValues) => {
        return <div>{TypeAssessmentEnum[cellValues?.row?.AVM_TIPO]}</div>;
      },
      flex: 1,
      sortable: false,
    },
    {
      field: "lancamento",
      headerName: "PERÍODO DE LANÇAMENTO",
      width: 220,
      sortable: false,
      renderCell: (cellValues) => {
        return (
          <div>
            {cellValues?.row?.AVM_DT_INICIO ?
              format(new Date(cellValues?.row?.AVM_DT_INICIO), "dd/MM/yyyy") + " a " + format(new Date(cellValues?.row?.AVM_DT_FIM), "dd/MM/yyyy")
              :
              "-"
              }
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "STATUS",
      sortable: false,

      renderCell: (cellValues) => {
        const isVerifyData =
          isEqual(
            new Date(new Date().toDateString()),
            new Date(new Date(cellValues?.row?.AVM_DT_INICIO).toDateString())
          ) ||
          isEqual(
            new Date(new Date().toDateString()),
            new Date(new Date(cellValues?.row?.AVM_DT_FIM).toDateString())
          )
            ? false
            : isPast(
                new Date(new Date(cellValues?.row?.AVM_DT_FIM).toDateString())
              ) ||
              isFuture(
                new Date(
                  new Date(cellValues?.row?.AVM_DT_INICIO).toDateString()
                )
              );

        return (
          <Status>
            <Circle
              style={{
                backgroundColor: `${isVerifyData ? "red" : "4a4aff"}`,
              }}
            />
            <Text
              style={{
                color: `${isVerifyData ? "red" : "4a4aff"}`,
              }}
            >
              {isVerifyData ? "Fechado" : "Aberto"}
            </Text>
          </Status>
        );
      },
    },
  ];

  const openModalPeriod = () => {
    setModalShow(true);
  };

  const handleChangePeriod = async (
    selectedList,
    lancInicio,
    lancFim
  ) => {
    const county = listMunAdd[0];

    listMunAdd.map(function (obj) {
      selectedList.some(function (obj2) {
        if (obj.id === obj2.id) {
          obj.AVM_DT_FIM = lancFim;
          obj.AVM_DT_INICIO = lancInicio;
        }
      });
    });
    try {
      setIsLoading(true);
      await configurePeriod({
        assessmentId: county.assessmentId,
        AVM_DT_INICIO: lancInicio,
        AVM_DT_FIM: lancFim,
        AVM_TIPO: county.AVM_TIPO,
      });

      setModalShow(false);
    } catch (e: any) {
      setErrorMessage(e.response.data.message);
    } finally {
      setIsLoading(false);
      setModalShowConfirm(true);
    }
  };

  function onHide() {
    if (!isLoading) {
      return setModalShow(false);
    }
  }

  return (
    <>
      <Card className="col-12 d-flex">
        <AddSide className="col">
          <div className="mt-3 d-flex justify-content-between m-3 mt-0">
            <div className="d-flex col-5">
              <div className="me-2">
                <ButtonWhite
                  onClick={openModalPeriod}
                  disable={!selectionTable.length}
                >
                  Alterar Período de Lançamento
                </ButtonWhite>
              </div>
            </div>
          </div>
          <TableList
            columns={munCol}
            rows={listMunAdd}
            selectionTable={selectionTable}
            setSelectionTable={setSelectionTable}
            hideFooterPagination={true}
          />
        </AddSide>
      </Card>
      <ModalAlterarPeriodo
        disabled
        show={modalShow}
        isLoading={isLoading}
        onHide={onHide}
        showDisponibilidade={false}
        selected={listMunAdd.filter((x) => {
          let find = false;
          selectionTable.forEach((selection) => {
            if (selection === x.id) find = true;
          });
          return find;
        })}
        list={listMunAdd}
        handlechangeperiodo={handleChangePeriod}
      />
    </>
  );
}
