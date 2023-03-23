import express from 'express'
import { engine } from "express-handlebars";
import productsRouter from "./scr/routers/products.routes.js";
import { Server } from "socket.io"
import __dirname from './scr/utils.js';

const app= express()
const _port = 3031
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static( __dirname+"/public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname+"/views");
app.use("/", productsRouter);

//ruta prueba
app.use("/api/users", (req, res) => {
  res.json({ user: [] });
});

const server = app.listen(_port, () => {console.log(`Server up on port: ${_port}`)})
server.on('error', (err) => { console.log(err)})
//const socketServer = new Server(server,{path:"/src/"});
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(socket.id)
  console.log("Nuevo cliente conectado");
  socket.emit('announcements', { message: 'A new user has joined!' });
socket.on("disconnect", () => {
  console.log("Cliente desconectado");
  })
});
