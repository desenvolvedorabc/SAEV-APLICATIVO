import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { __session: token } = req.cookies;
    const { page, limit, school, county, order, status, student } = req.query;
    const params = {
      page,
      limit,
      school,
      county,
      order,
      status,
      student
    };
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/transfer`, {
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
          message: "Erro ao pesquisar transferencias, tente mais tarde",
        });
      });
  }
}
