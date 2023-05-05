import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import userModel from "../dao/db/models/ecommerce.model.js";
import { createHash, isValidPassword } from "../utils.js";
const initializeGooglePassport = () => {
  // Get your client ID and secret from the Google Developer Console
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  /**
   * This is an asynchronous function that authenticates a user using their email and provider, creates
   * a new user if they don't exist, and returns the user object.
   * @param req - The request object, which contains information about the current HTTP request being
   * processed.
   * @param accessToken - The access token is a credential that is used by the client to access a
   * protected resource. In this case, it is likely an access token provided by the authentication
   * provider (such as Google or Facebook) that the user used to log in.
   * @param refreshToken - The refreshToken parameter is a token that can be used to obtain a new
   * access token when the current access token expires. It is typically used in OAuth2 authentication
   * flows.
   * @param profile - The `profile` parameter is an object that contains the user's profile information
   * obtained from the authentication provider (e.g. Google, Facebook, etc.). This information
   * typically includes the user's name, email address, profile picture, and other relevant details.
   * The structure and content of the `profile` object
   * @param done - The `done` parameter is a callback function that is called when the authentication
   * process is complete. It takes two arguments: an error object (if there was an error during
   * authentication) and a user object (if authentication was successful). The `done` function is
   * typically called at the end of the authentication
   * @returns The function `authUser` returns the result of the `done` callback function, which is
   * called with either an error object or a user object. If there is an error, the function returns an
   * error message with the prefix "Error registrando el usuario: ". If there is no error, the function
   * returns a user object with properties such as `first_name`, `last_name`, `email`,
   */
  const authUser = async (req, accessToken, refreshToken, profile, done) => {
    const email = profile.email;
    const loggedBy = profile.provider
    try {
      const exists = await userModel.findOne({ email });

      let password = createHash(email);
      let first_name = profile.given_name;
      let last_name = profile.family_name;
      let user = {
        first_name,
        last_name,
        email,
        age: 21,
        roll: "User",
        loggedBy,
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
      return done(null, user);
    } catch (error) {
      return done("Error registrando el usuario: " + error);
    }
  };
  // Configure the Google strategy
  
/* This code is configuring the Google authentication strategy for Passport.js. It creates a new
instance of the GoogleStrategy and passes in the client ID, client secret, and callback URL. It also
specifies the function to be called when a user is authenticated, which is `authUser`. This function
will receive the user's information from Google and will create or update a user in the database
accordingly. Finally, it registers the Google authentication strategy with Passport.js using the
`passport.use()` method. */
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: `/auth/google/callback`,
      //  passReqToCallback: true,
      },
      authUser
    )
  );


};

export default initializeGooglePassport;
