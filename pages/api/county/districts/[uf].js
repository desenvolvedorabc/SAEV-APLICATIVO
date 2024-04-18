import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { uf } = req.query;
    const { __session: token } = req.cookies;
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/counties/districts/${uf}`, {
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
          message: "Erro ao pesquisar estado, tente mais tarde",
        });
      });
  }
}