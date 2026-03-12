import { useEffect, useState } from "react";
import { useGetAssessmentsForCounty } from "src/services/assessment-county.service";
import { useGetYears } from "src/services/anos.service";

function createData(AVA_ID: number, AVA_NOME: string, AVA_ANO: string) {
  return {
    AVA_ID,
    AVA_NOME,
    AVA_ANO,
  };
}

export function useTableAssessmentForCounty() {
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);

  const { data: dataYears } = useGetYears(null, 1, 999999, null, "DESC", true);

  const { data: dataEditions, isLoading } = useGetAssessmentsForCounty(
    null,
    page,
    limit,
    selectedYear?.ANO_NOME,
    !!selectedYear
  );

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleChangePage2 = (direction) => {
    if (direction === "prev") {
      setPage(page - 1);
    } else {
      setPage(page + 1);
    }
  };
  const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
  };

  const handleChangeYear = (newValue) => {
    setSelectedYear(newValue);
    setPage(1);
  };

  const [rows, setRows] = useState([]);

  useEffect(() => {
    setQntPage(dataEditions?.meta?.totalPages);

    let list = [];
    dataEditions?.items?.map((x) => {
      list.push(createData(x.AVA_ID, x.AVA_NOME, x.AVA_ANO));
    });
    setRows(list);
  }, [dataEditions]);

  return {
    rows,
    limit,
    disablePrev,
    disableNext,
    handleChangePage2,
    handleChangeLimit,
    selectedYear,
    handleChangeYear,
    dataYears,
    isLoading,
  };
}
