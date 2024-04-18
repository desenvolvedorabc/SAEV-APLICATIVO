import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { getCounties } from "src/services/municipios.service";
import useDebounce from "src/utils/use-debounce";

export function AutoCompletePagMun({
  county,
  changeCounty,
  width = "100%",
  active = null,
  label = 'Município'
}) {
  const [pageMun, setPageMun] = useState(1);
  const [searchMun, setSearchMun] = useState(null);
  const [limitMun, setLimitMun] = useState(false);
  const [munList, setMunList] = useState([]);

  const [position, setPosition] = useState(0);
  const [listboxNode, setListboxNode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchMun, 1000);

  const loadCounties = async () => {
    setIsLoading(true);
    const resp = await getCounties(
      debouncedSearchTerm,
      pageMun,
      10,
      null,
      "ASC",
      null,
      active
    );

    setPageMun(pageMun + 1);

    if (resp?.data?.items?.length === 0) {
      setLimitMun(true);
      setIsLoading(false);
      return;
    }
    setMunList([...munList, ...resp.data.items]);

    setIsLoading(false);
  };

  useEffect(() => {
    if (listboxNode !== null) {
      listboxNode.scrollTop = position;
    }
  }, [position, listboxNode]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setPageMun(1);
      setMunList([]);
      loadCounties();
    } else {
      loadCounties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleScrollMun = async (event) => {
    setListboxNode(event.currentTarget);

    const x = event.currentTarget.scrollTop + event.currentTarget.clientHeight;

    if (event.currentTarget.scrollHeight - x <= 1 && !limitMun) {
      await loadCounties();
      setPosition(x);
    }
  };

  return (
    <Autocomplete
      style={{ width: width, background: "#FFF" }}
      fullWidth
      className="col"
      id="mun"
      size="small"
      value={county}
      noOptionsText={label}
      options={munList}
      getOptionLabel={(option) => `${option?.MUN_NOME}`}
      onChange={(_event, newValue) => {
        changeCounty(newValue);
      }}
      onInputChange={(_event, newValue) => {
        setPageMun(1);
        setMunList([]);
        setLimitMun(false);
        setSearchMun(newValue);
      }}
      ListboxProps={{
        onScroll: handleScrollMun,
      }}
      loading={isLoading}
      sx={{
        "& .Mui-disabled": {
          background: "#D3D3D3",
        },
      }}
      renderInput={(params) => (
        <TextField size="small" {...params} label={label} />
      )}
    />
  );
}
