import { Autocomplete, Checkbox, TextField, createFilterOptions } from "@mui/material";
import { useState, useEffect } from "react";
import {
  getAllYearsAssessments,
  useGetAssessments,
} from "src/services/avaliaoces.service";
import { getSchoolClassSerie } from "src/services/turmas.service";
import {
  ButtonBox,
  Container,
  ContainerFilters,
  ContainerFiltersBelow,
  Filters,
  Series,
} from "./styledComponents";
import { ButtonPadrao } from "src/components/buttons/buttonPadrao";
import { useBreadcrumbContext } from "src/context/breadcrumb.context";
import { getAllSeries, getSeries } from "src/services/series.service";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { AutoCompletePagMun2 } from "../AutoCompletePag/AutoCompletePagMun2";
import { useGetStates } from "src/services/estados.service";
import { useGetRegionaisByFilter } from "src/services/regionais-estaduais.service";
import { useRouter } from "next/router";
import { useAuth } from "src/context/AuthContext";
import { useGetSchools } from "src/services/escolas.service";

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
  isEpvFirst?: boolean;
  isSchoolClass?: boolean;
  setTypeTable?: (value: string) => void;
  buttonText?: string
  yearOrder?: 'ASC' | 'DESC'
  testActive?: '1' | '0' | null
  isSaev?: boolean
  isPublic?: boolean
  isCurrentYear?: boolean
};

enum enumType {
  ESTADUAL = 'Estadual',
  MUNICIPAL = 'Municipal',
  PUBLICA = 'Publica'
}

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
  isEpvFirst = false,
  isSchoolClass = true,
  setTypeTable,
  buttonText = 'Atualizar',
  yearOrder = 'ASC',
  testActive = null,
  isSaev = null,
  isPublic = true,
  isCurrentYear = false
}: FilterProps) {
  const [yearsList, setYearsList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [listSeries, setListSeries] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const router = useRouter();
  const { user } = useAuth()

  useEffect(() => {
    if(user){
      if(user?.USU_SPE?.role === 'MUNICIPIO_MUNICIPAL') setTypeList(['MUNICIPAL'])
      else if(user?.USU_SPE?.role === 'ESCOLA' ){
        setTypeList([user?.USU_ESC?.ESC_TIPO])
      } else {
        isPublic ? 
          setTypeList(['ESTADUAL', 'MUNICIPAL', 'PUBLICA']) : 
          setTypeList(['ESTADUAL', 'MUNICIPAL'])
      }
    }
  },[user])

  const {
    changeYear,
    changeState,
    changeStateRegional,
    changeCounty,
    changeCountyRegional,
    changeEdition,
    changeEpv,
    changeType,
    changeSchool,
    changeSchoolClass,
    setIsUpdateData,
    serie,
    serieList,
    year,
    edition,
    epv,
    type,
    state,
    stateRegional,
    county,
    countyRegional,
    school,
    changeSerie,
    changeSerieList,
    schoolClass,
    addBreadcrumbs,
    showBreadcrumbs,
    indexYear,
    indexEdition,
    indexState,
    indexStateRegional,
    indexCounty,
    indexRegionalSchool,
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
  
  useEffect(() => {
    if(isSaev)
      handleChangeEpv(null)
    else
      handleChangeEpv('Completo')
  },[isSaev])

  const handleChangeSerieList = (newValue, add = false) => {
    if(add){
      const serieIds = newValue.map(serie => serie.SER_ID)
      const url = window.location.href.split('?&serie=')
      const newUrl = url[0].concat('?&serie=' + serieIds)
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    changeSerieList(newValue);
    handleChangeYear(null)
    handleClickBreadcrumb(null);
  };

  const handleChangeSerieFirst = (newValue, add = false) => {
    if (!isDisableCounty) {
      changeCounty(null);
    }
    if (!isDisableSchool) {
      changeSchool(null);
    }
    if(add){
      const url = window.location.href.split('&serie=')
      const newUrl = url[0].concat('&serie=' + newValue?.SER_ID)
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    
    changeSerie(newValue);
    handleChangeYear(null)
    handleClickBreadcrumb(null);
  };

  const handleChangeYear = (newValue, add = false) => {
    changeYear(newValue);
    handleChangeEdition(null);
    if(isSaev && isEpvFirst)
      handleChangeEpv(null)

    if(add){
      let url
      let newUrl
      if(!serie){
        url = window.location.href.split('?&year=')
        newUrl = url[0].concat('?&year=' + newValue?.ANO)
      } else {
        url = window.location.href.split('&year=')
        newUrl = url[0].concat('&year=' + newValue?.ANO)
      }
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    handleClickBreadcrumb(null);
    addBreadcrumbs(newValue?.ANO, newValue?.ANO, "year");
  };

  const handleChangeEdition = (newValue, add = false) => {
    changeEdition(newValue);
    if(isSaev && !isEpvFirst){
      handleChangeEpv(null)
    }
    handleChangeType(null)
    if(add){
      const url = window.location.href.split('&edition=')
      const newUrl = url[0].concat('&edition=' + newValue?.Assessments_AVA_ID)
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    addBreadcrumbs(newValue?.Assessments_AVA_ID, newValue?.Assessments_AVA_NOME, "edition");
    handleUnClickBar();
    handleClickBreadcrumb(null);
  };

  const handleChangeEpv = (newValue, add = false) => {
    changeEpv(newValue);
    handleChangeType(null);
    handleChangeCounty(null)

    if(newValue === 'Exclusivo Epv'){
      // console.log('router.query.countyId :', router.query.countyId);
      // if(router.query.countyId && router.query.countyName){
      //   handleChangeCounty({MUN_ID: router.query.countyId, MUN_NOME: router.query.countyName})
      // } else {
      //   handleChangeCounty(null)
      // };
    }

    isEpvFirst && handleChangeEdition(null);
    // addBreadcrumbs(
    //   newValue,
    //   newValue,
    //   "epv",
    // );
    if(add){
      const url = window.location.href.split('&epv=')
      const newUrl = url[0].concat('&epv=' + newValue)
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    handleUnClickBar();
    handleClickBreadcrumb(null);
    addBreadcrumbs(edition?.Assessments_AVA_ID, edition?.Assessments_AVA_NOME, "edition");
  };

  const handleChangeType = (newValue, add = false) => {
    changeType(newValue);
    handleChangeState(null)
    
    if(add){
      let url
      let newUrl
      if(!isYear && !isEdition && !isSaev){
        url = window.location.href.split('?&type=')
        newUrl = url[0].concat('?&type=' + newValue)
      } else {
        url = window.location.href.split('&type=')
        newUrl = url[0].concat('&type=' + newValue)
      }
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    if(!isSaev){
      handleUnClickBar();
      handleClickBreadcrumb(null);
      addBreadcrumbs(edition?.Assessments_AVA_ID, edition?.Assessments_AVA_NOME, "edition");
    }
  };

  const handleChangeState = (newValue, add = false) => {
    changeState(newValue);
    handleChangeStateRegional(null)
    if(add){
      const url = window.location.href.split('&state=')
      const newUrl = url[0].concat('&state=' + newValue?.id)
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    addBreadcrumbs(
      newValue?.id,
      newValue?.name,
      "state"
    );
    handleUnClickBar();
    handleClickBreadcrumb(null);
  };

  const handleChangeStateRegional = (newValue, add = false) => {
    changeStateRegional(newValue);
    handleChangeCounty(null)
    if(add){
      const url = window.location.href.split('&stateRegional=')
      const newUrl = url[0].concat('&stateRegional=' + newValue?.id)
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    addBreadcrumbs(
      newValue?.id,
      newValue?.name,
      "regional"
    );
    handleUnClickBar();
    handleClickBreadcrumb(null);
  };
  const handleChangeCounty = (newValue, add = false) => {
  console.log('newValueCounty :', newValue);
    changeCounty(newValue);
    if (!isDisableSchool) {
      handleChangeSchool(null)
    }
    handleChangeCountyRegional(null)
    if(add){
      const url = window.location.href.split('&countyId=')
      const newUrl = url[0].concat('&countyId=' + newValue?.MUN_ID + '&countyName=' + newValue?.MUN_NOME)
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    addBreadcrumbs(
      newValue?.MUN_ID,
      newValue?.MUN_NOME,
      "county"
    );
    handleUnClickBar();
    handleClickBreadcrumb(null);
  };

  const callHandleChangeCounty = (newValue) => {
    handleChangeCounty(newValue, true);
  }

  const handleChangeCountyRegional = (newValue, add = false) => {
    changeCountyRegional(newValue);
    handleChangeSchool(null)
    if(add){
      const url = window.location.href.split('&countyRegional=')
      const newUrl = url[0].concat('&countyRegional=' + newValue?.id)
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    addBreadcrumbs(
      newValue?.id,
      newValue?.name,
      "regionalSchool"
    );
    handleUnClickBar();
    handleClickBreadcrumb(null);
  };

  const handleChangeSchool = (newValue, add = false) => {
    changeSchool(newValue);
    console.log('newValueSchool :', newValue);
    if (isSerie) {
      changeSerie(null);
      loadSeries();
    }
    loadClass(newValue);
    handleChangeClass(null);

    if(add){
      const url = window.location.href.split('&school=')
      const newUrl = url[0].concat('&school=' + newValue?.ESC_ID)
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    addBreadcrumbs(newValue?.ESC_ID, newValue?.ESC_NOME, "school");
    handleUnClickBar();
    handleClickBreadcrumb(null);
  };

  const handleChangeClass = (newValue, add = false) => {
    changeSchoolClass(newValue);
    if(add){
      const url = window.location.href.split('&schoolClass=')
      const newUrl = url[0].concat('&schoolClass=' + newValue?.TUR_ID)
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    addBreadcrumbs(newValue?.TUR_ID, newValue?.TUR_NOME, "schoolClass");
    handleUnClickBar();
    hideBreadcrumbs();
    handleClickBreadcrumb(null);
  };

  const loadAllSeries = async () => {
    const resp = await getAllSeries("1");
    if (resp.data) {
      setListSeries(resp.data)
      if(router.query.serie){
        if(isMultipleSeries){
          const listIds = router.query.serie?.toString().split(",")
          const list = resp.data.filter((serie) => 
            listIds.find((_ser) => {
              return _ser == serie.SER_ID
            })
          )
          changeSerieList(list)
        } else if(!isSerie){
          handleChangeSerieFirst(resp.data.find(_serie => _serie.SER_ID == router.query.serie))          
        }
      }
    };
  };

  const loadSeries = async () => {
    const resp = await getSeries("", 1, 9999, "", "ASC", school?.ESC_ID, "1");
    if (resp.data?.items){
      setListSeries(resp.data?.items)
    };
  };

  const handleChangeSerie = (newValue, add = false) => {
    changeSerie(newValue);
    changeSchoolClass(null);
    if(add){
      const url = window.location.href.split('&serie=')
      const newUrl = url[0].concat('&serie=' + newValue?.SER_ID)
      window.history.pushState({ path: newUrl }, '', newUrl);

      addBreadcrumbs(newValue?.SER_ID, newValue?.SER_NOME, "serie");
      handleUnClickBar();
      handleClickBreadcrumb(null);
    }
  };

  useEffect(() => {
    if (clickBreadcrumb !== null) {
      
      if (isSerie && indexSerie !== -1) {
        handleChangeClass(null);
        return
      }

      if (indexSchool !== -1) {
        loadClass(school);
        if (isSerie) {
          changeSerie(null);
        }
        handleChangeClass(null);
        return;
      }


      if (indexRegionalSchool !== -1) {     
        handleChangeSchool(null);
        return;
      }

      if (indexCounty !== -1) {     
        handleChangeCountyRegional(null);
        return;
      }

      if (indexStateRegional !== -1) {     
        handleChangeCounty(null);
        return;
      }

      if (indexState !== -1) {     
        handleChangeStateRegional(null);
        return;
      }

      if (indexEdition !== -1) {
        handleChangeEpv(null);
        return;
      }

      if (indexYear !== -1) {
        handleChangeEdition(null);
      // if (isSerie) {
      //     changeSerie(null);
      //   }
        changeSchoolClass(null);

        if (!isEdition) {
          changeEdition("fake");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickBreadcrumb]);

  useEffect(() => {
    if (isSerie && serie) {
      loadClass(school);
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

      list = order.filter(currentYear => isCurrentYear ? currentYear.ANO == new Date().getFullYear() : currentYear.ANO <= new Date().getFullYear())
    }
     setYearsList(list);
  };

  const { data: editionsList, isLoading: isLoadingEditions } = useGetAssessments(null, 1, 999999, null, 'ASC', null, null, serie?.SER_ID, null, year?.ANO, !!year && isEdition);

  useEffect(() => {
    if(router.query.year && router.query.year !== 'undefined' && ((serie && !isSerie) || serieList)
    // && isFirstLoadYear
    ){
      handleChangeYear(yearsList.find(_year => _year.ANO === router.query.year))
      // setIsFirstLoadYear(false);

      if(!isEdition || isEpvFirst){
        if(router.query.epv
          //  && isFirstLoadEpv
          ){
          handleChangeEpv(router.query.epv)
          // setIsFirstLoadEpv(false);
        }
      }
    }
  },[yearsList, router.query.year])

  useEffect(() =>{
    if(editionsList?.items?.length > 0 && router.query.edition !== 'undefined' && year
      //  && isFirstLoadEdition
      ){
      // setIsFirstLoadEdition(false)
      handleChangeEdition(editionsList?.items.find(_edition => _edition.Assessments_AVA_ID == router.query.edition))
    }
    if(isEpvFirst){
      if(router.query.countyId && router.query.countyName && epv === 'Exclusivo Epv'
        //  && isFirstLoadCounty
        ){
        // setIsFirstLoadCounty(false)
        handleChangeCounty({MUN_ID: router.query.countyId, MUN_NOME: router.query.countyName})
      }
    }
  }, [editionsList, router.query.edition])

  useEffect(() =>{
    if(router.query.epv && edition
      //  && isFirstLoadEdition
      ){
      // setIsFirstLoadEdition(false)
      if(!isEpvFirst){
        handleChangeEpv(router.query.epv)
      }
    }
    if(!isSaev && edition && router.query.type){
      handleChangeType(router.query.type)
    }
  }, [edition, router.query.epv, router.query.type])

  useEffect(() =>{
    if(epv){
      if(isEpvFirst){
        if(editionsList?.items?.length > 0 && router.query.edition !== 'undefined' && year)
        {
          handleChangeEdition(editionsList?.items.find(_edition => _edition.Assessments_AVA_ID == router.query.edition))
        }
        if(epv === 'Exclusivo Epv'){
          handleChangeEdition(null)
          if(router.query.countyId && router.query.countyName){
            handleChangeCounty({MUN_ID: router.query.countyId, MUN_NOME: router.query.countyName})
          }
        }
      } else {
        if(router.query.type && epv === 'Completo'){
          handleChangeType(router.query.type)
        }
        if(router.query.countyId && router.query.countyName && epv === 'Exclusivo Epv'){
          handleChangeCounty({MUN_ID: router.query.countyId, MUN_NOME: router.query.countyName})
        }
      }
    }
  }, [epv, router.query.edition, router.query.type, router.query.countyId])

  const { data: states, isLoading: isLoadingStates } = useGetStates();

  useEffect(() =>{
    if(states?.length > 0 && router.query.state !== 'undefined' && type)
    {
      handleChangeState(states.find(_state => _state.id == router.query.state))
    }
  }, [states, type, router.query.state])

  const { data: stateRegionals, isLoading: isLoadingStateRegionals } = useGetRegionaisByFilter(null, 1, 9999999, null, 'ASC', null, state?.id, 'ESTADUAL', type === 'PUBLICA' ? null : type);
  useEffect(() =>{
    if(stateRegionals?.items?.length > 0 && router.query.stateRegional && router.query.stateRegional !== 'undefined' && state)
    {
      const findStateRegional = stateRegionals?.items?.find(_stateRegional => _stateRegional.id == router.query.stateRegional)
      handleChangeStateRegional(findStateRegional)

    }
  }, [stateRegionals, router.query.stateRegional])

  useEffect(() =>{
    changeStateRegional(stateRegionals?.items?.find(_stateRegional => _stateRegional.id == stateRegional?.id))
    if(epv === 'Completo' && stateRegional
      //  && isFirstLoadStateRegional
      ){
      // setIsFirstLoadStateRegional(false)
      if(router.query.countyId && router.query.countyId !== 'undefined'
        //  && isFirstLoadCounty
        ){
        // setIsFirstLoadCounty(false)
        handleChangeCounty(stateRegional?.counties?.find(_county => _county?.MUN_ID == router.query.countyId))
      }
    }
  },[stateRegional, router.query.countyId])
  
  const { data: countyRegionals, isLoading: isLoadingCountyRegionals } = useGetRegionaisByFilter(null, 1, 9999999, null, 'ASC', county?.MUN_ID, null, epv === 'Exclusivo Epv' ? 'MUNICIPAL' : type === 'PUBLICA' ? null : type === 'ESTADUAL' ? 'UNICA' : 'MUNICIPAL', type === 'PUBLICA' ? null : type, !!county);

  const { data: allCountySchools, isLoading: isLoadingAllCountySchools } = useGetSchools({
    search: null,
    page: 1,
    limit: 9999999,
    column: 'ESC_NOME',
    order: 'ASC',
    county: county?.MUN_ID,
    active: '1',
    enabled: !!county && !!countyRegional && !countyRegional?.id && countyRegional?.name === 'TODAS',
  });

  useEffect(() =>{
    if(countyRegionals?.items?.length > 0 && router.query.countyRegional !== 'undefined' && county && !countyRegional){
      if(router.query.countyRegional === 'null' || router.query.countyRegional === null){
        handleChangeCountyRegional({ id: null, name: 'TODAS', schools: [] })
      } else {
        const findCountyRegional = countyRegionals?.items?.find(_countyRegional => _countyRegional.id == router.query.countyRegional)
        handleChangeCountyRegional(findCountyRegional)
      }
    }
  }, [countyRegionals, county, router.query.countyRegional])

  useEffect(() =>{
    if(countyRegional?.id === null && countyRegional?.name === 'TODAS'){
    } else {
      changeCountyRegional(countyRegionals?.items?.find(_countyRegional => _countyRegional.id == countyRegional?.id))
    }
    if(countyRegional){
      if(router.query.school && router.query.school !== 'undefined'){
        handleChangeSchool(countyRegional?.schools?.find(_school => _school?.ESC_ID == router.query.school))
      }
    }
  },[countyRegional, router.query.school])

  useEffect(() =>{
    if(router.query.schoolClass && router.query.schoolClass !== 'undefined' && school && !isSerie
      //  && isFirstLoadSchoolClass
      ){
      // setIsFirstLoadSchoolClass(false)
      handleChangeClass(classList?.find(_schoolClass => _schoolClass?.TUR_ID == router.query.schoolClass))
    }
  },[school, classList, router.query.schoolClass])

  useEffect(() =>{
    if(router.query.serie && router.query.serie !== 'undefined' && school && listSeries?.length > 0){
      handleChangeSerie(listSeries.find(_serie => _serie.SER_ID == router.query.serie))
    }
  },[school, listSeries, router.query.serie])

  useEffect(() => {
    if(school){
      loadClass(school)
    }
  },[school])

  const loadClass = async (_school) => {
    if(_school){
      let idSerie = serie?.SER_ID;
      if (isMultipleSeries) {
        idSerie = serieList?.map((serie) => serie.SER_ID);
      }
      const resp = await getSchoolClassSerie(_school?.ESC_ID, idSerie, year?.ANO, testActive);
      if (resp.data?.status != 401) {
        setClassList(resp.data);
  
        if(router.query.schoolClass && router.query.schoolClass !== 'undefined' && _school
          //  && isFirstLoadSchoolClass
          ){
          // setIsFirstLoadSchoolClass(false)
          handleChangeClass(resp.data.find(_schoolClass => _schoolClass?.TUR_ID == router.query.schoolClass))
        }
      }
    }
  };

  const handleUpdate = () => {
    showBreadcrumbs();
    setIsUpdateData(true);
  };

  const disableYear = () => {
    if (isMultipleSeries)
      return serieList.length === 0 ? serieList.length === 0 : false;
    if (isSerieFirst) {
      return serie === null;
    }
    if (!isSerie) return serie ? serie === null : false;
  };

  const disableCounty = () => {
    if(isDisableCounty){
      return true;
    }
    if(epv === 'Exclusivo Epv') {
      if(isEpvFirst){
        return !edition
      } else {
        return !epv
      }
    } else {
      return !stateRegional
    } 
  }

  function disableSchoolPolicy(): boolean {
    if (!isEdition) {
      return (isDisableSchool ? true : isDisableCounty ? year === null || year === " " : countyRegional === null || countyRegional === undefined)
    } else {
      return (isDisableSchool ? true : isDisableCounty ? edition === null || edition === " " : countyRegional === null || countyRegional === undefined)
    }
  }

  const disableRede = () => {
    if(!isSaev){
      if(isEdition && !edition){
        return true
      } else if(!isEdition && !isYear){
        return false
      } else if(!isEdition && !year) {
        return true
      }
    } else {
      if(isEpvFirst){
        if(!edition || epv === 'Exclusivo Epv'){
          return true
        } 
      } else {
        if(!epv || epv === 'Exclusivo Epv'){
          return true
        } 
      }
    } 
    
    return false
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
                  return handleChangeSerieList(serieList.length === listSeries.length ? [] : listSeries, true)

                handleChangeSerieList(newValue, true)
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
                  handleChangeSerieFirst(newValue, true);
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
              !isSchoolClass && isYear
              ) ? "not-class" :
            (!isEdition && !isSerieFirst && isYear) ? "not-edition" :
            (!isYear) ? "not-year" :
            (isSerieFirst) ? "serie-first" : !isSaev && "not-edition"
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
                handleChangeYear(newValue, true);
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
          {isSaev && isEpvFirst &&
            <Autocomplete
              className=""
              id="size-small-outlined"
              size="small"
              value={epv}
              disableClearable={true}
              noOptionsText="EPV (SAEV)"
              options={['Exclusivo Epv', 'Completo']}
              onChange={(_event, newValue) => {
                handleChangeEpv(newValue, true);
              }}
              disabled={!year}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="EPV (SAEV)" />
              )}
            />
          }
          {isEdition && (
            <>
              <Autocomplete
                className=""
                id="size-small-outlined"
                size="small"
                value={edition}
                noOptionsText="Edição"
                options={editionsList?.items || []}
                getOptionLabel={(option) => `${option.Assessments_AVA_NOME}`}
                onChange={(_event, newValue) => {
                  handleChangeEdition(newValue, true);
                }}
                disabled={isEpvFirst ? isSaev ? !epv : !year : !year}
                sx={{
                  "& .Mui-disabled": {
                    background: "#D3D3D3",
                  },
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Edição" />
                )}
              />
            </>
            )
          }
          {isSaev && !isEpvFirst &&
            <Autocomplete
              className=""
              id="size-small-outlined"
              size="small"
              value={epv}
              noOptionsText="EPV (SAEV)"
              disableClearable={true}
              options={['Exclusivo Epv', 'Completo']}
              onChange={(_event, newValue) => {
                handleChangeEpv(newValue, true);
              }}
              disabled={!isYear ? false : isEdition ? !edition : !year}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="EPV (SAEV)" />
              )}
            />
          }
          <Autocomplete
            className=""
            id="type"
            size="small"
            value={type}
            noOptionsText="Rede"
            options={typeList}
            getOptionLabel={(option) => `${enumType[option]}`}
            onChange={(_event, newValue) => {
              handleChangeType(newValue, true);
            }}
            disabled={disableRede()}
            sx={{
              "& .Mui-disabled": {
                background: "#D3D3D3",
              },
            }}
            renderInput={(params) => (
              <TextField size="small" {...params} label="Rede" />
            )}
          />
          <Autocomplete
            fullWidth
            className=""
            data-test='state'
            id="state"
            size="small"
            value={state}
            noOptionsText="Estado"
            options={states}
            loading={isLoadingStates}
            getOptionLabel={option => option.name}
            disabled={!type || epv === 'Exclusivo Epv'}
            onChange={(_event, newValue) => {
              handleChangeState(newValue, true)
            }}
            renderInput={(params) => <TextField size="small" {...params} label="Estado" />}
            sx={{
              "& .Mui-disabled": {
                background: "#D3D3D3",
              },
            }}
          />
          <Autocomplete
            fullWidth
            className=""
            data-test='stateRegional'
            id="stateRegional"
            size="small"
            value={stateRegional}
            noOptionsText="Regionais Estaduais"
            options={stateRegionals?.items || []}
            loading={isLoadingStateRegionals}
            getOptionLabel={option => option.name}
            disabled={!state || epv === 'Exclusivo Epv'}
            onChange={(_event, newValue) => {
              handleChangeStateRegional(newValue, true)
            }}
            renderInput={(params) => <TextField size="small" {...params} label="Regionais Estaduais" />}
            sx={{
              "& .Mui-disabled": {
                background: "#D3D3D3",
              },
            }}
          />
        </ContainerFilters>
        <ContainerFiltersBelow className={isSerie && 'is-serie'}>
          {epv === 'Exclusivo Epv' ?
            <AutoCompletePagMun2 county={county} changeCounty={callHandleChangeCounty} stateId={null} active={1} disabled={disableCounty()} isEpvPartner={1} countyBySearch={false} />
          :
            <Autocomplete
              className=""
              id="size-small-outlined"
              size="small"
              value={county}
              noOptionsText="Município"
              options={stateRegional?.counties || []}
              getOptionLabel={(option) => `${option?.MUN_NOME}`}
              onChange={(_event, newValue) => {
                handleChangeCounty(newValue, true);
              }}
              disabled={disableCounty()}
              sx={{
                "& .Mui-disabled": {
                  background: "#D3D3D3",
                },
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Município" />
              )}
            />
          }
          <Autocomplete
            fullWidth
            className=""
            data-test='countyRegional'
            id="countyRegional"
            size="small"
            value={countyRegional}
            noOptionsText="Regionais Municipais / Únicas"
            options={countyRegionals?.items?.length > 0 ? [{ id: null, name: 'TODAS', schools: [] }, ...countyRegionals.items] : []}
            loading={isLoadingCountyRegionals}
            getOptionLabel={option => option?.name || ''}
            isOptionEqualToValue={(option, value) => option?.id === value?.id && option?.name === value?.name}
            disabled={!county}
            onChange={(_event, newValue) => {
              handleChangeCountyRegional(newValue, true)
            }}
            renderInput={(params) => <TextField size="small" {...params} label="Regionais Municipais / Únicas" />}
            sx={{
              "& .Mui-disabled": {
                background: "#D3D3D3",
              },
            }}
          />
          {/*  */}
          <Autocomplete
            className=""
            id="school"
            size="small"
            value={school}
            noOptionsText="Escola"
            options={!countyRegional?.id && countyRegional?.name === 'TODAS' ? (allCountySchools?.data || []) : (countyRegional?.schools || [])}
            loading={!countyRegional?.id && countyRegional?.name === 'TODAS' ? isLoadingAllCountySchools : false}
            getOptionLabel={(option) => `${option.ESC_NOME}`}
            onChange={(_event, newValue) => {
              handleChangeSchool(newValue, true);
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
              id="serie"
              size="small"
              value={serie ? serie : null}
              noOptionsText="Série"
              options={listSeries}
              getOptionLabel={(option) => `${option?.SER_NOME}`}
              onChange={(_event, newValue) => {
                handleChangeSerie(newValue, true);
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
              id="schoolClass"
              size="small"
              value={schoolClass}
              noOptionsText="Turma"
              options={classList}
              getOptionLabel={(option) => `${option?.TUR_ANO ? option?.TUR_ANO + '-' : ''} ${option?.TUR_NOME}`}
              onChange={(_event, newValue) => {
                handleChangeClass(newValue, true);
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
        </ContainerFiltersBelow>
      </Filters>
      <ButtonBox>
        <div style={{ width: 119 }}>
          <ButtonPadrao 
            disable={isDisable} 
            onClick={() => {
              handleUpdate()
            }}>
            {buttonText}
          </ButtonPadrao>
        </div>
      </ButtonBox>
    </Container>
  );
}
