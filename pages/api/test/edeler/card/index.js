import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    await axios
      .post("https://herby-app.ch/api/v1/cartaoDeResposta2", data, {
        responseType: "arraybuffer",
        headers: {
          Accept: "application/pdf",
        },
      })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        res.status(200).json({
          status: 401,
          message: "Erro ao pesquisar teste, tente mais tarde",
        });
      });
  }
}
