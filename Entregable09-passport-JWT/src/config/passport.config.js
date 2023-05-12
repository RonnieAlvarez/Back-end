import passport from "passport";
import passportLocal from "passport-local";
import userModel from "../dao/db/models/ecommerce.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
import dotenv from "dotenv";
import jwtStrategy from 'passport-jwt';


const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

dotenv.config();
const PRIVATE_KEY= process.env.JWTPRIVATE_KEY
const PORT= process.env.PORT
const GITCLIENTID=process.env.GITCLIENTID
const GITCLIENTSECRET=process.env.GITCLIENTSECRET

// Declaramos nuestra estrategia
const localStrategy = passportLocal.Strategy;

const initializePassport = () => {

  passport.use('jwt', new JwtStrategy(
    // extraer la  cookie
    {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    },
    // Ambiente Async
    async(jwt_payload, done)=>{
//        console.log("Entrando a passport Strategy con JWT.");
        try {
//            console.log("JWT obtenido del payload");
//            console.log(jwt_payload);
            return done(null, jwt_payload.user)
        } catch (error) {
            console.error(error);
            return done(error);
        }
    }
));




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
            roll: roll ?? "User",
            password: createHash(password),
            loggedBy: "LocalStrategy"
          };
          if (exists) {
    //        console.log("El usuario ya existe.");
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
  

  // estrategia login
  passport.use(
    "login",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
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
    console.log("serializando"+user)
    done(null, user);
  });

  passport.deserializeUser(async (id, done) => {
    console.log('deserializando '+ id)
    try {
      let user = await userModel.findById(id);
      console.log(user)
      done(null, user);
    } catch (error) {
      console.error("Error deserializando el usuario: " + error);
    }
  });
};

// Funcion para hacer la extraccion de la cookie
const cookieExtractor = req =>{
  let token = null;
  // console.log("Entrando a cookie extractor");
  if(req && req.cookies){ //Validamos que exista el request y las cookies.
  //   console.log("Cookies presentes!");
  //   console.log(req.cookies);
     token = req.cookies['jwtCookieToken'];
  //   console.log("token obtenido desde cookie");
  //   console.log(token);
  }
  return token;
}


export default initializePassport;
