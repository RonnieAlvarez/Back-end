import passport from "passport";
import passportLocal from "passport-local";
import userModel from "../dao/db/models/ecommerce.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
import dotenv from "dotenv";
dotenv.config();

const PORT= process.env.PORT
const GITCLIENTID=process.env.GITCLIENTID
const GITCLIENTSECRET=process.env.GITCLIENTSECRET

// Declaramos nuestra estrategia
const localStrategy = passportLocal.Strategy;

const initializePassport = () => {
  // estrategia github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: GITCLIENTID,
        clientSecret: GITCLIENTSECRET,
        callbackUrl: `http://localhost:&{PORT}/api/sessions/githubcallback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Profile obtenido del usuario GIT: ");
        console.log(profile);
        try {

          const user = await userModel.findOne({ email: profile._json.email });
          console.log("Usuario encontrado para login GIT:");
          console.log(user);
          if (!user) {
            console.warn(
              "User doesn't exists with username: " + profile._json.email
            );
            let namesplited = (profile._json.name).split(' ')
            let newUser = {
              first_name: namesplited[0],
              last_name: namesplited[1],
              age: 21,
              email: profile._json.email,
              password: createHash(profile._json.email),
              roll: "User",
              loggedBy: "GitHub",
            };
            const result = await userModel.create(newUser);
            return done(null, result);
          } else {
            //Si entramos por acá significa que el usuario ya existía.
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /**
   *  Inicializando la estrategia local, username sera para nosotros email.
   *  Done será nuestro callback
   */

  // estrategia register
  passport.use(
    "register",
    new localStrategy(
      // passReqToCallback: para convertirlo en un callback de request, para asi poder iteracturar con la data que viene del cliente
      // usernameField: renombramos el username
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, roll } = req.body;
        try {
          const exists = await userModel.findOne({ email });
          const user = {
            first_name,
            last_name,
            email,
            age: age ?? 21,
            roll: "User",
            password: createHash(password),
            loggedBy: "LocalStrategy"
          };
          if (exists) {
            console.log("El usuario ya existe.");
            const result = await userModel.findOneAndUpdate({email},user);
            return done(null, result);
          }
          const result = await userModel.create(user);
          //Todo sale OK
          return done(null, result);
        } catch (error) {
          return done("Error registrando el usuario: " + error);
        }
      }
    )
  );
  //https://docs.google.com/document/d/1unNjlklxK-uWUpV3HvdlV9VbbKzyGfiHtXekI9wR35w/edit
  // https://github.com/AleHts29/51135-programacion-backend/blob/main/Clase_20/2-PassportLocal-Bcrypt/src/config/passport.config.js
  // https://coderhouse.zoom.us/rec/play/ix-JGF0Zt1Bz1pkgWhFnwulpXUk7J0UbvSCBRrHTUb9bECmBDWkwqUJu49vhDkKfqAaS_RqfGD7f_pc.XcwHlK-7enRebhJx?canPlayFromShare=true&from=share_recording_detail&continueMode=true&componentName=rec-play&originRequestUrl=https%3A%2F%2Fcoderhouse.zoom.us%2Frec%2Fshare%2FOn4nW_tjZuaCb5ArXfhiNqqIybKRhzo3Q0ISR0EO6YwJQEL2Encstn-bCIli1v_I.SWlpWCgigdRjgUFY
  // 1:40.08

  // estrategia login
  passport.use(
    "login",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          //        console.log("Usuario encontrado para login:");
          //      console.log(user);
          if (!user) {
            console.warn("User doesn't exists with username: " + username);
            return done(null, false);
          }
          if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + username);
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Funciones de Serializacion y Desserializacion
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      console.error("Error deserializando el usuario: " + error);
    }
  });
};

export default initializePassport;
