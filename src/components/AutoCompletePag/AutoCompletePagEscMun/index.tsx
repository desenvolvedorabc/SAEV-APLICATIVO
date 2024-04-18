import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useGetSchools } from "src/services/escolas.service";
import useDebounce from "src/utils/use-debounce";

export function AutoCompletePagEscMun({ school, changeSchool, mun, resetSchools = false, width = "100%", active = null }) {
  const [searchEsc, setSearchEsc] = useState(null);
  const [limitEsc, setLimitEsc] = useState(false);
  const [position, setPosition] = useState(0);
  const [listboxNode, setListboxNode] = useState(null);
  
  const debouncedSearchTerm = useDebounce(searchEsc, 1000);

  const { flatData: listSchool, query: { isLoading, fetchNextPage } } = useGetSchools(
    debouncedSearchTerm,
    10,
    null,
    'ASC',
    active,
    mun?.MUN_ID,
  );

  useEffect(() => {
    setSearchEsc(null)
  }, [resetSchools]);

  useEffect(() => {
    if (listboxNode !== null) {
      listboxNode.scrollTop = position;
    }
  }, [position, listboxNode])
  
  const handleScrollEsc = async (event) => {
    setListboxNode(event.currentTarget);

    const x = event.currentTarget.scrollTop + event.currentTarget.clientHeight;
  
    const position = event.currentTarget.scrollTop + event.currentTarget.clientHeight;
    if (event.currentTarget.scrollHeight - position <= 1 && !limitEsc) {
      fetchNextPage();
      setPosition(x);
    }
  };

  return (
    <Autocomplete
      style={{width: width, background: "#FFF"}}
      className=""
      id="size-small-outlined"
      size="small"
      value={school}
      noOptionsText="Escola"
      options={listSchool}
      getOptionLabel={(option) =>  `${option?.ESC_NOME}`}
      onChange={(_event, newValue) => {
        changeSchool(newValue)}}
      onInputChange={(_event, newValue) => {
        setLimitEsc(false)
        setSearchEsc(newValue);
      }}
      ListboxProps={{
        onScroll: handleScrollEsc
      }}
      disabled={mun === null}
      loading={isLoading}
      sx={{
        "& .Mui-disabled": {
          background: "#D3D3D3",
        },
      }}
      renderInput={(params) => <TextField size="small" {...params} label="Escola" />}
    />
  );
}
