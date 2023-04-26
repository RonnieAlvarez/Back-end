/********************************************************************************* */
//
//  RONNIE ALVAREZ CASTRO  CODERHOUSE PROGRAMA FULLSTACK CURSO BACKEND
//
//  Aplicativo para Ecommerce
//
//  Desafio Entregable 07  Auth Login
//
/********************************************************************************* */
import __dirname from "./utils.js"
import express from 'express';
import path from 'path';
import exphbs from 'express-handlebars';
import dotenv from 'dotenv';
import './config/db.js';
import EcommerceRouter from './dao/db/routers/eCommerce.router.js';
import EchatRouter from './dao/db/routers/eChat.router.js';
import EmenuRouter from './dao/db/routers/eMenu.router.js';
import eloginRouter from './dao/db/routers/elogin.router.js';
import { createSocketServer } from './config/socketServer.js';
import cookie from "cookie-parser";
import session from "express-session";
import mongoStore from 'connect-mongo'
import auth from "../src/middlewares/auth.middleware.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookie());
app.use(session({ 
  store: mongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: 'sessions',
    Options:{
      userNewUrlParse:true,
      useUnifiedTopology:true
    },
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized:false,
  cookie: {maxAge: 50000}
}));

// View engine
const hbs = exphbs.create({ helpers: { lookup: (obj, field) => obj[field] } });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routes

app.use('/products/',auth, EcommerceRouter);
app.use('/api/',auth, EchatRouter);
app.use('/menu/',auth, EmenuRouter)
app.use('/',eloginRouter)

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/public/html/login.html');
});

// Server
const server = app.listen(PORT, () => console.log(`Server up on PORT: ${PORT}`));
server.on('error', err => console.log(err));

// Socket server
createSocketServer(server);
