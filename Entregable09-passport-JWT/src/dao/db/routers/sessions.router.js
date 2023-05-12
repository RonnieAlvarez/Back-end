import { Router } from "express";
import passport from "passport";
import {generateJWToken} from '../../../utils.js';

const router = Router();

// router.get("/current",passport.authenticate("login", { failureRedirect: "/users/register" }),
// async (req, res) => {
//   const token = req.cookies.jwtCookieToken
//     if (token){
//         const decoded = jwt_decode(tokens)
//         let user = decoded.user
//         req.user = user
//         next(null,req.user)
//     } 
//     if (!req.user){
//         res.status(401).redirect('/users/login');
//     }
// })



/* This code is defining two routes for GitHub authentication using Passport.js middleware. */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
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
  passport.authenticate("register", { failureRedirect: "/users/login" }),
  async (req, res) => {
    const user = req.user._doc;
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      roll: user.roll,
    };
    req.session.login = true;
    const sessemail = res.cookie("session-id", user.email);
    //return res.status(200).redirect("/");
    return res.status(201).redirect("/users/profile");
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
//      req.session.login = true;
//      const sessemail = res.cookie("session-id", email);
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
//    req.session.login = true;
//    const sessemail = res.cookie("session-id", user.email);
    return res.redirect("/");
  }
);

router.post(
  "/loginJWT",
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
    res.send({access_token:access_Token});
  //  const sessemail = res.cookie("session-id", user.email);
    return res.redirect("/",{access_token:access_Token});
  }
);
export default router;
