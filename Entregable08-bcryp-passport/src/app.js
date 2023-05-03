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
import EcommerceRouter from "./dao/db/routers/eCommerce.router.js";
import EchatRouter from "./dao/db/routers/eChat.router.js";
import EmenuRouter from "./dao/db/routers/eMenu.router.js";
import { createSocketServer } from "./config/socketServer.js";
import mongoStore from "connect-mongo";
import usersViewRouter from "./dao/db/routers/users.views.router.js";
import sessionsRouter from "./dao/db/routers/sessions.router.js";
import cookie from "cookie-parser";
import session from "express-session";
import { menuprincipal } from "./dao/db/controllers/emenu.controller.js";
import auth from "./middlewares/auth.middleware.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import initializeGooglePassport from "./config/google.passport.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
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
      ttl: 40,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 50000 },
  })
);
//Middleware Passport
initializePassport()
initializeGooglePassport()
app.use(passport.initialize()) // init passport on every route call
app.use(passport.session())    //allow passport to use "express-session"

app.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile'],
  prompt: 'select_account'
}));

app.get('/auth/google/callback', passport.authenticate('google', {
   successRedirect: '/',
   failureRedirect: '/users/register'
 }));
 //app.use(passport.session())

// View engine
const hbs = exphbs.create({ helpers: { lookup: (obj, field) => obj[field] } });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/products/", auth,EcommerceRouter);
app.use("/api/",auth, EchatRouter);
app.use("/menu/", auth,EmenuRouter);
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/",auth, menuprincipal);

// Server
const server = app.listen(PORT, () =>
  console.log(`Server up on PORT: ${PORT}`)
);

//Use the req.isAuthenticated() function to check if user is Authenticated
const checkAuthenticated = (req, res, next) => {
  console.log(req.isAuthenticated())
if (req.isAuthenticated()) { return next() }
res.redirect("/")
}

//Define the Protected Route, by using the "checkAuthenticated" function defined above as middleware
app.get("/", checkAuthenticated, (req, res) => {
  let user = req.user._doc;
  const name = user.first_name+' '+user.last_name
  user={name,...user}
res.render("menuprincipal",{user})
})

//Define the Logout
app.post("/logout", (req,res) => {
  req.logOut()
  res.redirect("/users/login")
  console.log(`-------> User Logged out`)
})

server.on("error", (err) => console.log(err));

// Socket server
createSocketServer(server);
