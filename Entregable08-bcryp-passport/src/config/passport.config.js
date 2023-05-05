import passport from 'passport';
import passportLocal from 'passport-local';
import userModel from '../dao/db/models/ecommerce.model.js';
import { createHash, isValidPassword } from '../utils.js';


// Declaramos nuestra estrategia
const localStrategy = passportLocal.Strategy;

const initializePassport = ()=>{
    /**
      *  Inicializando la estrategia local, username sera para nosotros email.
      *  Done será nuestro callback
     */

    // estrategia register
    passport.use('register', new localStrategy(
        // passReqToCallback: para convertirlo en un callback de request, para asi poder iteracturar con la data que viene del cliente
        // usernameField: renombramos el username
        { passReqToCallback: true, usernameField: 'email' },
        async(req, username, password, done) =>{
            const { first_name, last_name, email, age, roll } = req.body;
            try {

                const exists = await userModel.findOne({ email });
                if (exists) {
                    console.log("El usuario ya existe.");
                    return done(null, false);
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age:age??21,
                    roll:'User',
                    password: createHash(password)
                };
                const result = await userModel.create(user);
                //Todo sale OK
                return done(null, result);
            } catch (error) {
                return done("Error registrando el usuario: " + error);
            }
        }

    ))
    //https://docs.google.com/document/d/1unNjlklxK-uWUpV3HvdlV9VbbKzyGfiHtXekI9wR35w/edit
    // https://github.com/AleHts29/51135-programacion-backend/blob/main/Clase_20/2-PassportLocal-Bcrypt/src/config/passport.config.js
    // https://coderhouse.zoom.us/rec/play/ix-JGF0Zt1Bz1pkgWhFnwulpXUk7J0UbvSCBRrHTUb9bECmBDWkwqUJu49vhDkKfqAaS_RqfGD7f_pc.XcwHlK-7enRebhJx?canPlayFromShare=true&from=share_recording_detail&continueMode=true&componentName=rec-play&originRequestUrl=https%3A%2F%2Fcoderhouse.zoom.us%2Frec%2Fshare%2FOn4nW_tjZuaCb5ArXfhiNqqIybKRhzo3Q0ISR0EO6YwJQEL2Encstn-bCIli1v_I.SWlpWCgigdRjgUFY
    // 1:40.08

    // estrategia login
    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
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
        })
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
}


export default initializePassport;