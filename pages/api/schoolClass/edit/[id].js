import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { __session: token } = req.cookies;
    const { id } = req.query;
    delete req.body.data["token"];

    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/school-class/${id}`,
        req.body.data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        res.status(200).json({
          status: 401,
          message: "Erro ao editar ano, tente mais tarde",
        });
      });
  }
}
