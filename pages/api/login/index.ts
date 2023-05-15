import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        USU_EMAIL: email,
        USU_SENHA: password,
      })
      .then((response) => {
        res
          .status(200)
          .json({ status: 200, access_token: response.data.access_token, expires_in: response.data.expires_in });
      })
      .catch((error) => {

        res.status(200).json({
          status: 401,
          message: error?.response?.data?.message ?? 'Houve um erro interno, tente novamente depois.',
        });
      });
  }
}
