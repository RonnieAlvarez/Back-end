//npm init -y  npm i express  
import express from 'express'
import __dirname from "./utils.js"
import dotenv from 'dotenv'
import "./config/db.js"
import EcommerceRouter from './dao/routers/eCommerce.router.js'
import exphbs from "express-handlebars";
import { Server } from "socket.io";


dotenv.config()
const app= express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("src/public"));
const hbs = exphbs.create({
  // No es necesario establecer ninguna opción aquí
});
hbs.handlebars.registerHelper('lookup', function(obj, field) {
  return obj[field];
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set("views",__dirname + "/views");

app.use("/",EcommerceRouter);


const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => { console.log(`Server up on PORT: ${PORT}`)})
server.on('error', (err) => {console.log(err)})

const socketServer = new Server(server);

const messages = [];
socketServer.on("connection", (socket) => {
  console.log("New Connection");
  socket.emit("Welcome", { welcome: "Welcome", messages });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("message", (data) => {
    console.log("Server:", data);
    messages.push(data);
    socketServer.emit("message", data);
  });

  socket.on("newUser", (nombre) => {
    socket.broadcast.emit("newUser", nombre);
  });
});
