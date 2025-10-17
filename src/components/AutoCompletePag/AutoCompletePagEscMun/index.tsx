import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useGetSchoolsPag } from "src/services/escolas.service";
import useDebounce from "src/utils/use-debounce";

export function AutoCompletePagEscMun({ school, changeSchool, mun, typeSchool = null, resetSchools = false, width = "100%", active = null, disabled, enabled = true }) {
  const [searchEsc, setSearchEsc] = useState(null);
  const [limitEsc, setLimitEsc] = useState(false);
  const [position, setPosition] = useState(0);
  const [listboxNode, setListboxNode] = useState(null);
  
  const debouncedSearchTerm = useDebounce(searchEsc, 1000);

  const { flatData: listSchool, query: { isLoading, fetchNextPage } } = useGetSchoolsPag({
    search: debouncedSearchTerm,
    limit: 10,
    column: null,
    order: 'ASC',
    active,
    county: mun?.MUN_ID,
    typeSchool: typeSchool === 'PUBLICA' ? null : typeSchool,
    enabled,
    options: null
  });

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
      data-test='school'
      id="school"
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
      disabled={disabled}
      loading={isLoading}
      sx={{}}
      renderInput={(params) => <TextField size="small" {...params} label="Escola" />}
    />
  );
}
