import TableList from "../tableList";
import { AddSide, Card, Title } from "./styledComponents";
import { GridColDef } from "@mui/x-data-grid";

const testCol: GridColDef[] = [
  {
    field: "TES_NOME",
    headerName: "TESTE",
    headerClassName: "header",
    flex: 1,
    sortable: false,
  },
  {
    field: "TES_DIS",
    headerName: "DISCIPLINA",
    headerClassName: "header",
    flex: 1,
    sortable: false,
  },
  {
    field: "TES_ANO",
    headerName: "ANO",
    headerClassName: "header",
    flex: 1,
    sortable: false,
  },
];

export function TestePageForCounty({ listTestesAdd }) {
  return (
    <Card className="col-12 d-flex">
      <AddSide className="col">
        <Title className="m-3">Testes Adicionados</Title>
        <TableList
          columns={testCol}
          rows={listTestesAdd}
          selectionTable={() => {}}
          setSelectionTable={() => {}}
          checkboxSelection={false}
          hideFooterPagination={true}
        />
      </AddSide>
    </Card>
  );
}
