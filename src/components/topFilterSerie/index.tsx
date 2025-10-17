import Notification from "../notification";
import Search from "../search";
import { Container, ButtonVoltar } from "./styledComponents";
import PageTitle from "src/components/pageTitle";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";
import { FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from 'react'
import { getAllSeries } from "src/services/referencias.service";
import { useRouter } from "next/router";

interface TopFilterSerieProps {
  link?: string,
  title: string,
  searchOpen?: boolean,
  serie?: string,
  changeSerie: (newValue, add) => void
  orderBy?: 'ASC' | 'DESC'
}

export function TopFilterSerie({ title, searchOpen = false, serie, changeSerie, orderBy="ASC" }: TopFilterSerieProps) {
  const router = useRouter();


  const [seriesList, setSeriesList] = useState([])

  const loadSeries = async () => {
    const resp = await getAllSeries()
    //if (orderBy === 'DESC' && resp.data) resp.data = resp?.data?.reverse()
    setSeriesList(resp.data)
    if(router.query.serie !== undefined){
      changeSerie(resp.data.find(serie => serie.SER_ID == router.query.serie), false)
    }
  }
  useEffect(() => {
    loadSeries()
  }, [])


  return (
    <Container className="col-12">
      <div className="d-flex align-items-center">
        <ButtonVoltar data-test='back' onClick={() => router.back()}>
          <MdArrowBack color={'#3E8277'} size={28} />
        </ButtonVoltar>

        <PageTitle dataTest={title}>{title}</PageTitle>
        <Autocomplete
          className=""
          sx={{ width: 300, backgroundColor: "#FFF", marginLeft: "20px", borderRadius: "4px" }}
          id="size-small-outlined"
          size="small"
          value={serie}
          noOptionsText="Série"
          options={seriesList}
          getOptionLabel={(option) => `${option?.SER_NOME}`}
          onChange={(_event, newValue) => {
            changeSerie(newValue, true);
          }}
          renderInput={(params) => (
            <TextField size="small" {...params} label="Série" />
          )}
        />
      </div>
      <div className="d-flex align-items-center">
        <Search open={searchOpen} />
        <Notification />
      </div>
    </Container>
  )
}