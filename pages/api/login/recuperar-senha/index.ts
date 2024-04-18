import axios from "axios";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login/recovery-password`, { email }    ).then((response) => {
      res.status(200).json({ status: 200 })
    }).catch((error) => {
      res.status(200).json({ status: 401 })
    });
  }
}