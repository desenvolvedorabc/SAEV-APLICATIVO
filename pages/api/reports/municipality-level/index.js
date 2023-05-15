import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { __session: token } = req.cookies;
    const {
      page,
      limit,
      order,
      year,
      edition,
      county,
      search,
      school,
      serie,
      schoolClass,
    } = req.query;

    const params = {
      token,
      page,
      limit,
      year,
      order,
      edition,
      county,
      search,
      school,
      serie,
      schoolClass,
    };

    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/reports/municipality-level`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        // if(error.request)
        res.status(200).json({
          status: 401,
          message: "Erro ao buscar nivel de desempenho",
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
