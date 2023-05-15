import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { __session: token } = req.cookies;
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/files/students`, req.body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log("error", error.response.data);
        res.status(200).json({
          status: 401,
          message:
            error.response.data.message ||
            "Erro ao importar alunos, tente mais tarde",
          error,
        });
      });
  }
}
