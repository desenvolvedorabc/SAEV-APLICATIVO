import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { __session: token } = req.cookies;
    await axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_URL}/counties/file/upload`,
        req.body.data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
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
              "Erro ao salvar file, tente mais tarde",
          });
      });
  }
}
