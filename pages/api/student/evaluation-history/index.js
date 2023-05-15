import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { __session: token } = req.cookies;
    const {
      id,
      page,
      limit,
      order,
      column,
      school,
    } = req.query;
    const params = {
      id,
      page,
      limit,
      order,
      column,
      school,
    };
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/student/evaluation-history/${id}`, {
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
          message: "Erro ao pesquisar historico de avaliações, tente mais tarde",
        });
      });
  }
}
