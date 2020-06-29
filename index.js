const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();

app.use(express.json());

app.use("/api/user", authRoutes);
app.use("/api/posts", postRoutes);

dotenv.config();

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to mongoDB")
);

app.listen(3001, () => console.log("Running on port 3001"));
