var express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github2");
require("dotenv").config();

var router = express.Router();

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/login/federated/github", passport.authenticate("github"));

router.get(
  "/oauth2/redirect/github",
  passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

console.log(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("accessToken", accessToken);
      done(null, profile);
    }
  )
);

module.exports = router;
