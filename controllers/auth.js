var express = require("express");
var db = require("../models");
var passport = require("../config/ppConfig");
var router = express.Router();

// add route for facbook
router.get("/", passport.authenticate("facebook", {
	scope: ["public_profile", "email"],
}));

// add facebook callback route
router.get("/callback/facebook", passport.authenticate("facebook", {
	successRedirect: "/profile",
	failureRedirect: "/login"
}));

// add logout route
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
})

module.exports = router;