import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { password } = req.body;
    const { __session: token } = req.cookies;

    await axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_URL}/login/confirm-new-password`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        res.status(200).json({ status: 200 });
      })
      .catch((error) => {
        res.status(200).json({ status: 401 });
      });
  }
}
