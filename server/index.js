const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("./public"));

const storage = multer.diskStorage({
  destination: "D:/skincancer", // Fixed the path
  filename: function (req, file, cb) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const filename = `${formattedDate}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage }).array('file'); // Updated to array()

app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    // Check for req.files, as req.file might be undefined
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Assuming you want to send the array of file names in the response
    const fileNames = req.files.map(file => file.filename);
    return res.status(200).json({ files: fileNames });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server started at port " + PORT);
});
