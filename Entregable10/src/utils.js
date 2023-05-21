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
 * @param user - The user object contains information about a user, including their password which is
 * hashed using bcrypt.
 * @param password - The password parameter is the password that the user is trying to authenticate
 * with. It is passed as an argument to the isValidPassword function.
 * @returns The function `isValidPassword` is returning a boolean value that indicates whether the
 * provided `password` matches the hashed password stored in the `user` object. It uses the
 * `bcrypt.compareSync()` method to compare the two passwords and returns `true` if they match, and
 * `false` otherwise.
 */
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

const PRIVATE_KEY = config.jwtKey

/**
 * This function generates a JSON Web Token (JWT) for a given user with a 24-hour expiration time.
 * @param user - The user parameter is an object that contains the user's information, such as their
 * username, email, and any other relevant data that needs to be included in the JWT token. This
 * information is used to identify the user and grant them access to protected resources.
 * @returns The function `generateJWToken` returns a JSON Web Token (JWT) that is generated using the
 * `jwt.sign` method from the `jsonwebtoken` library. The token contains the `user` object as its
 * payload and is signed using a private key (`PRIVATE_KEY`). The token is set to expire in 24 hours.
 */
export const generateJWToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
//    console.log('token generado utils linea 41 :'+token)
//    req.headers.authorization = `Bearer ${access_token}`;
    //res.set('Authorization',`Bearer ${token}`)
//    res.send('Token generado' )
    return token;
};

/**
 * This is a middleware function that verifies the authenticity of a token in the authorization header
 * of a request and grants access to the next function if the token is valid.
 * @param req - req stands for request and it is an object that contains information about the incoming
 * HTTP request such as headers, query parameters, request body, etc.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client making the request. It contains methods and properties that allow you to set the status code,
 * headers, and body of the response. In this specific code snippet, it is used to send a JSON response
 * @param next - next is a function that is called to pass control to the next middleware function in
 * the stack. If the current middleware function does not end the request-response cycle, it must call
 * next() to pass control to the next middleware function. If next() is not called, the request will be
 * left hanging and
 * @returns The code exports a middleware function named `authToken` that checks for the presence of an
 * authorization header in the incoming request. If the header is not present, the function returns a
 * 401 status code with a JSON response containing an error message and a "Not authorized" error. If
 * the header is present, the function extracts the token from the header, verifies it using a private
 * key, and if
 */
export const authToken = (req, res, next) => {
    const authHeader = req.headers.cookie;
//    const auxhet = authHeader.split("=")[1];
//    const token1 = authHeader.split(".")[1];
//    console.log(authHeader);
    if (!authHeader)
        return res
            .status(401)
            .json({ message: "Token no valido", error: "Not autorized" });
    const token = authHeader.split("=")[1];
    
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
 * @param strategy - The strategy parameter is a string that represents the name of the authentication
 * strategy to be used by Passport.js. This strategy is used to authenticate the user and determine
 * whether the user is authorized to access the requested resource. Examples of authentication
 * strategies include local, JWT, OAuth, and OpenID.
 * @returns A higher-order function that takes a strategy as an argument and returns an asynchronous
 * function that authenticates the user using Passport middleware. The returned function takes three
 * arguments: `req`, `res`, and `next`. It calls `passport.authenticate()` with the provided strategy
 * and a callback function that handles errors and sets the authenticated user on the `req` object. If
 * authentication fails, it sends a 401
 */
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        //        console.log("Entrando a llamar strategy: ");
        //        console.log(strategy);
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res
                    .status(401)
                    .send({
                        error: info.messages ? info.messages : info.toString(),
                    });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};
/**
 * The function capitalizes the first letter of a given string.
 * @param str - The input string that needs to be capitalized.
 * @returns The function `capitalizeFirstLetter` is returning a string with the first letter
 * capitalized. It takes a string as an argument, and returns the same string with the first letter
 * capitalized.
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * This is a middleware function that checks if the user has the required role to access a certain
 * route.
 * @param roll - The role that is required to access a certain route or perform a certain action. It is
 * passed as an argument to the authorization function.
 * @returns A higher-order function that takes a roll parameter and returns an asynchronous middleware
 * function that checks if the user exists in the request object and has the specified roll. If the
 * user is not found or has a different roll, it sends an error response. If the user has the correct
 * roll, it calls the next middleware function.
 */
export const authorization = (roll) => {
    return async (req, res, next) => {
        if (!req.user)
            return res.status(401).send("Unauthorized: User not found in JWT");
        if (req.user.roll !== capitalizeFirstLetter(roll)) {
            return res
                .status(403)
                .send("Forbidden: El usuario no tiene permisos con este rol.");
        }
        next();
    };
};

export default __dirname;
