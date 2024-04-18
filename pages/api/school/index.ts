import axios from "axios";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res) {
  if (req.method === "GET") {
    const { __session: token } = req.cookies;

    const { search, page, limit, order, status, column, county, active } = req.query;
    const params = {
      search,
      page,
      limit,
      order,
      status,
      column,
      county,
      active,
    };
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/school`, {
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
          message: "Erro ao pesquisar escolas, tente mais tarde",
        });
      });
  }
}
