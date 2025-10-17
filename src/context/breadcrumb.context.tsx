import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

const positions = {
  year: 1,
  edition: 2,
  // epv: 3,
  // type: 4,
  state: 5,
  regional: 6,
  county: 7,
  regionalSchool: 8,
  school: 9,
  serie: 10,
  schoolClass: 11,
};

type breadcrumbContextType = {
  breadcrumb: any[];
  mapBreadcrumb: any[];
  addBreadcrumbs: (id: string, name: string, level: string) => void;
  subtractBreadcrumbs: (id: string, level: string) => void;
  resetBreadcrumbs: () => void;
  changeSerie: (serie: any) => void;
  changeSerieList: (serie: string[]) => void;
  changeYear: (year: string) => void;
  changeEdition: (edition: any) => void;
  changeEpv: (epv: any) => void;
  changeType: (type: any) => void;
  changeState: (state: any) => void;
  changeStateRegional: (stateRegional: any) => void;
  changeCounty: (county: any) => void;
  changeCountyRegional: (countyRegional: any) => void;
  changeSchool: (school: any) => void;
  changeSchoolClass: (schoolClass: any) => void;
  showBreadcrumbs: () => void;
  hideBreadcrumbs: () => void;
  handleClickBar: () => void;
  handleClickBreadcrumb: (clickBreadcrumb: boolean) => void;
  handleUnClickBar: () => void;
  setIsUpdateData: (value: boolean) => void;
  clickBar: boolean;
  clickBreadcrumb: boolean;
  visibleBreadcrumbs: boolean;
  serie: any;
  serieList: any;
  year: any;
  edition: any;
  epv: string;
  type: string;
  state: any;
  stateRegional: any;
  county: any;
  countyRegional: any;
  school: any;
  schoolClass: any;
  indexYear: number;
  indexEdition: number;
  indexEpv: number;
  indexType: number;
  indexState: number;
  indexStateRegional: number;
  indexCounty: number;
  indexRegionalSchool: number;
  indexSerie: number;
  indexSchool: number;
  indexSchoolClass: number;
  isUpdateData: boolean;
};

const breadcrumbContextDefaultValues: breadcrumbContextType = {
  breadcrumb: [],
  mapBreadcrumb: [],
  addBreadcrumbs: () => {
    /* TODO document why this method 'addBreadcrumbs' is empty */
  },
  subtractBreadcrumbs: () => {
    /* TODO document why this method 'subtractBreadcrumbs' is empty */
  },
  resetBreadcrumbs: () => {
    /* TODO document why this method 'resetBreadcrumbs' is empty */
  },
  changeSerie: () => {
    /* TODO document why this method 'changeSerie' is empty */
  },
  changeSerieList: () => {
    /* TODO document why this method 'changeSerie' is empty */
  },
  changeYear: () => {
    /* TODO document why this method 'changeYear' is empty */
  },
  changeEdition: () => {
    /* TODO document why this method 'changeEdition' is empty */
  },
  changeEpv: () => {
    /* TODO document why this method 'changeEpv' is empty */
  },
  changeType: () => {
    /* TODO document why this method 'changeType' is empty */
  },
  changeState: () => {
    /* TODO document why this method 'changeState' is empty */
  },
  changeStateRegional: () => {
    /* TODO document why this method 'changeStateRegional' is empty */
  },
  changeCounty: () => {
    /* TODO document why this method 'changeCounty' is empty */
  },
  changeCountyRegional: () => {
    /* TODO document why this method 'changeCountyRegional' is empty */
  },
  changeSchool: () => {
    /* TODO document why this method 'changeSchool' is empty */
  },
  changeSchoolClass: () => {
    /* TODO document why this method 'changeSchoolClass' is empty */
  },
  showBreadcrumbs: () => {
    /* TODO document why this method 'showBreadcrumbs' is empty */
  },
  hideBreadcrumbs: () => {
    /* TODO document why this method 'hideBreadcrumbs' is empty */
  },
  handleClickBar: () => {
    /* TODO document why this method 'handleClickBar' is empty */
  },
  handleUnClickBar: () => {
    /* TODO document why this method 'handleUnClickBar' is empty */
  },
  handleClickBreadcrumb: () => {
    /* TODO document why this method 'handleClickBreadcrumb' is empty */
  },
  setIsUpdateData: () => {},
  serie: null,
  serieList: [],
  year: null,
  edition: null,
  epv: null,
  type: null,
  state: null,
  stateRegional: null,
  county: null,
  countyRegional: null,
  school: null,
  schoolClass: null,
  indexYear: null,
  indexEdition: null,
  indexEpv: null,
  indexType: null,
  indexState: null,
  indexStateRegional: null,
  indexCounty: null,
  indexRegionalSchool: null,
  indexSchool: null,
  indexSerie: null,
  isUpdateData: null,
  indexSchoolClass: null,
  visibleBreadcrumbs: false,
  clickBar: false,
  clickBreadcrumb: false,
};

const BreadcrumbContext = createContext<breadcrumbContextType>(breadcrumbContextDefaultValues);

export function useBreadcrumbContext() {
  return useContext(BreadcrumbContext);
}

export function BreadcrumbProvider({ children }: Props) {
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [mapBreadcrumb, setMapBreadcrumbs] = useState([]);
  const [isUpdateData, setIsUpdateData] = useState(false);
  const [serie, setSerie] = useState(null);
  const [serieList, setSerieList] = useState([]);
  const [year, setYear] = useState(null);
  const [edition, setEdition] = useState(null);
  const [epv, setEpv] = useState(null);
  const [type, setType] = useState(null);
  const [state, setState] = useState(null);
  const [stateRegional, setStateRegional] = useState(null);
  const [county, setCounty] = useState(null);
  const [countyRegional, setCountyRegional] = useState(null);
  const [school, setSchool] = useState(null);
  const [schoolClass, setSchoolClass] = useState(null);
  const [visibleBreadcrumbs, setVisibleBreadcrumbs] = useState(null);
  const [clickBar, setClickBar] = useState(null);
  const [clickBreadcrumb, setClickBreadcrumb] = useState(null);

  console.log('breadcrumb1', breadcrumb)
  console.log('mapBreadcrumb1', mapBreadcrumb)

  const addBreadcrumbs = (_id: string, _name: string, _level: string) => {
    let exist = false;
    let position = 0;
    let find = false;

    for (const element of breadcrumb) {
      if (element.level === _level) {
        exist = true;
      }
    }

    for (const element of breadcrumb) {
      if (element.level === _level) {
        let newBreadcrumb = breadcrumb.map((el, index) => {
          if (el.level === _level) {
            position = index;
            find = true;
            return { ...el, id: _id, name: _name };
          } else return el;
        });
        find
          ? setBreadcrumb(newBreadcrumb.slice(0, position + 1))
          : setBreadcrumb(newBreadcrumb);

        // console.log('new breadcrumb', newBreadcrumb);
      }
    }

    if (_id && exist === false) {
      setBreadcrumb([
        ...breadcrumb,
        { id: _id, name: _name, level: _level, position: positions[_level] },
      ]);
    }

    const verify = breadcrumb.find((data) => data.position > positions[_level]);

    if (verify) {
      setBreadcrumb((oldValue) =>
        oldValue.filter((data) => data.position <= positions[_level])
      );
    }

    if (!_id) {
      setBreadcrumb((oldValue) =>
        oldValue.filter((data) => data.level !== _level)
      );
    }
  };

  const subtractBreadcrumbs = (id: string, level: string) => {
    const filterData = breadcrumb.filter(
      (data) => data.position <= positions[level]
    );
    
    console.log('filterData :', filterData);
    if(level === 'state'){
      const newUrl = window.location.href.split('&stateRegional=')
      window.history.pushState({ path: newUrl[0] }, '', newUrl[0]);
    }
    if(level === 'regional'){
      const newUrl = window.location.href.split('&countyId=')
      window.history.pushState({ path: newUrl[0] }, '', newUrl[0]);
    }
    if(level === 'county'){
      const newUrl = window.location.href.split('&countyRegional=')
      window.history.pushState({ path: newUrl[0] }, '', newUrl[0]);
    }
    if(level === 'regionalSchool'){
      const newUrl = window.location.href.split('&school=')
      window.history.pushState({ path: newUrl[0] }, '', newUrl[0]);
    }
    if(level === 'school'){
      const newUrl = window.location.href.split('&schoolClass=')
      window.history.pushState({ path: newUrl[0] }, '', newUrl[0]);
    }
    if(level === 'serie'){
      const newUrl = window.location.href.split('&schoolClass=')
      window.history.pushState({ path: newUrl[0] }, '', newUrl[0]);
    }

    setBreadcrumb(filterData);
    setMapBreadcrumbs(filterData);

    setVisibleBreadcrumbs(true);
  };

  const showBreadcrumbs = () => {
    setVisibleBreadcrumbs(true);
    setIsUpdateData(true);
    setMapBreadcrumbs(breadcrumb);
  };

  const hideBreadcrumbs = () => {
    setVisibleBreadcrumbs(false);
  };

  const handleClickBar = () => {
    setClickBar(true);
    showBreadcrumbs();
  };

  const handleClickBreadcrumb = (_clickBreadcrumb: boolean) => {
    setClickBreadcrumb(_clickBreadcrumb);
  };

  const handleUnClickBar = () => {
    setClickBar(false);
  };

  const resetBreadcrumbs = () => {
    setBreadcrumb([]);
    setMapBreadcrumbs([])
  };

  useEffect(() => {
    if (clickBar) {
      setIsUpdateData(true);
      setMapBreadcrumbs(breadcrumb);
    }
  }, [clickBar, breadcrumb]);

  const changeYear = useCallback(
    (_year: string) => {
      setYear(_year);
    },
    [setYear]
  );

  const changeEdition = useCallback(
    (_edition: string) => {
      setEdition(_edition);
    },
    [setEdition]
  );

  const changeEpv = useCallback(
    (_epv: string) => {
      setEpv(_epv);
    },
    [setEpv]
  );

  const changeType = useCallback(
    (_type: string) => {
      setType(_type);
    },
    [setType]
  );

  const changeSerie = useCallback(
    (_serie: string) => {
      setSerie(_serie);
    },
    [setSerie]
  );

  const changeSerieList = useCallback(
    (_serieList: string[]) => {
      setSerieList(_serieList);
    },
    [setSerieList]
  );

  const changeState = useCallback(
    (_state: string) => {
      setState(_state);
    },
    [setState]
  );

  const changeStateRegional = useCallback(
    (_stateRegional: string) => {
      setStateRegional(_stateRegional);
    },
    [setStateRegional]
  );

  const changeCounty = useCallback(
    (_county: string) => {
      setCounty(_county);
    },
    [setCounty]
  );

  const changeCountyRegional = useCallback(
    (_countyRegional: string) => {
      setCountyRegional(_countyRegional);
    },
    [setCountyRegional]
  );

  const changeSchool = useCallback(
    (_school: string) => {
      setSchool(_school);
    },
    [setSchool]
  );

  const changeSchoolClass = useCallback(
    (_schoolClass: string) => {
      setSchoolClass(_schoolClass);
    },
    [setSchoolClass]
  );

  const indexSerie = breadcrumb
  .map(function (e) {
    return e.level;
  })
  .indexOf("serie");
  const indexYear = breadcrumb
    .map(function (e) {
      return e.level;
    })
    .indexOf("year");
  const indexEdition = breadcrumb
    .map(function (e) {
      return e.level;
    })
    .indexOf("edition");
  const indexEpv = breadcrumb
    .map(function (e) {
      return e.level;
    })
  .indexOf("epv");
  const indexType = breadcrumb
    .map(function (e) {
      return e.level;
    })
    .indexOf("type");
  const indexState = breadcrumb
    .map(function (e) {
      return e.level;
    })
    .indexOf("state");
  const indexStateRegional = breadcrumb
    .map(function (e) {
      return e.level;
    })
    .indexOf("regional");
  const indexCounty = breadcrumb
    .map(function (e) {
      return e.level;
    })
    .indexOf("county");
  const indexRegionalSchool = breadcrumb
    .map(function (e) {
      return e.level;
    })
    .indexOf("regionalSchool");
  const indexSchool = breadcrumb
    .map(function (e) {
      return e.level;
    })
    .indexOf("school");
  const indexSchoolClass = breadcrumb
    .map(function (e) {
      return e.level;
    })
    .indexOf("schoolClass");

  const value = {
    breadcrumb,
    mapBreadcrumb,
    addBreadcrumbs,
    subtractBreadcrumbs,
    resetBreadcrumbs,
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
    schoolClass,
    changeSerie,
    changeSerieList,
    setIsUpdateData,
    isUpdateData,
    changeYear,
    changeEdition,
    changeEpv,
    changeType,
    changeState,
    changeStateRegional,
    changeCounty,
    changeCountyRegional,
    changeSchool,
    changeSchoolClass,
    indexYear,
    indexEdition,
    indexEpv,
    indexType,
    indexState,
    indexStateRegional,
    indexCounty,
    indexRegionalSchool,
    indexSchool,
    indexSchoolClass,
    showBreadcrumbs,
    hideBreadcrumbs,
    visibleBreadcrumbs,
    handleClickBar,
    handleUnClickBar,
    indexSerie,
    handleClickBreadcrumb,
    clickBar,
    clickBreadcrumb,
  };
  return (
    <>
      <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>
    </>
  );
}
