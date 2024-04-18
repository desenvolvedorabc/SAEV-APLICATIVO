import axios from "axios";
import FormData from "form-data";
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { __session: token } = req.cookies;
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL_IMPORT}/files/users`, req.body, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        res.status(200).json({
          status: 401,
          message:
            error.response.data.message ||
            "Erro ao importar usuários, tente mais tarde",
          error,
        });
      });
  }
}
