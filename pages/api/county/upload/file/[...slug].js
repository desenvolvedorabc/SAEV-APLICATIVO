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
      var oldPath = files.file.filepath;
      var newPath =
        process.env.NODE_ENV === "development"
          ? path.join("./tmp") + "/" + files.file.originalFilename
          : `/tmp/${files.file.originalFilename}`;
      var rawData = fs.readFileSync(oldPath);
      fs.writeFile(newPath, rawData, function (err) {
        let base64String = rawData.toString("base64");

        axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/counties/file/upload`,
            {
              MUN_ID: slug[1],
              filename: files.file.originalFilename,
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
            return res
              .status(200)
              .json({
                status: 401,
                message:
                  "Erro ao realizar upload de arquivo para municipio, tente mais tarde",
              });
          });
      });
    });
  }
};
