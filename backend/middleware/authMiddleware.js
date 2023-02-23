const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const connectDB = require("../config/usersDb");

const connection = connectDB();

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get Token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      const query = `SELECT * FROM users_table WHERE id = ? AND NOT password`;
      const value = decoded.id;
      connection.query(query, [value], (err, data) => {
        if (err) throw new Error("From PROTECT: ", err);
        req.user = data[0];
        next();
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        console.log(error);
        res.status(401).json({ msg: "Not Authorized" });
      }
      console.log(error);
      res.status(500).json({ msg: "Server error" });
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
