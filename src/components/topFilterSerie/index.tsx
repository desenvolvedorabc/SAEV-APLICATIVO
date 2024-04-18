import Notification from "../notification";
import Search from "../search";
import { Container, ButtonVoltar } from "./styledComponents";
import PageTitle from "src/components/pageTitle";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from 'react'
import { getAllSeries } from "src/services/referencias.service";
import { useRouter } from "next/router";

interface MyNotification {
  mensagem: string,
  lido: boolean
}

interface TopFilterSerieProps {
  link?: string,
  title: string,
  searchOpen?: boolean,
  serie?: string,
  changeSerie: (e) => void
  orderBy?: 'ASC' | 'DESC'
}

export function TopFilterSerie({ title, searchOpen = false, serie, changeSerie, orderBy="ASC" }: TopFilterSerieProps) {
  const router = useRouter();


  const [seriesList, setSeriesList] = useState([])

  const loadSeries = async () => {
    const resp = await getAllSeries()
    if (orderBy === 'DESC') resp.data = resp.data = resp.data.reverse()
    setSeriesList(resp.data)
  }
  useEffect(() => {
    loadSeries()
  }, [])


  return (
    <Container className="col-12">
      <div className="d-flex align-items-center">
        {/* <Link href={link} passHref> */}
        <ButtonVoltar onClick={() => router.back()}>
          <MdArrowBack color={'#3E8277'} size={28} />
        </ButtonVoltar>
        {/* </Link> */}

        <PageTitle>{title}</PageTitle>
        <FormControl sx={{ width: 300, backgroundColor: "#FFF", marginLeft: "20px", borderRadius: "4px" }} size="small">
          <InputLabel id="serie">Série</InputLabel>
          <Select
            labelId="serie"
            id="serie"
            value={serie}
            label="Série"
            onChange={(e) => changeSerie(e)}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {seriesList?.map(x => (
              <MenuItem key={x.SER_ID} value={x}>{x.SER_NOME}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="d-flex align-items-center">
        <Search open={searchOpen} />
        <Notification />
      </div>
    </Container>
  )
}