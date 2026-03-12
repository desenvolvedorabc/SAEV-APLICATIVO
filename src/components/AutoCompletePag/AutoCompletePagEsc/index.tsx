import { Autocomplete, TextField, ListItemText, ListItemIcon, Checkbox } from "@mui/material";
import { useState, useEffect } from "react";
import { getSchools } from "src/services/escolas.service";
import useDebounce from "src/utils/use-debounce";

export function AutoCompletePagEsc({ school, changeSchool, width = "100%", active = null, showAllOption = false }) {
  const [pageEsc, setPageEsc] = useState(1);
  const [searchEsc, setSearchEsc] = useState(null);
  const [limitEsc, setLimitEsc] = useState(false);
  const [listSchool, setListSchool] = useState([])
  const [position, setPosition] = useState(0);
  const [listboxNode, setListboxNode] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const debouncedSearchTerm = useDebounce(searchEsc, 1000);
  
  useEffect(() => {
    if (listboxNode !== null) {
      listboxNode.scrollTop = position;
    }
  }, [position, listboxNode])

  const loadEscolas = async () => {
      const resp = await getSchools(debouncedSearchTerm, pageEsc, 10, null, "ASC", null, null, active);
      
      setPageEsc(pageEsc + 1)
      
      if (totalCount === 0 || pageEsc === 1) {
        setTotalCount(resp.data.meta?.totalItems || resp.data.totalCount || resp.data.total || 0);
      }
      
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
  
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

  const handleChange = (event, newValue) => {
    if (newValue && newValue.ESC_ID === 'ALL') {
      setIsAllSelected(true);
      changeSchool({ ESC_ID: 'ALL', ESC_NOME: `Todas (${totalCount})` });
    } else {
      setIsAllSelected(false);
      changeSchool(newValue);
    }
  };

  const getOptions = () => {
    const options = [...listSchool];
    
    if (showAllOption) {
      const allOption = {
        ESC_ID: 'ALL',
        ESC_NOME: `Todas (${totalCount || 0})`
      };
      options.unshift(allOption);
    }
    
    return options;
  };

  return (
    <Autocomplete
      style={{width: width, background: "#FFF"}}
      className=""
      id="size-small-outlined"
      size="small"
      value={school}
      noOptionsText="Escola"
      options={getOptions()}
      getOptionLabel={(option) =>  `${option?.ESC_NOME}`}
      onChange={handleChange}
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
      renderOption={(props, option) => (
        <li {...props} key={option.ESC_ID}>
          {showAllOption && option.ESC_ID === 'ALL' ? (
            <>
              <ListItemIcon>
                <Checkbox checked={isAllSelected} />
              </ListItemIcon>
              <ListItemText primary={option.ESC_NOME} />
            </>
          ) : (
            <ListItemText primary={option.ESC_NOME} />
          )}
        </li>
      )}
    />
  );
}
