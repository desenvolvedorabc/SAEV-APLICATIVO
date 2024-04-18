import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { id } = req.query;

    const { __session: token } = req.cookies;

    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/headquarters/descritor/${id}/toggle-active`,
        id,
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
          error,
          message: "Erro ao ativar/desativar descritor, tente mais tarde",
        });
      });
  }
}
