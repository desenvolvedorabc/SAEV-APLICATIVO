import { FormControl, TextField, Autocomplete } from "@mui/material";
import { CardSearch, Title } from "./styledComponents";
import { useState, useEffect } from "react";
import { getSchoolsTransfer } from "src/services/escolas.service";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import useDebounce from "src/utils/use-debounce";

enum SchoolType {
  ESTADUAL = "Estadual",
  MUNICIPAL = "Municipal",
}

export function NewTransfer({ changeSchool, changeSearch }) {
  const [school, setSchool] = useState(null);
  const [type, setType] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [pageEsc, setPageEsc] = useState(1);
  const [searchEsc, setSearchEsc] = useState(null);
  const [limitEsc, setLimitEsc] = useState(false);
  const [schoolList, setSchoolList] = useState([]);
  const [position, setPosition] = useState(0);
  const [listboxNode, setListboxNode] = useState(null);

  const debouncedSearchTerm = useDebounce(searchEsc, 500);

  const debouncedSearchTermSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    changeSearch(debouncedSearchTermSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTermSearch]);

  const handleChangeSchool = (newValue) => {
    setSchool(newValue);
  };

  const handleChangeSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (listboxNode !== null) {
      listboxNode.scrollTop = position;
    }
  }, [position, listboxNode]);

  const loadEscolas = async (changeType = false) => {
    const resp = await getSchoolsTransfer(
      debouncedSearchTerm,
      pageEsc,
      10,
      null,
      "ASC",
      "1",
      null,
      type
    );

    if (changeType) {
      setPageEsc(1);
      setSchoolList([...resp.data.items]);

      if (resp.data.items.length === 0) {
        setLimitEsc(true);
      }
      return;
    }

    setPageEsc(pageEsc + 1);

    if (resp.data.items.length === 0) {
      setLimitEsc(true);
      return;
    }
    setSchoolList([...schoolList, ...resp.data.items]);
  };

  useEffect(() => {
    loadEscolas(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleClick = () => {
    changeSchool(school?.ESC_ID);
  };

  const handleChangeType = (newValue: string) => {
    setType(newValue);
    setPageEsc(1);
    setSchoolList([]);
    handleChangeSchool(null);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      setPageEsc(1);
      setSchoolList([]);

      loadEscolas();
    } else {
      loadEscolas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleScrollEsc = async (event) => {
    setListboxNode(event.currentTarget);

    const x = event.currentTarget.scrollTop + event.currentTarget.clientHeight;

    if (event.currentTarget.scrollHeight - x <= 1 && !limitEsc) {
      await loadEscolas();
      setPosition(x);
    }
  };

  return (
    <>
      <CardSearch>
        <Title>Buscar aluno(a):</Title>
        <div className="d-flex gap-2 col-12">
          <div style={{ width: 150 }}>
            <Autocomplete
              className=""
              id="type"
              size="small"
              value={type}
              noOptionsText="Rede"
              options={["ESTADUAL", "MUNICIPAL"]}
              getOptionLabel={(option) => `${SchoolType[option]}`}
              onChange={(_event, newValue) => {
                handleChangeType(newValue);
              }}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Rede" />
              )}
            />
          </div>
          <FormControl size="small" className="mb-3 me-4 col-4">
            <Autocomplete
              style={{ background: "#FFF" }}
              className=""
              id="size-small-outlined"
              size="small"
              value={school}
              noOptionsText="Selecione a Escola de Origem (Opcional)"
              options={schoolList}
              getOptionLabel={(option) => option?.ESC_NOME}
              onChange={(_event, newValue) => {
                handleChangeSchool(newValue);
              }}
              onInputChange={(_event, newValue) => {
                setPageEsc(1);
                setSchoolList([]);
                setLimitEsc(false);
                setSearchEsc(newValue);
              }}
              ListboxProps={{
                onScroll: handleScrollEsc,
              }}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => (
                <TextField
                  size="small"
                  {...params}
                  label="Selecione a Escola de Origem (Opcional)"
                />
              )}
            />
          </FormControl>
          <div style={{ width: "150px !important" }}>
            <ButtonPadrao
              disable={!school}
              onClick={() => {
                handleClick();
              }}
            >
              Filtrar
            </ButtonPadrao>
          </div>
        </div>
        <div className="d-flex">
          <TextField
            fullWidth
            label="Buscar por Nome, INEP ou CPF"
            name="searchTerm"
            id="searchTerm"
            value={searchTerm}
            onChange={handleChangeSearchTerm}
            size="small"
          />
        </div>
      </CardSearch>
    </>
  );
}
