const express = require("express");
const app = express();
require("./config/db");
const config = require("./config/config");
const bcrypt = require("bcrypt");
const saltRound = 10;
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const User = require("./model/user.model");
const MongoStore = require("connect-mongo");
require("./config/passport");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
    store: MongoStore.create({
      mongoUrl: config.db.url,
      collectionName: "sessions",
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
//home route
app.get("/", (req, res) => {
  res.render("index");
});

//register route
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (user) {
      res.status(400).send("user is already exit");
    } else {
      bcrypt.hash(password, saltRound, async (err, hash) => {
        const newUser = new User({ username, password: hash });
        await newUser.save();
        res.status(200).redirect("/login");
      });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const checkLoggedin = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/profile");
  } else {
    next();
  }
};
//login route
app.get("/login", checkLoggedin, (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  })
);

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};
//profile route
app.get("/profile", checkAuthenticated, (req, res) => {
  res.render("profile");
});

//home route
app.get("/logout", (req, res) => {
  try {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
