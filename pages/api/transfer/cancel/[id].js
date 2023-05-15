import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { __session: token } = req.cookies;
    const { id } = req.query;
    delete req.body["token"];

    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/transfer/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        res.status(200).json(true);
      })
      .catch(() => {
        res.status(200).json({
          status: 401,
          message:
            "Erro ao cancelar transferência, tente mais tarde",
        });
      });
  }
}
