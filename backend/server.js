const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// body parser midleware
app.use(express.json());
// urlencoded middleware
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://operation-tracker.fl2f.ca",
      "https://operation-tracker-frontend-3yvuhaorjq-uc.a.run.app",
      "https://sendgrid.api-docs.io",
    ],
    credentials: true,
  })
);

app.use("/api/login", require("./routes/userRoutes")); //working
app.use("/api/members", require("./routes/memberRoutes")); //working
app.use("/api/emails", require("./routes/emailRoutes")); //working
app.use("/api/groups", require("./routes/groupRoutes")); //working

// set up server to listen on specific port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server started on port ${port}`));
