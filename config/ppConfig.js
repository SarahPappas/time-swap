var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
var db = require("../models");

passport.serializeUser(function(user, callback) {
	callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
	db.user.findById(id).then(function(user) {
		callback(null, user);
	}).catch(callback);
});

passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_APP_SECRET,
	callbackURL: process.env.BASE_URL + "/auth/callback/facebook",
	profileFields: ["id", "email", "first_name", "last_name", "picture.type(large)"],
	enableProof: true
}, function(accessToken, refreshToken, profile, callback) {
	var email = profile.emails ? profile.emails[0].value : null;

	db.user.findOrCreate({
		where: {facebookId: profile.id},
		defaults: {
			facebookToken: accessToken,
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			email: email,
			picture: profile.photos[0].value
		}
	}).spread(function(user, created) {
		if(created) {
			return callback(null, user);
		} else {
			user.facebookToken = accessToken;
			user.save().then(function() {
				callback(null, user);
			}).catch(callback);
		}
	}).catch(callback);
}));

module.exports = passport;