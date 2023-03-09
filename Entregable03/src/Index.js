/********************************************************************************* */
//
//  ENTREGABLE 03 RONNIE ALVAREZ CASTRO  CODERHOUSE PROGRAMA FULLSTACK CURSO BACKEND
// 
/********************************************************************************* */
//         Servidor con express
//
/********************************************************************************* */
import express from "express";
import prodManager from "./Contenedor.js";
//Desarrollar un servidor express que, en su archivo app.js
//importe al archivo de ProductManager que actualmente tenemos.

const app = express();
const port = 8080;
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`<p style="color:blue">Bienvenidos al Servidor Express!!</p>`);
});

const products = new prodManager("./src/archivo.txt");
products.init(); // lee el archivo y si no existe los crea con los datos de prueba
/********************************************************************************* */
//El servidor debe contar con los siguientes endpoints
//ruta ‘/products’, la cual debe leer el archivo de productos
//y devolverlos dentro de un objeto.
//
// Agregar el soporte para recibir por query param el valor ?limit= el cual
// recibirá un límite de resultados.
//Si no se recibe query de límite, se devolverán todos los productos
//Si se recibe un límite, sólo devolver el número de productos solicitados
// ----------------------------------------------------
//app.get("/products", async (req, res)
app.get("/products", async (req, res) => {
  const { limit } = req.query;
  if (!limit) {
    res.send(await  products.getAll());
  }
  if (limit!==undefined){
    const climit = Number(limit);
    const array = await  products.getAll();
    const dataLimit = array.slice(0, climit);
    res.send(dataLimit);
  }
});
/********************************************************************************* */
// ----------------------------------------------------
// app.get("/products/:pid", async function (req, res)
app.get("/products/:pid", async function (req, res) {
  //ruta ‘/products/:pid’, la cual debe recibir por req.params
  // el pid (product Id), y devolver sólo el producto solicitado,
  // en lugar de todos los productos.
  const pid = Number(req.params.pid);
  const arrayProducts = await products.getAll();
  const prodObj =
    arrayProducts.find((p) => p.id === pid) ?? {Product:"Product not found"};
  res.send(prodObj);
});
/********************************************************************************* */
app.listen(8080, () => console.log("Servidor up!! on port 8080"));
/********************************************************************************* */
