import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import config from "./config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

/**
 * The function checks if a given password matches the hashed password of a user using bcrypt.
  */
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

const PRIVATE_KEY = config.jwtKey

/**
 * This function generates a JSON Web Token (JWT) for a given user with a 24-hour expiration time.
 */
export const generateJWToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
    return token;
};

/**
 * This is a middleware function that verifies the authenticity of a token in the authorization header
 * of a request and grants access to the next function if the token is valid.
  */
export const authToken = (req, res, next) => {
    //const authHeader = req.headers.cookie;  //inicialmente era headers.authorization
    const authHeader = req.cookies.jwtCookieToken;  //inicialmente era headers.authorization
    //console.log(authHeader);    
    //console.log('utils 38')
    if (!authHeader)
        return res
            .status(401)
            .json({ message: "Token no valido", error: "Not autorized" });
    //const token = authHeader.split("=")[1]; // antes " "
    const token=authHeader
    //console.log(token)
    jwt.verify(token,PRIVATE_KEY, (error, credentials) => {
        if (error)
            return res
                .status(403)
                .json({ message: "Token no valido", error: "Not autorized" });
        req.user = credentials.user;
        
        next();
    });
};

/**
 * This is a function that returns a middleware for authenticating a user using a specified passport
 * strategy.
 */
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res
                    .status(401)
                    //.send({error: info.messages ? info.messages : info.toString()})
                    .redirect('/login')
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

/**
 * This is a middleware function that checks if the user has the required role to access a certain
 * route.
  */
export const authorization = (roll) => {
    return async (req, res, next) => {
        if (!req.user)
            return res.status(401).send("Unauthorized: User not found in JWT");
            if (req.user.roll.toUpperCase() !== roll.toUpperCase()) {            
            return res
                .status(403)
                .send("Forbidden: El usuario no tiene permisos con este rol.");
        }
        next();
    };
};

export default __dirname;
