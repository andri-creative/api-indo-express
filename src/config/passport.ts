import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { loginWithGoogle } from "../services/auth.service";

console.log("🔥 PASSPORT CONFIG LOADED");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await loginWithGoogle(profile);
        done(null, user);
      } catch (err) {
        done(err as Error);
      }
    }
  )
);

export default passport;
