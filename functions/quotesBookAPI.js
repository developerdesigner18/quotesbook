const express = require("express");
var cors = require("cors");

const { getAllUsers } = require("./controllers/getAllUsers");
const { db } = require("../src/firebase/config");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/quotes", db, getAllUsers);

const port = 5000 || process.env.PORT;
app.listen(port, () => {
  console.log(`The app is listening on port ${port}`);
});
