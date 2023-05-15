import axios from "axios";
import formidable from "formidable";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (req.method === "POST") {
    const { slug } = req.query;
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldPath = files.manual.filepath;
      var newPath =
        process.env.NODE_ENV === "development"
          ? path.join("./tmp") + "/" + files.manual.originalFilename
          : `/tmp/${files.manual.originalFilename}`;
      var rawData = fs.readFileSync(oldPath);
      fs.writeFile(newPath, rawData, function (err) {
        let base64String = rawData.toString("base64");

        axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/assessments/manual/upload`,
            {
              TES_ID: slug[1],
              filename: files.manual.originalFilename,
              base64: base64String,
            },
            {
              headers: {
                Authorization: `Bearer ${slug[0]}`,
              },
            }
          )
          .then((response) => {
            fs.unlink(newPath, (err) => {
              if (err) console.log(err);
              else {
                return res.status(200).json(response.data);
              }
            });
          })
          .catch((error) => {
            return res.status(200).json({
              status: 401,
              message:
                "Erro ao realizar upload de arquivo para teste, tente mais tarde",
            });
          });
      });
    });
  }
};
