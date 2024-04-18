import {useState} from 'react';
import { InputGroup3, Card }  from 'src/shared/styledForms'
import { TextField } from '@mui/material'
import { StateArea } from './styledComponents';
import { format } from 'date-fns';
import { entities_mock } from 'src/utils/mocks/entities';

export default function LogDetails({log}) {
  const [listEntity, setListEntity] = useState(entities_mock);

  const getLogName = (value) => {
    let name = value
    listEntity.map(entity => {
      if(entity.value === value)
        name = entity.name;
    })

    return name;
  }

  return (
    <>
      <Card style={{marginBottom: 17, maxWidth: 1210}}>
        <div className="mb-3">
          <strong>Informações do Log</strong>
        </div>     
        <InputGroup3 className="" controlId="formBasic">
          <div>
            <TextField
              fullWidth
              label="Usuário"
              name="usuario"
              id="usuario"
              value={log?.user?.USU_NOME}
              onChange={(e) => {e.preventDefault();}}
              disabled={true}
              size="small"
              sx={{
                "& .Mui-disabled": {
                  background: "#fff",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black",
                }
              }}
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Município"
              name="municipio"
              id="municipio"
              value={log?.user?.USU_MUN?.MUN_NOME}
              onChange={(e) => {e.preventDefault();}}
              disabled={true}
              size="small"
              sx={{
                "& .Mui-disabled": {
                  background: "#fff",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black",
                }
              }}
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Sub-Perfil de Acesso"
              name="perfil"
              id="perfil"
              value={log?.user?.USU_SPE?.SPE_PER?.PER_NOME}
              onChange={(e) => {e.preventDefault();}}
              disabled={true}
              size="small"
              sx={{
                "& .Mui-disabled": {
                  background: "#fff",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black",
                }
              }}
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Data e Hora"
              name="data"
              id="data"
              value={log?.createdAt ? format(new Date(log?.createdAt), "dd/MM/yyyy - HH:mm:ss"): null}
              onChange={(e) => {e.preventDefault();}}
              disabled={true}
              size="small"
              sx={{
                "& .Mui-disabled": {
                  background: "#fff",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black",
                }
              }}
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Entidade"
              name="entidade"
              id="entidade"
              value={getLogName(log?.nameEntity)}
              onChange={(e) => {e.preventDefault();}}
              disabled={true}
              size="small"
              sx={{
                "& .Mui-disabled": {
                  background: "#fff",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black",
                }
              }}
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Método"
              name="metodo"
              id="metodo"
              value={log?.method}
              onChange={(e) => {e.preventDefault();}}
              disabled={true}
              size="small"
              sx={{
                "& .Mui-disabled": {
                  background: "#fff",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black",
                }
              }}
            />
          </div>
        </InputGroup3>
      </Card>
      <Card style={{marginBottom: 17, maxWidth: 1210}}>
        <div className="mb-3">
          <strong>Estado Antes</strong>
        </div>
        <StateArea>
          {log?.stateInitial}
        </StateArea>
      </Card>
      <Card style={{ maxWidth: 1210}}>
        <div className="mb-3">
          <strong>Estado Depois</strong>
        </div>
        <StateArea>
          {log?.stateFinal}
        </StateArea>
      </Card>
    </>
  )
}