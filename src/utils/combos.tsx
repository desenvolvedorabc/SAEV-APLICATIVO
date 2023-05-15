const url = 'https://servicodados.ibge.gov.br/api/v1/localidades/'
export async function loadUf() {
    let list = []
    await fetch(`${url}estados`)
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.nome.localeCompare(b.nome))
            list = data
        })
    return list
}

export async function loadCity(sigla) {
    let list = []
    await fetch(`${url}estados/${sigla}/municipios`)
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.nome.localeCompare(b.nome))
            list = data
        })
    return list
}

export const completeCEP = async (cep) => {
    let infos
    if(cep){
        var cep = cep.replace(/[^0-9]/, "");

        if (cep.length != 8) {
            return false;
        }

        let url = "https://viacep.com.br/ws/" + cep + "/json/";
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                infos = data
            })
        return infos
    }
}