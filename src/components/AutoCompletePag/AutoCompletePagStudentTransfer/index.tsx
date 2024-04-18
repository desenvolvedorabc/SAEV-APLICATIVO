import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { getStudentsTransfer } from "src/services/alunos.service";
import useDebounce from "src/utils/use-debounce";

export function AutoCompletePagStudentTransfer({ student, handleChangeStudent, school, disabled = false, width = "100%" }) {
  const [pageStudent, setPageStudent] = useState(1);
  const [searchStudent, setSearchStudent] = useState(null);
  const [limitStudent, setLimitStudent] = useState(false);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [studentList, setStudentList] = useState([]);

  const [position, setPosition] = useState(0);
  const [listboxNode, setListboxNode] = useState(null);

  const debouncedSearchTerm = useDebounce(searchStudent, 1000);

  async function loadStudents(page, list) {
    setLoadingStudent(true)

    const respStudents = await getStudentsTransfer(debouncedSearchTerm, page, 25, null, "ASC", school, "1");

    setPageStudent(page + 1)

    if(respStudents.data.items.length === 0) {
      setLimitStudent(true)
      setLoadingStudent(false)
      return
    }
    setStudentList([...list, ...respStudents.data.items]);
    setLoadingStudent(false)
  }

  useEffect(() => {
    if (listboxNode !== null) {
      listboxNode.scrollTop = position;
    }
  }, [position, listboxNode])

  useEffect(() => {
    setPageStudent(1)
    setStudentList([])
    loadStudents(1, [])
    setLimitStudent(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[school]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setPageStudent(1)
      setStudentList([]);
      loadStudents(1, [])
      setLimitStudent(false)

    } else {
      setPageStudent(1)
      setStudentList([]);
      loadStudents(1, [])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[debouncedSearchTerm]);
  
  const handleScrollStudent = async (event) => {
    setListboxNode(event.currentTarget);

    const x = event.currentTarget.scrollTop + event.currentTarget.clientHeight;

    if (event.currentTarget.scrollHeight - x <= 1 && !limitStudent) {
      await loadStudents(pageStudent, studentList)
      setPosition(x);
    }
  };

  return (
    <Autocomplete
      className="col me-3"
      id="aluno"
      size="small"
      noOptionsText="Buscar"
      options={studentList}
      value={student}
      getOptionLabel={(option) => option.ALU_NOME}
      onChange={(_event, newValue) => {
        handleChangeStudent(newValue)}}
      onInputChange={(_event, newValue) => {
        setPageStudent(1)
        setStudentList([])
        setLimitStudent(false)
        setSearchStudent(newValue);
      }}
      disabled={disabled}
      ListboxProps={{
        onScroll: handleScrollStudent
      }}
      renderInput={(params) => <TextField size="small" {...params} label="Buscar" />}
    />
  );
}
