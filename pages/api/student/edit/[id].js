import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { __session: token } = req.cookies;
    const { id } = req.query;
    delete req.body.data["token"];
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/student/${id}`, req.body.data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error)
        res.status(200).json({
          status: error?.response?.data?.statusCode ?? 500,
          message: error?.response?.data?.message ?? "Error ao editar aluno, tente mais tarde",
          error,
        });
      });
  }
}
