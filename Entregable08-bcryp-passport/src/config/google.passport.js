import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import userModel from "../dao/db/models/ecommerce.model.js";
import { createHash, isValidPassword } from "../utils.js";
const initializeGooglePassport = () => {
  // Get your client ID and secret from the Google Developer Console
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const authUser = async (req, accessToken, refreshToken, profile, done) => {
    const email = profile.email;
    try {
      const exists = await userModel.findOne({ email });

      let password = createHash(email);
      let first_name = profile.given_name;
      let last_name = profile.family_name;
      //email=profile.email
      let user = {
        //_id,
        first_name,
        last_name,
        email,
        age: 21,
        roll: "User",
        password,
      };
      if (exists) {
        let _id = exists._id;
        console.log("El usuario ya existe. " + _id);
        if (!profile.email_verified) {
          console.warn("Invalid credentials for user: " + displayName);
          return done(null, false);
        }
        user = { ...user, _id };
        //return done(null, user);
      } else {
        const result = await userModel.create(user);
        let _id = result._id;
        user = { ...user, _id };
      }
      //Todo sale OK
      req.session.login=true;
      const sessemail = res.cookie('session-id',email);
      return done(null, user);
    } catch (error) {
      return done("Error registrando el usuario: " + error);
    }
  };
  // Configure the Google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: "/auth/google/callback",
      //  passReqToCallback: true,
      },
      authUser
    )
  );

  //https://www.youtube.com/watch?v=Q0a0594tOrc

  passport.serializeUser((user, done) => {
    console.log(`\n--------> Serialize User:`);
    console.log(user);
    // The USER object is the "authenticated user" from the done() in authUser function.
    // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.

    done(null, user);
  });

  passport.deserializeUser((_id, done) => {
    console.log("\n--------- Deserialized User:");
    console.log(user);
    // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
    // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.
    //done(null, user._id);
    done(null, user);
  });
};

export default initializeGooglePassport;
