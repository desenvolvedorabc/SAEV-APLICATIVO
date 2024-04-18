import { useEffect, useState } from 'react'
import useDebounce from '../../../utils/use-debounce';
import { Form } from "react-bootstrap";
import { MdSearch, MdClose } from "react-icons/md";
import { getCounties } from 'src/services/municipios.service';
import { getUsers } from 'src/services/usuarios.service';
import { getSchools } from 'src/services/escolas.service';
import { Button, RespBox, Title, Text, ButtonClose, FormStyled} from './styledComponents'
import Link from 'next/link'
import { getStudentsNames } from 'src/services/alunos.service';


export default function SearchHome () {

  const [isRespOpen, setIsRespOpen] = useState(false)

  const handleRespOpen = () => {
    setIsRespOpen(!isRespOpen)
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [municipios, setMunicipios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [escolas, setEscolas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [resultCount, setResultCount] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(

    () => {
      setResultCount(0)

      if (debouncedSearchTerm) {
        setMunicipios([]);
        setUsuarios([]);
        setEscolas([]);
        setAlunos([]);
        searchCharacters(debouncedSearchTerm)
        if(!isRespOpen)
          handleRespOpen()
      } else {
        setResultCount(0)
        setMunicipios([]);
        setUsuarios([]);
        setEscolas([]);
        setAlunos([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchTerm]
  );
  
  
  // API search function
  async function searchCharacters(search) {
    let count = 0;

    const respCounties = await getCounties(search, 1, 999, null, "ASC", null)
    count += respCounties.data.items.length

    const respUsers = await getUsers(search, 1, 999, null, "ASC", null, null, null, null)
    count += respUsers.data.items.length
    
    const respSchool = await getSchools(search, 1, 999, null, "ASC", null, null)
    count += respSchool.data.items.length
    
    const respStudent = await getStudentsNames(search, 1, 9999, null, "ASC", null, null, null, null)
    count += respStudent.data.items.length
    
    setResultCount(count)
    setMunicipios(respCounties.data.items)
    setUsuarios(respUsers.data.items)
    setEscolas(respSchool.data.items)
    setAlunos(respStudent.data.items)
  }

  return (
      <FormStyled className="col-10 px-1">
        <Form.Group controlId="formBasicEmail">
          <div className="d-flex align-items-center">
            <Form.Control className="pe-5" type="text" name="search" placeholder="Busque alunos, usuários, escolas ou convênios" 
            onChange={e => setSearchTerm(e.target.value)}
            />
            <Button type="button" onClick={handleRespOpen}>
              <MdSearch color={'#3E8277'} />
            </Button>
          </div>
          <div className="col-12">
            {isRespOpen && resultCount > 0 &&
              <RespBox className="col-7">
                <div className="d-flex justify-content-between align-items-center">
                  <div>Resultados Encontrados ({resultCount})</div>
                  <ButtonClose type="button" onClick={handleRespOpen}>
                    <MdClose color={'#3E8277'} />
                  </ButtonClose>
                </div>
                {alunos.length > 0 &&
                  <>
                    <hr/>
                    <Title><strong>Alunos</strong></Title>
                    {alunos.map(result => (
                      <div key={result.USU_ID}>
                        <Link href={`/municipio/${result?.MUN_ID}/escola/${null}/aluno/${result.ALU_ID}`} passHref>
                          <Text>{result.ALU_NOME}</Text>
                        </Link>
                      </div>
                    ))}
                  </>
                }
                {usuarios.length > 0 &&
                  <>
                    <hr/>
                    <Title><strong>Usuários</strong></Title>
                    {usuarios.map(result => (
                      <div key={result.USU_ID}>
                        <Link href={`usuario/${result.USU_ID}`}>
                          <Text>{result.USU_NOME}</Text>
                        </Link>
                      </div>
                    ))}
                  </>
                }
                {municipios.length > 0 &&
                  <>
                    <hr/>
                    <Title><strong>Municípios</strong></Title>
                    {municipios.map(result => (
                      <div key={result.MUN_ID}>
                        <Link href={`municipio/${result.MUN_ID}`}>
                          <Text>{result.MUN_NOME}</Text>
                        </Link>
                      </div>
                    ))}
                  </>
                }
                {escolas.length > 0 &&
                  <>
                    <hr/>
                    <Title><strong>Escolas</strong></Title>
                    {escolas.map(result => (
                      <div key={result.ESC_ID}>
                        <Link href={`escola/${result.ESC_ID}`}>
                          <Text>{result.ESC_NOME}</Text>
                        </Link>
                      </div>
                    ))},
                  </>
                }
              </RespBox>
            }
          </div>
        </Form.Group>
      </FormStyled>
  )
}


