import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { getStudentsNames } from "src/services/alunos.service";
import useDebounce from "src/utils/use-debounce";

export function AutoCompletePagStudent({ 
  student, 
  handleChangeStudent, 
  county = null, 
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
    const respStudents = await getStudentsNames(debouncedSearchTerm, pageStudent, 25, null, "ASC", county, school, null, null);

    console.log("respStudents", respStudents)
    console.log("county", county)
    console.log("school", school)

    setPageStudent(pageStudent + 1)

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
    if (debouncedSearchTerm) {
      setPageStudent(1)
      setStudentList([]);
      loadStudents()
    } else {
      setStudentList([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[debouncedSearchTerm, school, county]);
  
  const handleScrollStudent = async (event) => {
    setLoadingStudent(true)
    setListboxNode(event.currentTarget);

    const x = event.currentTarget.scrollTop + event.currentTarget.clientHeight;

    if (event.currentTarget.scrollHeight - x <= 1 && !limitStudent) {
      await loadStudents()
      setPosition(x);
    }
    setLoadingStudent(false)
  };

  return (
    <Autocomplete
      className="col me-1"
      id="aluno"
      size="small"
      noOptionsText="Digite o nome ou INEP do aluno"
      options={studentList}
      value={student}
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
