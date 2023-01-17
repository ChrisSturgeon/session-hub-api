const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

module.exports = new JwtStrategy(options, async (req, jwt_payload, done) => {
  // Lookup user by ID from token payload sub
  try {
    const user = await User.findById(jwt_payload.sub);

    // Authenticate if user exists and attached userID to request object
    if (user) {
      req.userID = user._id;
      return done(null, user);
    } else {
      // Reject if user does not exist
      return done(null, false);
    }
  } catch (err) {
    // Reject if error
    done(err, null);
  }
});
