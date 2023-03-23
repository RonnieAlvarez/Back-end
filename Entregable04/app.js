//npm init -y  npm i express  
import express from 'express'
import products from "./scr/routers/products.routes.js";
import { engine } from "express-handlebars";

const _port = 3030
const app= express()
app.engine("handlebars", engine());
app.set("views", "./scr/views");
app.set("view engine", "handlebars");
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.listen(_port, () => {
    console.log(`Server up on port: ${_port}`)
})
app.use("/", products);

app.on('error', (err) => {
    console.log(err)
})
