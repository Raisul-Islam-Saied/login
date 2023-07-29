const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../model/user.model");
const bcrypt = require("bcrypt");
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });

      if (!user) {
        return done(null, false);
      }
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(err, false);
  }
});
