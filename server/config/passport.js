const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/v1/auth/google/callback",
  proxy: true
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value }
        ]
      });

      if (user) {
        // Update googleId if they signed up with email before
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      // Create new user if not exists
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        avatar: profile.photos[0].value,
        isVerified: true // Social accounts are pre-verified
      });

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

// GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/api/v1/auth/github/callback",
  proxy: true
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({
        $or: [
          { githubId: profile.id },
          { email: profile.emails[0].value }
        ]
      });

      if (user) {
        if (!user.githubId) {
          user.githubId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        name: profile.displayName || profile.username,
        email: profile.emails[0].value,
        githubId: profile.id,
        avatar: profile._json.avatar_url,
        isVerified: true
      });

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

// Discord Strategy
if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/discord/callback",
    scope: ['identify', 'email'],
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ 
        $or: [{ discordId: profile.id }, { email: profile.email }]
      });

      if (user) {
        if (!user.discordId) {
          user.discordId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      user = await User.create({
        name: profile.global_name || profile.username,
        email: profile.email,
        discordId: profile.id,
        avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
        isVerified: true
      });

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));
} else {
  console.warn('⚠️ Discord Client ID/Secret missing. Discord Login disabled.');
}

module.exports = passport;
