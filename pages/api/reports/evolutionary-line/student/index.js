import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { year, idStudent } = req.query;
    const { __session: token } = req.cookies;

    const params = {
      token,
      year,
      idStudent,
    };

    await axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/evolutionary-line-student/${idStudent}/${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        // if(error.request)
        res.status(200).json({
          status: 401,
          message: "Erro ao buscar linha evolutiva",
        });
      });
  }
}

// data: {
//   TOTAL_STUDENTS:{
//     FOUR: 0,
//     ONE: 0,
//     TOTAL: 0,
//     TREE: 0,
//     TWO: 0
//   },
//   items: [],
//   meta:{
//     itemCount: 0,
//     totalItems: 0,
//     totalPages: 0
//   }
// }
