const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/dashboard", adminController.getDashboard);

// Delete one user
router.get("/delete-user/:id", adminController.deleteUser);

// Delete multiple users
router.get("/delete-users", adminController.deleteUsers);

router.get("/view-user/:id", adminController.viewUser);
router.get('/resume/:id', adminController.viewResume);



module.exports = router;
