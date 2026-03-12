import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useGetCountiesPag } from "src/services/municipios.service";
import useDebounce from "src/utils/use-debounce";

export function AutoCompletePagMun2({ 
  county,
  changeCounty,
  stateId = null,
  width = "100%",
  active = null,
  label = 'Município',
  disabled = false,
  isEpvPartner = null,
  countyBySearch = null,
}) {
  const [search, setSearch] = useState(null);
  const [limit, setLimit] = useState(false);
  const [position, setPosition] = useState(0);
  const [listboxNode, setListboxNode] = useState(null);
  
  const debouncedSearchTerm = useDebounce(search, 1000);

  const { flatData: listCounties, query: { isLoading, fetchNextPage } } = useGetCountiesPag({
    search: debouncedSearchTerm,
    limit: 999,
    column: null,
    order: 'ASC',
    stateId,
    active,
    isEpvPartner
  });

  useEffect(() => {
    if (listboxNode !== null) {
      listboxNode.scrollTop = position;
    }
  }, [position, listboxNode])

  useEffect(() => {
    if(countyBySearch && county){
      setSearch(county?.MUN_NOME)
    }
  },[listCounties]);
  
  const handleScroll = async (event) => {
    setListboxNode(event.currentTarget);

    const x = event.currentTarget.scrollTop + event.currentTarget.clientHeight;
  
    const position = event.currentTarget.scrollTop + event.currentTarget.clientHeight;
    if (event.currentTarget.scrollHeight - position <= 1 && !limit) {
      fetchNextPage();
      setPosition(x);
    }
  };

  return (
    <Autocomplete
      style={{width: width, background: "#FFF"}}
      className=""
      data-test='county'
      id="county"
      size="small"
      value={county}
      noOptionsText={label}
      options={listCounties}
      getOptionLabel={(option) =>  `${option?.MUN_NOME}`}
      onChange={(_event, newValue) => {
        changeCounty(newValue)}}
      onInputChange={(_event, newValue) => {
        setLimit(false)
        setSearch(newValue);
      }}
      ListboxProps={{
        onScroll: handleScroll
      }}
      disabled={disabled}
      loading={isLoading}
      sx={{
        "& .Mui-disabled": {
          background: "#D3D3D3",
        },
      }}
      renderInput={(params) => <TextField size="small" {...params} label={label} />}
    />
  );
}
