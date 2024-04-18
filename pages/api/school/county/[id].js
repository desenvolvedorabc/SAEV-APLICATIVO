import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { __session: token} = req.cookies;

    const { id } = req.query;
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/school/county/${id}`, {
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
          message: "Erro ao pesquisar escola, tente mais tarde",
        });
      });
  }
}
