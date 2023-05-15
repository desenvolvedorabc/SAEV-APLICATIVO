import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { password, token } = req.body;

    await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/login/reset-password`, {
        password,
        token,
      })
      .then((response) => {
        res.status(200).json({ status: 200 });
      })
      .catch((error) => {
        res.status(200).json({ status: 401 });
      });
  }
}
