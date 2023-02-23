const connectDB = require("../config/usersDb");

const connection = connectDB();

//Description: Get All Groups
//Route: GET /api/groups
const getAllGroups = (req, res) => {
  const getAllQuery = `
  SELECT group_id, role FROM Users.users_table`;

  connection.query(getAllQuery, (error, results) => {
    if (error) {
      console.log("Error selecting from Users database: ", error);
      res.status(500).json({ error: "Error selecting from database" });
      return;
    }
    let groups = [];
    results.forEach((result) => {
      if (!groups.some((group) => group.group_id === result.group_id)) {
        groups.push({ group_id: result.group_id, role: result.role });
      }
    });
    res.status(200).json(groups);
  });
};

module.exports = {
  getAllGroups,
};
