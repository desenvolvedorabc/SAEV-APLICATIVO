import axios from "axios";

export default async function handler(req, res) {

  if (req.method === 'GET') {
    const { search, page, limit, order, column, status } = req.query;
    const { __session: token } = req.cookies;
    const params = {
      search, page, limit, order, status, column
    }
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/counties/report`, {
      params,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    ).then((response) => {
      res.status(200).json(response.data)
    }).catch((error) => {
      res.status(200).json({ status: 401, error, message: 'Erro ao pesquisar municipios, tente mais tarde' })
    });
  }
}