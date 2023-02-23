const express = require("express");
const router = express.Router();

const {
  getAll,
  getSpecificEmail,
  updateEmail,
  deleteEmail,
  createEmail,
  sendEmail,
} = require("../controllers/emailController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getAll).post(protect, createEmail);

router.route("/send-email").post(protect, sendEmail);

router
  .route("/:id")
  .get(protect, getSpecificEmail)
  .put(protect, updateEmail)
  .delete(protect, deleteEmail);

module.exports = router;
