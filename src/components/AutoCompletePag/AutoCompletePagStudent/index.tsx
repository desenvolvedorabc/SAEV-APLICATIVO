import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { getStudentsNames } from "src/services/alunos.service";
import useDebounce from "src/utils/use-debounce";

export function AutoCompletePagStudent({ 
  student, 
  handleChangeStudent, 
  type = null,
  state = null,
  stateRegional = null,
  county = null, 
  countyRegional = null,
  school = null, 
  width = "100%" 
}) {
  const [pageStudent, setPageStudent] = useState(1);
  const [searchStudent, setSearchStudent] = useState(null);
  const [limitStudent, setLimitStudent] = useState(false);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [studentList, setStudentList] = useState([]);

  const [position, setPosition] = useState(0);
  const [listboxNode, setListboxNode] = useState(null);

  const debouncedSearchTerm = useDebounce(searchStudent, 1000);

  async function loadStudents() {
    setLoadingStudent(true);
    const respStudents = await getStudentsNames(debouncedSearchTerm, pageStudent, 25, null, "ASC", type === 'PUBLICA' ? null : type, state, stateRegional, county, countyRegional, school, null, null);

    setPageStudent(pageStudent + 1)

    setLoadingStudent(false)
    if(respStudents.data.items.length === 0) {
      setLimitStudent(true)
      return
    }
    setStudentList([...studentList, ...respStudents.data.items]);
  }

  useEffect(() => {
    if (listboxNode !== null) {
      listboxNode.scrollTop = position;
    }
  }, [position, listboxNode])

  useEffect(() => {
    handleChangeStudent(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[type, state, stateRegional, county, countyRegional, school]);

  useEffect(() => {
    setPageStudent(1)
    setStudentList([]);
    loadStudents()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[debouncedSearchTerm, type, state, stateRegional, county, countyRegional, school]);
  
  const handleScrollStudent = async (event) => {
    // setLoadingStudent(true)
    setListboxNode(event.currentTarget);

    const x = event.currentTarget.scrollTop + event.currentTarget.clientHeight;

    if (event.currentTarget.scrollHeight - x <= 1 && !limitStudent) {
      await loadStudents()
      setPosition(x);
    }
    // setLoadingStudent(false)
  };

  return (
    <Autocomplete
      className="col"
      id="aluno"
      size="small"
      noOptionsText="Digite o nome ou INEP do aluno"
      options={studentList}
      value={student}
      loading={loadingStudent}
      getOptionLabel={(option) =>  `${option.ALU_NOME} - ${option.ALU_INEP ? option.ALU_INEP : ""}`}
      onChange={(_event, newValue) => {
        handleChangeStudent(newValue)}}
      onInputChange={(_event, newValue) => {
        setPageStudent(1)
        setStudentList([])
        setLimitStudent(false)
        setSearchStudent(newValue);
      }}
      ListboxProps={{
        onScroll: handleScrollStudent
      }}
      renderInput={(params) => <TextField size="small" {...params} label="Digite o nome ou INEP do aluno" />}
    />
  );
}
