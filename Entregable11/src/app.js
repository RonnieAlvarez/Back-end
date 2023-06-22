/* eslint-disable no-undef */
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
import EmenuExtendRouter from "./dao/db/routers/custom/eMenu.router.js";
import EticketsExtendRouter from "./dao/db/routers/custom/eTicket.router.js";
import EcommerceExtendRouter from "./dao/db/routers/custom/eCommerce.router.js";
import ChatExtendRouter from "./dao/db/routers/custom/chat.router.js";
import compression from "express-compression";

import cors from "cors";
import config from "../src/config/config.js";
import MongoSingleton from "./config/MongoSingleton.js";
import { authToken } from "./utils.js";

const app = express();
const PORT = config.port || 8080;

//json settings postman
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
//app.use(compression()); este es el middleware de compression Gzip
// y es otro es el de Brotli
app.use(
    compression({
        level: 6,
        threshold: 1024,
        brotliEnabled: true,
        brotliThreshold: 1024,
        zlib: {},
    })
);
const pathPublic = path.join(__dirname, "/public");
app.use(express.static(pathPublic));

app.use(cookie());
app.use(cors());
const sessionMiddleware = session({
    store: mongoStore.create({
        mongoUrl: config.mongoUrl,
        collectionName: "sessions",
        Options: { userNewUrlParse: true, useUnifiedTopology: true },
        ttl: 24 * 60 * 60,
    }),
    secret: config.mongoSecret,
    resave: false,
    saveUninitialized: false,
});
app.use(sessionMiddleware);
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
const hbs = exphbs.create({});
hbs.handlebars.registerHelper("lookup", (obj, field) => obj[field]);
hbs.handlebars.registerHelper("substring", function (str, start, len) {
    return str.substr(start, len);
});
hbs.handlebars.registerHelper("select", function (value, options) {
    // Create a select element
    var select = document.createElement("select");
    // Populate it with the option HTML
    select.innerHTML = options.fn(this);
    // Set the value
    select.value = value;
    // Find the selected node, if it exists, add the selected attribute to it
    if (select.children[select.selectedIndex]) select.children[select.selectedIndex].setAttribute("selected", "selected");
    return select.innerHTML;
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routes
const chatExtendRouter = new ChatExtendRouter();
const ecommerceExtendRouter = new EcommerceExtendRouter();
const emenuExtendRouter = new EmenuExtendRouter();
const eticketsExtendRouter = new EticketsExtendRouter();

app.use("/products/", auth, authToken, ecommerceExtendRouter.getRouter()); //auth
app.use("/menu/", auth, authToken, emenuExtendRouter.getRouter()); //auth
app.use("/api/chat", auth, authToken, chatExtendRouter.getRouter());
app.use("/api/tickets", auth, authToken, eticketsExtendRouter.getRouter());
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/jwt", jwtRouter); // new
app.use("/", usersViewRouter);
app.get("*", (req, res) => {
    res.status(404).render("nopage", { messagedanger: "Cannot get that URL!!" });
});

// Captura el evento SIGINT (Ctrl+C) y realiza alguna acción
// eslint-disable-next-line no-unused-vars
process.on("SIGINT", (res) => {
    console.log("We recive a SIGINT signal. We are closing the Server...");
    process.exit(0); // Salida exitosa
});

// Server
const server = app.listen(PORT, () => {
    console.log(`Server up on PORT: ${PORT}`);
});

server.on("error", (err) => console.log(err));
// Socket server
createSocketServer(server);

const mongoInstance = async () => {
    try {
        await MongoSingleton.getInstance();
    } catch (error) {
        console.error(error);
    }
};
mongoInstance();
