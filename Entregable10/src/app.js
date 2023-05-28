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
import "./config/db.js";
import { createSocketServer } from "./config/socketServer.js";
import mongoStore from "connect-mongo";
import cookie from "cookie-parser";
import session from "express-session";
import auth from "./middlewares/auth.middleware.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
// Import Routers

import usersViewRouter from "./dao/db/routers/users.views.router.js";
import sessionsRouter from "./dao/db/routers/sessions.router.js";
import jwtRouter from "./dao/db/routers/jwt.router.js";
import EmenuExtendRouter from './dao/db/routers/custom/eMenu.router.js'
import EcommerceExtendRouter from './dao/db/routers/custom/eCommerce.router.js'
import ChatExtendRouter from './dao/db/routers/custom/chat.router.js'
import favicon from 'serve-favicon'
import cors from 'cors'

import config from '../src/config/config.js'
import { authToken } from "./utils.js";

const app = express();
const PORT = config.port || 8080

//json settings postman
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
const pathPublic = path.join(__dirname, "/public");
app.use(express.static(pathPublic));
app.use(favicon(__dirname + '/public/imgs/shopping-cart-icon-29088-Windows.ico'));
app.use(cookie());
app.use(cors());
app.use(
    session({
        store: mongoStore.create({
            mongoUrl: config.mongoUrl,   //process.env.MONGO_URI,
            collectionName: "sessions",
            Options: {
                userNewUrlParse: true,
                useUnifiedTopology: true,
            },
            ttl: 24*60*60,
        }),
        secret: config.mongoSecret,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24*60*60 },
    })
);
app.use(cookieParser(`${config.cookiePassword}`));

//Middleware Passport
initializePassport();

app.use(passport.initialize()); // init passport on every route call
app.use(passport.session()); //allow passport to use "express-session"

/* This code is creating a middleware function that logs the HTTP method and URL of every incoming
request to the server. It then calls the `next()` function to pass control to the next middleware
function in the chain. */
app.use(function (req, res, next) {
    console.log("%s %s", req.method, req.url);
    
    next();
});

// View engine
const hbs = exphbs.create({ helpers: { lookup: (obj, field) => obj[field] } });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routes
const chatExtendRouter = new ChatExtendRouter();
const ecommerceExtendRouter = new EcommerceExtendRouter();
const emenuExtendRouter = new EmenuExtendRouter();

app.use("/products/",auth,authToken, ecommerceExtendRouter.getRouter());//auth
app.use("/api/chat",auth,authToken, chatExtendRouter.getRouter());
app.use("/menu/", auth,authToken, emenuExtendRouter.getRouter());//auth
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/jwt", jwtRouter); // new
app.use("/",usersViewRouter); 



// Captura el evento SIGINT (Ctrl+C) y realiza alguna acción
process.on('SIGINT', (res) => {
    // Realiza cualquier limpieza necesaria
    // Cierra la conexión a la base de datos, etc.
    console.log('We recive a SIGINT signal. We are closing the Server...')
    process.exit(0); // Salida exitosa
  });


// Server
const server = app.listen(PORT, () =>{
    console.log(`Server up on PORT: ${PORT}`)
//    console.log(process.argv.slice(2))
});

server.on("error", (err) => console.log(err));

// Socket server
createSocketServer(server);

