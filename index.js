const express = require("express");
const router = require("./route/routes");
const cors = require ("cors");
require("dotenv").config();
require("./connection");
const PORT = process.env.PORT || 4500
const app = express();


app.use(cors());
app.use(express.json());
app.use(router);
app.use("/upload",express.static("./uploads"))




app.listen(PORT, () => {
  console.log("backend running...");
});
