const express = require("express");
const router = express.Router();

const { getAllGroups } = require("../controllers/groupsController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getAllGroups);

module.exports = router;
