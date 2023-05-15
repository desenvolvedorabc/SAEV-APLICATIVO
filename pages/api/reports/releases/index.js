import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { __session: token } = req.cookies;
    const {
      page,
      limit,
      order,
      search,
      column,
      serie,
      year,
      edition,
      county,
      school,
      schoolClass,
    } = req.query;
    const params = {
      token,
      page,
      limit,
      order,
      search,
      column,
      serie,
      year,
      edition,
      county,
      school,
      schoolClass,
    };

    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/reports/releases`, {
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
          message: "Erro ao buscar enturmação",
        });
      });
  }
}
