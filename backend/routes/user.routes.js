const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.get(
  "/profile",
  authenticate,
  userController.getProfile
);

router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  userController.adminDashboard
);

module.exports = router;