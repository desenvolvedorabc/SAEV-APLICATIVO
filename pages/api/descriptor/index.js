import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { serie, year, edition, county, school, schoolClass } =
      req.query;

    const { __session: token } = req.cookies;

    const params = {
      serie,
      year,
      edition,
      county,
      school,
      schoolClass,
    };

    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/descriptor`, {
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
          error,
          message: "Erro ao pesquisar descritores, tente mais tarde",
        });
      });
  }
}
