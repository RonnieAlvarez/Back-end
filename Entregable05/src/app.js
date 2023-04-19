/********************************************************************************* */
//
//  RONNIE ALVAREZ CASTRO  CODERHOUSE PROGRAMA FULLSTACK CURSO BACKEND
//
//  PROGRAMA QUE UTILIZA PARA EL TEST DE LA BASE DE DATOS 
//
//  DESAFIO COMPLEMENTARIO ENTREGABLE #5
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
import { createSocketServer } from './config/socketServer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
const hbs = exphbs.create({ helpers: { lookup: (obj, field) => obj[field] } });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', EcommerceRouter);
app.use('/api/', EchatRouter);
app.use('/menu/',EmenuRouter)

// Server
const server = app.listen(PORT, () => console.log(`Server up on PORT: ${PORT}`));
server.on('error', err => console.log(err));

// Socket server
createSocketServer(server);
