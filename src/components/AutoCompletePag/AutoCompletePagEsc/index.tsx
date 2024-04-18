import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { getSchools } from "src/services/escolas.service";
import useDebounce from "src/utils/use-debounce";

export function AutoCompletePagEsc({ school, changeSchool, width = "100%" }) {
  const [pageEsc, setPageEsc] = useState(1);
  const [searchEsc, setSearchEsc] = useState(null);
  const [limitEsc, setLimitEsc] = useState(false);
  const [listSchool, setListSchool] = useState([])
  const [position, setPosition] = useState(0);
  const [listboxNode, setListboxNode] = useState(null);

  const debouncedSearchTerm = useDebounce(searchEsc, 1000);
  
  useEffect(() => {
    if (listboxNode !== null) {
      listboxNode.scrollTop = position;
    }
  }, [position, listboxNode])

  const loadEscolas = async () => {
      const resp = await getSchools(debouncedSearchTerm, pageEsc, 10, null, "ASC", null, null);
      
      setPageEsc(pageEsc + 1)
  
      if(resp.data.items.length === 0) {
        setLimitEsc(true)
        return
      }
      setListSchool([...listSchool, ...resp.data.items]);
      // setEscolas(resp.data);
    
  }

  useEffect(() => {
    loadEscolas()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    
    if (debouncedSearchTerm) {
      setPageEsc(1)
      setListSchool([]);
      loadEscolas()
    } else {
      loadEscolas()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[debouncedSearchTerm]);
  
  const handleScrollEsc = async (event) => {
    setListboxNode(event.currentTarget);

    const x = event.currentTarget.scrollTop + event.currentTarget.clientHeight;
  
    const position = event.currentTarget.scrollTop + event.currentTarget.clientHeight;
    if (event.currentTarget.scrollHeight - position <= 1 && !limitEsc) {
      await loadEscolas()
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
        setPageEsc(1)
        setListSchool([])
        setLimitEsc(false)
        setSearchEsc(newValue);
      }}
      ListboxProps={{
        onScroll: handleScrollEsc
      }}
      // disabled={mun === null}
      sx={{
        "& .Mui-disabled": {
          background: "#D3D3D3",
        },
      }}
      renderInput={(params) => <TextField size="small" {...params} label="Escola" />}
    />
  );
}
