import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { file } = req.query;
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/tests/file/${file}`)
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        res
          .status(200)
          .json({
            status: 401,
            message: "Erro ao baixar teste, tente mais tarde",
          });
      });
  }
}
