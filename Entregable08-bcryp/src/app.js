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

// View engine
const hbs = exphbs.create({ helpers: { lookup: (obj, field) => obj[field] } });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/products/", auth,EcommerceRouter);
app.use("/api/", EchatRouter);
app.use("/menu/", auth,EmenuRouter);
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", auth, menuprincipal);

// Server
const server = app.listen(PORT, () =>
  console.log(`Server up on PORT: ${PORT}`)
);
server.on("error", (err) => console.log(err));

// Socket server
createSocketServer(server);
