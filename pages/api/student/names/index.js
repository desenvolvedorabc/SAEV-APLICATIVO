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
      status,
      serie
    } = req.query;
    const params = {
      search,
      page,
      limit,
      order,
      column,
      county,
      school,
      status,
      serie
    };
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/student/names`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        ("error", error);
        res.status(200).json({
          status: 401,
          message: "Erro ao pesquisar alunos, tente mais tarde",
        });
      });
  }
}
