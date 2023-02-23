const express = require("express");
const router = express.Router();

const {
  getAll,
  getMembers,
  updateMember,
} = require("../controllers/membersController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getAll);

router.route("/:id").get(protect, getMembers).put(protect, updateMember);

module.exports = router;
