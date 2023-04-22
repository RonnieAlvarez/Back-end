/********************************************************************************* */
//
//  RONNIE ALVAREZ CASTRO  CODERHOUSE PROGRAMA FULLSTACK CURSO BACKEND
//
//  Aplicativo para Ecommerce
//
//  SEGUNDA PRENTREGA DEL PROYECTO FINAL
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
app.use('/products/', EcommerceRouter);
app.use('/api/', EchatRouter);
app.use('/menu/',EmenuRouter)


/* This code block is defining a route for the root URL ("/") of the application using the HTTP GET
method. When a user navigates to the root URL, the server will respond by sending an HTML page to
the client's browser. The HTML page includes a dropdown menu with links to different endpoints of
the application, such as the products list, real-time products, real-time carts, and real-time chat.
The page also includes a message informing the user that all endpoints are working and that they can
use Postman to interact with the API. The HTML page is generated using Handlebars templates and
Bootstrap CSS and JavaScript libraries. */
app.get('/', (req, res) => {
    const menu = `
    <div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Dropdown Menu
  </button>
  <ul class="dropdown-menu dropdown-menu-dark" >
    <li><a class="dropdown-item" href="/menu/menu">Products filters</a></li>  
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="/products/">Products List</a></li>
    <li><a class="dropdown-item" href="/products/realTimeProducts/">RealTimeProducts</a></li>
    <li><a class="dropdown-item" href="/products/RealTimeCarts/">RealTimeCarts</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="/api/Chat/">RealTimeChat</a></li>

  </ul>
  
  </div>
    `;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>My Ecommerce App</title>
          <!-- JavaScript Bundle with Popper -->
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
        </head>
        <body>
        <div class='container d-flex flex-column mt-2 m-2 p-2 m-auto bg-info rounded align-items-center'
        <div class='container '>
        <h1>Welcome to My Ecommerce App</h1>
        ${menu}
        <P class='container w-75 mt-4'>All end-points are working besides you can use postman to point methods like get, post,put and delete. ej: localhost:3033/products/3 to get the product with id 3.</P>
        </div>
        </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        
      </html>
    `;
    
    res.send(html);
  });

// Server
const server = app.listen(PORT, () => console.log(`Server up on PORT: ${PORT}`));
server.on('error', err => console.log(err));

// Socket server
createSocketServer(server);
