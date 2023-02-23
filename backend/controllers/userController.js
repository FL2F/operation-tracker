const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const connectDB = require("../config/usersDb");

const connection = connectDB();

//Authenticate User
// POST /api/login
// Public Accessable
const loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Please add all fields" });
    return;
  }

  connection.query(
    `SELECT * FROM users_table WHERE username = ?`,
    [username],
    (err, data) => {
      if (err) {
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }

      if (!data[0]) {
        res.status(401).json({ message: "Invalid Credentials" });
        return;
      }

      const user = data[0];

      if (user.role !== "admin") {
        res.status(200).json({ message: "User not authorized" });
        return;
      }
      bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) {
          console.log("error decrypting", error);
          res.status(500).json({ message: "Internal Server Error" });
          return;
        }
        if (!isMatch) {
          res.status(401).json({ message: "Invalid Credentials" });
          return;
        }
        // if (user.role !== "admin") {
        //   res.status(401).json({ message: "User not authorized" });
        //   return;
        // }

        const token = generateToken(user.id);
        res.json({
          id: user.id,
          username: user.username,
          role: user.role,
          group_id: user.group_id,
          token: token,
        });
      });
    }
  );
};

const getUser = (req, res) => {
  const query = `SELECT * FROM users_table WHERE id = ? AND NOT password`;
  const value = req.user.id;
  connection.query(query, [value], (err, data) => {
    res.status(200).json({
      id: data[0].id,
      title: data[0].title,
      username: data[0].username,
      role: data[0].role,
      group_id: data[0].group_id,
    });
  });
};

//Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { loginUser, getUser };
