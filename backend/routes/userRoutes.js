const express = require("express");
const router = express.Router();
const { loginUser, getUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", loginUser);
router.get("/me", protect, getUser);

module.exports = router;
