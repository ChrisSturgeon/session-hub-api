const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = new JwtStrategy(options, async (jwt_payload, done) => {
  // Lookup user by ID from token payload sub
  try {
    const found_user = await User.findById(jwt_payload.sub);

    // Authenticate if user exists
    if (found_user) {
      return done(null, found_user);
    } else {
      // Reject if user does not exist
      return done(null, false);
    }
  } catch (err) {
    // Reject if error
    done(err, null);
  }
});
