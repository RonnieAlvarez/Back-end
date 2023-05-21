import { Router } from "express";
import passport from "passport";
import {generateJWToken} from '../../../utils.js';

const router = Router();

/* This code is defining two routes for GitHub authentication using Passport.js middleware. */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    window.location.replace("/users");

//    res.status(200).redirect("/")
  }
);

/* This code defines a route for handling the callback from GitHub authentication using Passport.js
middleware. When the user is successfully authenticated, the code retrieves the user information
from the `req.user` object and stores it in the session object as `req.session.user`. It also sets
the `req.session.admin` flag to `true`. Finally, it redirects the user to the `/github` route. If
the authentication fails, it redirects the user to the `/github/error` route. */
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/github/error" }),
  async (req, res) => {
    const user = req.user;
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      roll: user.roll,
    };
    req.session.admin = true;
    res.redirect("/github");
  }
);

/* This code is defining a route for user registration. It uses Passport.js middleware to authenticate
the registration process. If the registration fails, it redirects the user to the `/users/register`
route. If the registration is successful, it returns a status code of 201 and redirects the user to
the `/users/login` route. */
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/api/jwt/current" }),
  async (req, res) => {
    const user = req.user._doc;
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      roll: user.roll,
    };
    return res.status(200).redirect("/users/login");
  }
);

/* This code is defining a route for user login. It uses Passport.js middleware to authenticate the
login process. If the login is successful, it retrieves the user information from the `req.user`
object and stores it in the session object as `req.session.user`. It also sets the
`req.session.login` flag to `true`. Finally, it redirects the user to the home page. If the login
fails, it redirects the user to the `/users/register` route with a status code of 401. It also sets
a cookie with the user's email as the session ID. */
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/users/register" }),
  async (req, res) => {
    const { email, password } = req.body;
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.user = {
        name: "CoderHouse",
        email: email,
        age: 21,
        roll: "Admin",
      };
      return res.redirect("/");
    }
    const user = req.user._doc;
    if (!user) return res.status(401).redirect("/users/register");
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      roll: user.roll,
    };
    return res.redirect("/");
  }
);

/* This code is defining a route for retrieving the current user's information and generating a JSON
Web Token (JWT) for authentication purposes. It uses Passport.js middleware to authenticate the
login process. If the login is successful, it retrieves the user information from the `req.user`
object and stores it in the `user` variable. If the user is an admin, it sets the `req.user` object
to a hardcoded admin user object. If the user is not an admin, it sets the `req.user` object to the
retrieved user information. It then generates a JWT using the `generateJWToken` function and sends
it back to the client in a JSON object with the key `access_token`. Finally, it redirects the user
to the home page with the `access_token` as a query parameter. */
router.post(
  "/current",
  passport.authenticate("login", { failureRedirect: "/users/register" }),
  async (req, res) => {
    const { email, password } = req.body;
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.user = {
        name: "CoderHouse",
        email: email,
        age: 21,
        roll: "Admin",
      };
      return res.redirect("/");
    }
    const user = req.user;
    if (!user) return res.status(401).redirect("/users/register");
     req.user = {
       name: `${user.first_name} ${user.last_name}`,
       email: user.email,
       age: user.age,
       roll: user.roll,
     };
    const access_Token = generateJWToken(user)
    console.log(access_Token);
    req.headers.Authorization=`Bearer ${access_Token}`
    console.log('session linea 123: '+req.headers.Authorization)
    res.send({access_token:access_Token});
    return res.redirect("/",{access_token:access_Token});
  }
);

export default router;
