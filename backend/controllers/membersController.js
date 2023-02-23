const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/usersDb");

const connection = connectDB();

//Description: Get All Memebers
//Route: GET /api/members
const getAll = (req, res) => {
  const getAllQuery = `
  SELECT id, username, title, role, group_id, email, linkedin, phonenumber FROM Users.users_table`;

  connection.query(getAllQuery, (error, results) => {
    if (error) {
      console.log("Error selection from database: ", error);
      res.status(500).json({ error: "Error selection from database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Description: Get All Memebers for specific group
//Route: GET /api/members/:id
const getMembers = (req, res) => {
  const getAllQuery = `
  SELECT * FROM Users.users_table WHERE group_id = ?`;
  const value = req.params.id;

  connection.query(getAllQuery, value, (error, results) => {
    if (error) {
      console.log("Error selection from database: ", error);
      res.status(500).json({ error: "Error selection from database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Description: Update Specific member
//Route: PUT /api/members/:id
const updateMember = asyncHandler(async (req, res) => {
  const updateQuery = `
  UPDATE Users.users_table
  SET preWorkshopSurvey = ?, 
  infoQuestionnaire = ?, 
  consentFormMDASent = ?,
  consentSigned = ?,
  MDAsigned = ?,
  oneOnOneAccess = ?,
  dan_dana = ?
  WHERE id = ?;
  `;

  const memberValues = [
    req.body.preWorkshopSurvey,
    req.body.infoQuestionnaire,
    req.body.consentFormMDASent,
    req.body.consentSigned,
    req.body.MDAsigned,
    req.body.oneOnOneAccess,
    req.body.dan_dana,
    req.body.id,
  ];

  connection.query(updateQuery, memberValues, (error, results) => {
    if (error) {
      console.log("Error inserting into database: ", error);
      res.status(500).json({ error: "Error inserting into database" });
      return;
    }
    res.status(200).json(results);
  });
});

module.exports = {
  getAll,
  getMembers,
  updateMember,
};
