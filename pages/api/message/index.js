import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { search, page, limit, column, order } = req.query;
    const { __session: token } = req.cookies;
    const params = {
      search,
      page,
      limit,
      column,
      order,
    };

    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        res.status(200).json({
          status: 401,
          message: "Erro ao buscar as mensagens",
        });
      });
  }
}
