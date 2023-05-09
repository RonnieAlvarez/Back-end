/********************************************************************************* */
//
//  RONNIE ALVAREZ CASTRO  CODERHOUSE PROGRAMA FULLSTACK CURSO BACKEND
//
//  Aplicativo para Ecommerce
//
//
/********************************************************************************* */
import __dirname from "./utils.js";
import express from "express";
import path from "path";
import exphbs from "express-handlebars";
import dotenv from "dotenv";
import "./config/db.js";
import { createSocketServer } from "./config/socketServer.js";
import mongoStore from "connect-mongo";
import cookie from "cookie-parser";
import session from "express-session";
import { menuprincipal } from "./dao/db/controllers/emenu.controller.js";
import auth from "./middlewares/auth.middleware.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import initializeGooglePassport from "./config/google.passport.js";
import cookieParser from "cookie-parser";


// Import Routers
import githubLoginViewRouter from "./dao/db/routers/github-login.views.router.js";
import usersViewRouter from "./dao/db/routers/users.views.router.js";
import sessionsRouter from "./dao/db/routers/sessions.router.js";
import EcommerceRouter from "./dao/db/routers/eCommerce.router.js";
import EchatRouter from "./dao/db/routers/eChat.router.js";
import EmenuRouter from "./dao/db/routers/eMenu.router.js";
import jwtRouter from "./dao/db/routers/jwt.router.js"
import usersRouter from "./dao/db/routers/user.router.js"

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;

//json settings postman
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
const pathPublic =path.join(__dirname, "/public")
app.use(express.static(pathPublic));
app.use(cookie());
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
      Options: {
        userNewUrlParse: true,
        useUnifiedTopology: true,
      },
      ttl: 140,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 150000 },
  })
);
app.use(cookieParser('Coder$3crtC0d3clav'));

//Middleware Passport
initializePassport();
initializeGooglePassport();
app.use(passport.initialize()); // init passport on every route call
app.use(passport.session()); //allow passport to use "express-session"

/* This code is setting up a route for Google OAuth 2.0 authentication. When a user navigates to this
route, the `passport.authenticate` middleware is called with the `'google'` strategy and the
specified options. This middleware initiates the authentication process with Google and redirects
the user to the Google login page. Once the user logs in and grants permission to the requested
scopes, Google will redirect the user back to the callback URL specified in the Google Developer
Console. */
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  }),
  async (req, res) => {}
);

/* This code is handling the callback URL that is called after a user successfully authenticates with
Google using OAuth 2.0. It uses the `passport.authenticate` middleware to handle the authentication
process and redirect the user to the appropriate page based on whether the authentication was
successful or not. If the authentication was successful, it sets the user's session data and
redirects them to the home page. */
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    //  successRedirect: '/',
    failureRedirect: "/users/register",
  }),
  async (req, res) => {
    const user = req.user;
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      roll: user.roll,
    };
    req.session.admin = true;
    res.status(401).redirect('/users/login');
    //res.redirect("/");
  }
);

// View engine
const hbs = exphbs.create({ helpers: { lookup: (obj, field) => obj[field] } });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routes

app.use("/products/",auth,  EcommerceRouter);
app.use("/api/", EchatRouter);
app.use("/menu/",auth,  EmenuRouter);
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/jwt", jwtRouter);  // new
app.use("/api/users", usersRouter);  // new
app.use("/", auth, menuprincipal);
app.use("/github", githubLoginViewRouter);

// Server
const server = app.listen(PORT, () =>
  console.log(`Server up on PORT: ${PORT}`)
);

//Use the req.isAuthenticated() function to check if user is Authenticated
// const checkAuthenticated = (req, res, next) => {
//   console.log(req.isAuthenticated());
//   if (req.isAuthenticated()) {
//     return next();
//   } else {res.redirect('/users/login');}
//   res.redirect("/");
// };

//Define the Protected Route, by using the "checkAuthenticated" function defined above as middleware
// app.get("/", checkAuthenticated, (req, res) => {
//   let user = req.user._doc;
//   const name = user.first_name + " " + user.last_name;
//   user = { name, ...user };
//   res.render("menuprincipal", { user });
// });

server.on("error", (err) => console.log(err));

// Socket server
createSocketServer(server);
