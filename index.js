// Requires
require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var ejsLayouts = require("express-ejs-layouts");
var passport = require("./config/ppConfig");
var session = require("express-session");
var db = require("./models");
var nodemailer = require('nodemailer');
var mailer = require("./email");
var os = require('os');

// Global Variabls
var app = express();
var server = app.listen(process.env.PORT || 3000);

// Set and Use statements
app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended:false}));
// For authentication  --->
app.use(express.static("public"));
app.use(session({
	secret: process.env.SESSION_SECRET || "thisisasecret",
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", require("./controllers/auth"));
// <--- End authentication

// Routes
app.get("/", function(req, res) {
	var user = req.user;

	db.task
		.findAll({ order: '"task" ASC' })
		.then(function(resultTasks){
			res.render("home", { user: user, tasks: resultTasks, layout:"layout-home" });
		});

});

// Profile
app.get("/profile", function(req, res) {
	var user = req.user;

	if (!user) {
		res.redirect("/");
		return;
	}

	var userInDb;
	var metros;
	var hoods;
	var tasks;
	db.metroArea.findAll()
		.then(function(resultMetros) {
			metros = resultMetros;
		})
		.then(function() {
			return db.neighborhood.findAll({ order: '"neighborhood" ASC' });
		})
		.then(function(resultHoods) {
			hoods = resultHoods;
		})
		.then(function() {
			return db.task.findAll({ order: '"task" ASC' });
		})
		.then(function(resultTasks) {
			tasks = resultTasks;
		})
		.then(function() {
			return db.user.findOne({ where: { facebookId: user.facebookId } });	
		})
		.then(function(resultUser) {
			userInDb = resultUser;
		})
		.then(function() {
			console.log("THIS IS THE METRO AREA ID" + metros[0].id);
			res.render("profile", { user: user, userRecord:userInDb, metroAreas: metros, neighborhoods: hoods, tasks: tasks});			
		});
});

app.post("/profile", function(req, res) {
	var user = req.user;
	
	if(!user) {
		res.redirect("/");
		return;
	}

	var userInDb;

	db.user
		.find({
			where: { facebookId: user.facebookId }
		})
		.then(function (resultUser) {
			if (!resultUser) {
				throw "notFound";
			}
			userInDb = resultUser;
		})
		.then(function() {
			userInDb.metroAreaId = req.body.metroArea;
			userInDb.userWantTaskId = req.body.wantTask;
			userInDb.userNeedTaskId = req.body.provideTask;
			return userInDb.save();
		})
		.then(function() {
			res.redirect("/search");
		})
		.catch(function(err) {
			if (err == "notFound") {
				res.status(404).send(err);
			} else {
				res.status(500).send("error");
			}
		});
});

app.get("/search", function(req, res) {
	var user = req.user;
	
	var metros;
	var hoods;
	var tasks;
	db.metroArea.findAll()
		.then(function(resultMetros) {
			metros = resultMetros;
		})
		.then(function() {
			return db.neighborhood.findAll({ order: '"neighborhood" ASC' });
		})
		.then(function(resultHoods) {
			hoods = resultHoods;
		})
		.then(function() {
			return db.task.findAll({ order: '"task" ASC' });
		})
		.then(function(resultTasks) {
			tasks = resultTasks;
		})
		.then(function() {
			res.render("search", { user: user, metroAreas: metros, neighborhoods: hoods, tasks: tasks});			
		})
});

app.post("/results", function(req, res) {
	var user = req.user;
	var contacts;
	var tasks;

	if (req.body.provideTask == "") {
		req.body.provideTask = "anything"
	}

	if (req.body.wantTask == "") {
		req.body.wantTask = "anything"
	}

	var whereFilters = {};

	if (req.body.provideTask != "anything") {
		whereFilters.userWantTaskId = req.body.provideTask;
	}

	if (req.body.wantTask != "anything") {
		whereFilters.userNeedTaskId = req.body.wantTask;
	}

	var metroArea = req.body.metroArea;
	if (metroArea == "anything") {
		metroArea = null;
	}

	if (metroArea) {
		whereFilters.metroAreaId = metroArea;
	}

	if (user) {	
		whereFilters.facebookId = { $ne: user.facebookId }
	}

	db.user
		.findAll({
			where: whereFilters
		}).then(function(resultUsers) {
			if (resultUsers == "") {
				contacts = null;
			} else {
				contacts = resultUsers;
			}
		}).then(function() {
			return db.task.findAll()
		}).then(function(resultTasks) {
			tasks = resultTasks; 
		}).then(function(){
			res.render("results", {user: user, results: contacts, tasks: tasks});
		});
});

app.get("/message/:id", function(req, res) {
	var user = req.user;
	var contactId = req.params.id;
	res.render("message", { user: user, contactId: contactId});
});

app.post("/message", function(req, res) {
	var user = req.user;
	var senderInDb;
	var contactEmail;
	console.log("look here!!!" + req.body.contactId)
	db.user
		.findOne({
			where: ({ facebookId: user.facebookId })
		}).then(function(resultUser) {
			return senderInDb = resultUser;
		}).then(function() {
			return db.user.findOne({ where: {id: req.body.contactId} });
		}).then(function(resultUser) {
			return contactEmail = resultUser.email; 
		}).then(function() {
			//contactEmail
			mailer.sendAnEmail(senderInDb.email, contactEmail, req.body.message + os.EOL + os.EOL + "Sent from fellow user " + senderInDb.firstName + " " + senderInDb.lastName + " " + "(" + senderInDb.email + ").");
		}).then(function() {
			res.render("message-sent.ejs", {user: user});
		});
})


app.post("/", function(req, res) {
	var want = req.body.want;
	var can = req.body.can;

	res.send("want: " + want + ", provide: " + can);
});

app.get("/termsandconditions", function(req, res) {
	var user = req.user;
	res.render("tc.ejs", {user: user});
});


module.exports = server;

