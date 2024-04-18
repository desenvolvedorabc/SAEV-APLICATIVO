import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { __session: token } = req.cookies;
    const {
      search,
      page,
      limit,
      order,
      column,
      county,
      school,
      year,
      type,
      status,
    } = req.query;
    const params = {
      search,
      page,
      limit,
      order,
      column,
      county,
      school,
      year,
      type,
      status,
    };
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/school-class`, {
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
          message: "Erro ao pesquisar anos, tente mais tarde",
        });
      });
  }
}
