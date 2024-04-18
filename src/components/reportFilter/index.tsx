import { Autocomplete, Checkbox, TextField, createFilterOptions } from "@mui/material";
import { useState, useEffect } from "react";
import {
  getYearAssessment,
  getAllYearsAssessments,
} from "src/services/avaliaoces.service";
import { getSchools } from "src/services/escolas.service";
import { getSchoolClassSerie } from "src/services/turmas.service";
import {
  ButtonBox,
  Container,
  ContainerFilters,
  Filters,
  Series,
} from "./styledComponents";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { getCounties } from "src/services/municipios.service";
import { getAllSeries, getSeries } from "src/services/series.service";
import useDebounce from "src/utils/use-debounce";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox';

type FilterProps = {
  isEdition?: boolean;
  isSerie?: boolean;
  isDisable?: boolean;
  isDisableYear?: boolean;
  isDisableCounty?: boolean;
  isDisableSchool?: boolean;
  isYear?: boolean;
  isMultipleSeries?: boolean;
  isSerieFirst?: boolean;
  isSchoolClass?: boolean;
  setTypeTable?: (value: string) => void;
  buttonText?: string
  yearOrder?: 'ASC' | 'DESC'
};

export function ReportFilter({
  isYear = true,
  isEdition = true,
  isDisable = false,
  isSerie = false,
  isDisableYear = false,
  isDisableCounty = false,
  isDisableSchool = false,
  isMultipleSeries = false,
  isSerieFirst = false,
  isSchoolClass = true,
  setTypeTable,
  buttonText = 'Atualizar',
  yearOrder = 'ASC'
}: FilterProps) {
  const [yearsList, setYearsList] = useState([]);
  const [editionsList, setEditionsList] = useState([]);
  const [countiesList, setCountiesList] = useState([]);
  const [schoolsList, setSchoolsList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [listSeries, setListSeries] = useState([]);
  const [searchMun, setSearchMun] = useState(null);
  const [pageMun, setPageMun] = useState(1);
  const [limitMun, setLimitMun] = useState(false);
  const [positionMun, setPositionMun] = useState(0);
  const [listboxNodeMun, setListboxNodeMun] = useState(null);
  const [searchSchool, setSearchSchool] = useState(null);
  const [pageSchool, setPageSchool] = useState(1);
  const [limitSchool, setLimitSchool] = useState(false);
  const [positionSchool, setPositionSchool] = useState(0);
  const [listboxNodeSchool, setListboxNodeSchool] = useState(null);
  const [enabledSerie, setEnabledSerie] = useState(false);
  const {
    changeYear,
    changeCounty,
    changeEdition,
    changeSchool,
    changeSchoolClass,
    setIsUpdateData,
    serie,
    serieList,
    year,
    edition,
    county,
    school,
    changeSerie,
    changeSerieList,
    schoolClass,
    addBreadcrumbs,
    showBreadcrumbs,
    indexYear,
    indexCounty,
    indexEdition,
    indexSchool,
    clickBreadcrumb,
    indexSerie,
    handleUnClickBar,
    hideBreadcrumbs,
    handleClickBreadcrumb,
  } = useBreadcrumbContext();

  useEffect(() => {
    if(isMultipleSeries || isSerieFirst){
      loadAllSeries()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMultipleSeries, isSerieFirst]);

  const handleChangeSerieList = (newValue) => {
    changeSerieList(newValue);
    setEditionsList([]);
    setCountiesList([]);
    setPageMun(1);
    setSchoolsList([]);
    setClassList([]);
    changeYear(null);
    changeEdition(null);
    changeCounty(null);
    changeSchool(null);
    setSearchSchool(null);
    changeSchoolClass(null);
    handleClickBreadcrumb(null);
  };

  const handleChangeSerieFirst = (newValue) => {
    if (!isDisableCounty) {
      setCountiesList([]);
      changeCounty(null);
    }
    if (!isDisableSchool) {
      setSchoolsList([]);
      changeSchool(null);
    }
    setEditionsList([]);
    setPageMun(1);
    setClassList([]);

    changeSerie(newValue);
    changeYear(null);
    changeEdition(null);
    setSearchSchool(null);
    changeSchoolClass(null);
    handleClickBreadcrumb(null);
  };

  const handleChangeYear = (newValue) => {
    setEditionsList([]);
    if(!isDisableCounty){
      setCountiesList([]);
      setPageMun(1);
      changeCounty(null);
    }
    if(!isDisableSchool){
      setSchoolsList([]);
      changeSchool(null);
    }

    setClassList([]);
    if (isSerie) {
      setListSeries([]);
    }
    changeYear(newValue);
    changeEdition(null);
    setSearchSchool(null);
    changeSchoolClass(null);
    handleClickBreadcrumb(null);
    addBreadcrumbs(newValue?.ANO, newValue?.ANO, "year");
    if (isSerie) {
      changeSerie(null);
    }
  };

  const handleChangeEdition = (newValue) => {
    if (!isDisableCounty) {
      setCountiesList([]);
      setSchoolsList([]);
      changeCounty(null);
    }
    if (!isDisableSchool) {
      setCountiesList([]);
      setSchoolsList([]);
      changeSchool(null);
    }
    setClassList([]);
    if (isSerie) {
      setListSeries([]);
    }
    changeEdition(newValue);
    addBreadcrumbs(newValue?.AVA_ID, newValue?.AVA_NOME, "edition");
    setSearchSchool(null);
    changeSchoolClass(null);
    handleUnClickBar();
    handleClickBreadcrumb(null);
    if (isSerie) {
      changeSerie(null);
    }
  };

  const handleChangeCounty = (newValue) => {
    setClassList([]);
    if (isSerie) {
      setListSeries([]);
    }
    changeCounty(newValue);
    addBreadcrumbs(
      newValue?.AVM_MUN?.MUN_ID,
      newValue?.AVM_MUN?.MUN_NOME,
      "county"
    );
    if (!isDisableSchool) {
      changeSchool(null);
      setSearchSchool(null);
      setSchoolsList([]);
      setPageSchool(1);
    }
    if (!isDisableCounty) {
      setSearchSchool(null);
    }
    changeSchoolClass(null);
    handleUnClickBar();
    handleClickBreadcrumb(null);
    if (isSerie) {
      changeSerie(null);
    }
  };

  const handleSelectYearWithoutEdition = async () => {
    const resp = await getCounties(searchMun, pageMun, 25, null, "ASC", null);
    if(resp.data.items){
      setPageMun(pageMun + 1);
  
      if (resp?.data?.items?.length === 0) {
        setLimitMun(true);
        return;
      }
  
      const formattedData = resp?.data?.items?.map((x) => {
        return {
          AVM_MUN: {
            MUN_ID: x.MUN_ID,
            MUN_NOME: x.MUN_NOME,
          },
        };
      });
  
      setCountiesList([...countiesList, ...formattedData]);

    }
  };

  const handleChangeSchool = (newValue) => {
    setClassList([]);
    changeSchool(newValue);
    addBreadcrumbs(newValue?.ESC_ID, newValue?.ESC_NOME, "school");
    changeSchoolClass(null);
    handleUnClickBar();
    handleClickBreadcrumb(null);
    if (isSerie) {
      changeSerie(null);
    }
  };

  const handleChangeClass = (newValue) => {
    changeSchoolClass(newValue);
    addBreadcrumbs(newValue?.TUR_ID, newValue?.TUR_NOME, "schoolClass");
    handleUnClickBar();
    hideBreadcrumbs();
    handleClickBreadcrumb(null);
  };

  const loadAllSeries = async () => {
    const resp = await getAllSeries();
    if (resp.data) setListSeries(resp.data);
  };

  const loadSeries = async () => {
    const resp = await getSeries("", 1, 9999, "", "ASC", school?.ESC_ID);
    if (resp.data?.items) setListSeries(resp.data?.items);
  };

  const handleChangeSerie = (newValue) => {
    setClassList([]);
    changeSerie(newValue);
    addBreadcrumbs(newValue?.SER_ID, newValue?.SER_NOME, "serie");
    changeYear(year);
    changeSchoolClass(null);
  };

  useEffect(() => {
    if (clickBreadcrumb !== null) {
      if (indexSchool !== -1) {
        loadClass();
        if (isSerie) {
          changeSerie(null);
        }
        changeSchoolClass(null);
        return;
      }

      if (isSerie && indexSerie) {
        changeSchoolClass(null);
      }

      if (indexCounty !== -1) {        
        changeSchool(null);
        setSearchSchool(null);
        changeSchoolClass(null);
        if (isSerie) {
          changeSerie(null);
        }
        loadSchools();
        return;
      }

      if (indexEdition !== -1) {
        changeCounty(null);
        changeSchool(null);
        setSearchSchool(null);
        changeSchoolClass(null);
        if (isEdition) {
          let list = edition?.AVA_AVM?.sort((a, b) => a.AVM_MUN?.MUN_NOME.localeCompare(b.AVM_MUN?.MUN_NOME))
            
          setCountiesList(list);
        } else {
          handleSelectYearWithoutEdition();
        }
        return;
      }

      if (indexYear !== -1) {
        loadEditions();
        changeEdition(null);
        changeCounty(null);
        changeSchool(null);
        setSearchSchool(null);
      if (isSerie) {
          changeSerie(null);
        }
        changeSchoolClass(null);

        if (!isEdition) {
          changeEdition("fake");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickBreadcrumb]);

  useEffect(() => {
    if (school) {
      if (isSerie) {
        loadSeries();
      } else {
        loadClass();
      }
      changeSchoolClass(null);

      if (!isDisableSchool) return;
    }

    if (county) {
      setSearchSchool(null);
      changeSchoolClass(null);
      loadSchools();
      
      if (!isDisableCounty) {
        changeSchool(null);
        return
      }
    }

    if ((year && !isEdition) || (!isYear && !isEdition)) {
      handleSelectYearWithoutEdition();
    }

    if (edition?.AVA_AVM) {

      if (!isDisableSchool) {
        changeSchool(null);
        setSearchSchool(null);
      }
      if (!isDisableCounty) {
        changeCounty(null);
      }
      changeSchoolClass(null);
      let list = edition?.AVA_AVM?.sort((a, b) => a.AVM_MUN?.MUN_NOME?.toUpperCase().localeCompare(b.AVM_MUN?.MUN_NOME?.toUpperCase()))
      setCountiesList(list);
      return;
    }
    if (year || !isYear) {
      loadEditions();
      if (!isDisableSchool) {
        changeSchool(null);
        setSearchSchool(null);
      }
      if (!isDisableCounty) {
        changeCounty(null);
      }
      // changeEdition(null);
      changeSchoolClass(null);

      if (!isEdition) {
        changeEdition("fake");
      }
    }    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, edition, county, school]);

  useEffect(() => {    
    if (isSerie && !serie) {
      loadYears();
      return;
    }

    if (isSerie && serie) {
      loadClass();
      return;
    }
    loadYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serie, isSerie]);

  const loadYears = async () => {
    let list = []
    const resp = await getAllYearsAssessments();
    if (resp.data.length > 0)
    {
      let order = resp.data.sort((a, b) => b.ANO - a.ANO)

      list = order.filter(currentYear => currentYear.ANO <= new Date().getFullYear())
    }
     setYearsList(list);
  };

  const loadEditions = async () => {
    if (year?.ANO) {
      const resp = await getYearAssessment(year?.ANO);
      if (resp.data.length > 0) setEditionsList(resp.data);
    }
  };
  const loadSchools = async () => {
    if (county) {
      const resp = await getSchools(
        searchSchool,
        pageSchool,
        25,
        'ESC_NOME',
        "ASC",
        null,
        county?.AVM_MUN?.MUN_ID
      );

      const formattedSchools = resp.data.items.map((school) => {
        return {
          ESC_ID: school.ESC_ID,
          ESC_NOME: school.ESC_NOME,
        };
      });

      setSchoolsList([...schoolsList, ...formattedSchools]);

      if (resp.data.items.length === 0) {
        setLimitSchool(true);
        return;
      }
    }
  };

  const loadClass = async () => {
    if (school && school != " ") {
      let idSerie = serie?.SER_ID;
      if (isMultipleSeries) {
        idSerie = serieList?.map((serie) => serie.SER_ID);
      }
      const resp = await getSchoolClassSerie(school?.ESC_ID, idSerie, year?.ANO, null);
      if (resp.data?.status != 401) {
        setClassList(resp.data);
      }
    }
  };

  const handleUpdate = () => {
    showBreadcrumbs();
    setIsUpdateData(true);
  };

  useEffect(() => {
    if (listboxNodeMun !== null) {
      listboxNodeMun.scrollTop = positionMun;
    }
  }, [positionMun, listboxNodeMun]);

  const handleScrollMun = async (event) => {
      setListboxNodeMun(event.currentTarget);

      const x =
        event.currentTarget.scrollTop + event.currentTarget.clientHeight;

      if (event.currentTarget.scrollHeight - x <= 1 && !limitMun) {
        await handleSelectYearWithoutEdition();
        setPositionMun(x);
      }
  };

  useEffect(() => {
    if (listboxNodeSchool !== null) {
      listboxNodeSchool.scrollTop = positionSchool;
    }
  }, [positionSchool, listboxNodeSchool]);

  const handleScrollSchool = async (event) => {
    setListboxNodeSchool(event.currentTarget);

    const x = event.currentTarget.scrollTop + event.currentTarget.clientHeight;

    if (event.currentTarget.scrollHeight - x <= 1 && !limitSchool) {
      await loadSchools();
      setPositionSchool(x);
    }

    const listboxNode = event.currentTarget;

    const position = listboxNode.scrollTop + listboxNode.clientHeight;
    if (listboxNode.scrollHeight - position <= 1) {
      loadSchools();
    }
  };

  const [searchTermMun, setSearchTermMun] = useState(null);
  const debouncedSearchTermMun = useDebounce(searchTermMun, 500);

  useEffect(() => {
    setPageMun(1);
    setCountiesList([])
    if (debouncedSearchTermMun) {
      setSearchMun(debouncedSearchTermMun)
    }
    else
      setSearchMun("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[debouncedSearchTermMun]);

  useEffect(() => {
    handleSelectYearWithoutEdition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchMun]);

  const changeSearchMun = (newValue) => {
    setSearchTermMun(newValue);
  };

  const [searchTermSchool, setSearchTermSchool] = useState(null);
  const debouncedSearchTermSchool = useDebounce(searchTermSchool, 500);

  useEffect(() => {
    setPageSchool(1);
    
    setSchoolsList([])
    if (debouncedSearchTermSchool) {
      setSearchSchool(debouncedSearchTermSchool)
    }
    else
      setSearchSchool("")  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[debouncedSearchTermSchool]);

  useEffect(() => {
    loadSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchSchool]);

  const changeSearchSchool = (newValue) => {
    setSearchTermSchool(newValue);
    setLimitSchool(false)
  };

  const disableYear = () => {
    if (isMultipleSeries)
      return serieList.length === 0 ? serieList.length === 0 : false;
    if (isSerieFirst) {
      return serie === null;
    }
    if (!isSerie) return serie ? serie === null : false;
  };

  function disableSchoolPolicy(): boolean {
    if (!isEdition) {
      return (isDisableSchool ? true : isDisableCounty ? year === null || year === " " : county === null || county === " ")
    } else {
      return (isDisableSchool ? true : isDisableCounty ? edition === null || edition === " " : county === null || county === " ")
    }
  }
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <Container>
      <Filters>
        {isMultipleSeries && (
          <Series> 
          <Autocomplete
              multiple
              size="small"
              value={serieList}
              filterOptions={(options, params) => { // <<<--- inject the Select All option
                const filter = createFilterOptions()
                const filtered = filter(options, params)
                return [{ title: 'Selecionar todos', all: true }, ...filtered]
              }}
              // onChange={(event, newValue) => { setValue(newValue); }} <<<--- OLD
              onChange={(event, newValue) => {
                if (newValue.find(option => option.all))
                  return handleChangeSerieList(serieList.length === listSeries.length ? [] : listSeries)
          
                  handleChangeSerieList(newValue)
              }}
              options={listSeries}
              disableCloseOnSelect
              getOptionLabel={(option) => option.SER_NOME}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    // checked={selected} <<<--- OLD
                    checked={option.all ? !!(serieList.length === listSeries.length) : selected}
                  />
                  {option.title || option.SER_NOME}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Séries" placeholder="Séries" />
              )}
            />
            {/* <Autocomplete
              multiple
              className=""
              id="size-small-outlined"
              size="small"
              value={serieList}
              noOptionsText="Séries"
              options={listSeries}
              getOptionLabel={(option) => `${option.SER_NOME}`}
              onChange={(_event, newValue) => {
                handleChangeSerieList(newValue);
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Séries" />
              )}
            /> */}
          </Series>
          )}
          {isSerieFirst && 
            <Series>
              <Autocomplete
                className=""
                id="size-small-outlined"
                size="small"
                value={serie ? serie : null}
                noOptionsText="Série"
                options={listSeries}
                getOptionLabel={(option) => `${option?.SER_NOME}`}
                onChange={(_event, newValue) => {
                  handleChangeSerieFirst(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Série" />
                )}
              />
            </Series>
          }
        <ContainerFilters
          className={
            (!isEdition &&
              isSerie &&
              !isSerieFirst &&
              !isSchoolClass &&
              "not-class") ||
            (!isEdition && !isSerie && !isSerieFirst && "not-edition") ||
            (!isYear && "not-year") ||
            (isSerieFirst && "serie-first")
          }
        >
          
          {isYear && (
            <Autocomplete
              className=""
              id="size-small-outlined"
              size="small"
              value={year}
              noOptionsText="Ano"
              options={yearsList}
              getOptionLabel={(option) => `${option.ANO}`}
              onChange={(_event, newValue) => {
                handleChangeYear(newValue);
              }}
              disabled={disableYear() || isDisableYear}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Ano" />
              )}
            />
          )}
          {isEdition ? (
            <>
              <Autocomplete
                className=""
                id="size-small-outlined"
                size="small"
                value={edition}
                noOptionsText="Edição"
                options={editionsList}
                getOptionLabel={(option) => `${option.AVA_NOME}`}
                onChange={(_event, newValue) => {
                  handleChangeEdition(newValue);
                }}
                disabled={year === null || year === " "}
                sx={{
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Edição" />
                )}
              />
              <Autocomplete
                className=""
                id="size-small-outlined"
                size="small"
                value={county}
                noOptionsText="Município"
                options={countiesList}
                getOptionLabel={(option) => `${option?.AVM_MUN?.MUN_NOME}`}
                onChange={(_event, newValue) => {
                  handleChangeCounty(newValue);
                }}
                disabled={isDisableCounty ? true : edition === null || edition === " "}
                sx={{
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Município" />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option?.AVM_ID}>
                    {option?.AVM_MUN?.MUN_NOME}
                  </li>
                )}
              />
            </>)
            : (
              <Autocomplete
                className=""
                id="size-small-outlined"
                size="small"
                value={county}
                noOptionsText="Município"
                options={countiesList}
                getOptionLabel={(option) => `${option?.AVM_MUN?.MUN_NOME}`}
                onChange={(_event, newValue) => {
                  handleChangeCounty(newValue);
                }}
                onInputChange={(_event, newValue) => {
                    setPageMun(1);
                    setCountiesList([]);
                    setLimitMun(false);
                    changeSearchMun(newValue);
                }}
                ListboxProps={{
                  onScroll: handleScrollMun,
                }}
                disabled={isDisableCounty ? true : !isYear ? false : year == null || year == " "}
                sx={{
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Município" />
                )}
              />
          )}
          <Autocomplete
            className=""
            id="size-small-outlined"
            size="small"
            value={school}
            noOptionsText="Escola"
            options={schoolsList}
            getOptionLabel={(option) => `${option.ESC_NOME}`}
            onChange={(_event, newValue) => {
              handleChangeSchool(newValue);
            }}
            onInputChange={(_event, newValue) => {
              changeSearchSchool(newValue);
            }}
            ListboxProps={{
              onScroll: async (event) => {
                const listboxNode = event.currentTarget;
                if (
                  listboxNode.scrollTop + listboxNode.clientHeight ===
                  listboxNode.scrollHeight
                ) {
                  const top = listboxNode.scrollTop;
                  await handleScrollSchool;
                  listboxNode.scrollTo({ top });
                }
              },
            }}
            disabled={disableSchoolPolicy()}
            sx={{
              "& .Mui-disabled": {
                background: "#D3D3D3",
              },
            }}
            renderInput={(params) => (
              <TextField size="small" {...params} label="Escola" />
            )}
          />
          {isSerie && (
            <Autocomplete
              className=""
              id="size-small-outlined"
              size="small"
              value={serie ? serie : null}
              noOptionsText="Série"
              options={listSeries}
              getOptionLabel={(option) => `${option?.SER_NOME}`}
              onChange={(_event, newValue) => {
                handleChangeSerie(newValue);
              }}
              disabled={isDisableSchool ? year === null || year === " " : school === null || school === " "}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Série" />
              )}
            />
          )}
          {isSchoolClass && (
            <Autocomplete
              className=""
              id="size-small-outlined"
              size="small"
              value={schoolClass}
              noOptionsText="Turma"
              options={classList}
              getOptionLabel={(option) => `${option?.TUR_ANO ? option?.TUR_ANO + '-' : ''} ${option?.TUR_NOME}`}
              onChange={(_event, newValue) => {
                handleChangeClass(newValue);
              }}
              disabled={
                !isSerie ? school === null || school === " " : !serie?.SER_ID
              }
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Turma" />
              )}
            />
          )}
        </ContainerFilters>
      </Filters>
      <ButtonBox>
        <div style={{ width: 119 }}>
          <ButtonPadrao disable={isDisable} onClick={() => handleUpdate()}>
            {buttonText}
          </ButtonPadrao>
        </div>
      </ButtonBox>
    </Container>
  );
}
