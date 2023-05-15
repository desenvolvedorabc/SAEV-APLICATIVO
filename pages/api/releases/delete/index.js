import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { __session: token } = req.cookies;

    delete req.body["token"];
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/release-results`,  {
        data: {  ...req.body},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        res
          .status(200)
          .json({
            status: 401,
            message:
              error.response.data.message ||
              "Erro deletar os lançamentos",
          });
      });
  }
}
