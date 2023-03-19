import { Router } from "express"
import prodManager from "../Classes/Contenedor.js";

const products = new prodManager("./src/Routes/products.json");
products.init();

const router = Router()


/********************************************************************************* */
// ----------------------------------------------------
// "http://localhost:9090/api/products?limit=2"
//
// router.get("/", async (req, res) => {
/* A function that is called when the user makes a GET request to the /products route. */
router.get("/", async (req, res) => {
  try{

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
  } catch{
    res.status(500).send(("Internal Server Error"));  }
  });
//
/********************************************************************************* */
///* A function that is called when the user makes a GET request to the /products/:pid route. */
router.get("/:pid", async function (req, res) {
  try {
    const pid = Number(req.params.pid);
    const arrayProducts = await products.getAll();
    /* Using the find method to find the product with the id that matches the pid. If it doesn't find
    it, it returns the object {Product:"Product not found"}. */
    const prodObj =
    arrayProducts.find((p) => p.id === pid) 
    if (!prodObj) {
      res.status(404).send("Product not found");
      return;
    }
    res.send(prodObj);
  } catch{
    res.status(500).send(("Internal Server Error"));  }
  });

//
/********************************************************************************* */
//
/* A function that is called when the user makes a POST request to the /products route. */
  router.post('/',async (req,res)=>{
    try{
      const { title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail} = req.body
        products.addProduct(
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail ? thumbnail :  ["sin imagen"]
          )
          res.send({status:"Success",msg:"Product Added"})
        }catch{
          res.status(500).send(("Internal Server Error"));
        }
})
//
/********************************************************************************* */
//
/* A function that is called when the user makes a PUT request to the /products/:pid route. */
router.put('/:pid', async (req,res)=>{
  try{
    const id= parseInt(req.params.pid)
    const newObj = {id,...req.body}
    products.UpdateProductById(newObj)
    res.send({status:"Success",msg:"Product Updated"})
  }catch{
    res.status(500).send(("Internal Server Error"));
  }
})
//
/********************************************************************************* */
//
/* Deleting the product by id. */
router.delete('/:pid', async (req,res)=>{
  try{
    const id= parseInt(req.params.pid)
    products.deleteById(id)
    res.send({status:"Success",msg:"Product Deleted"})
  }catch{
    res.status(500).send(("Internal Server Error"));
  }
})

export default router