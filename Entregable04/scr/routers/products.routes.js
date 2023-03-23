import { Router } from "express"
import prodManager from "../Classes/Contenedor.js";

let products = [];
const router = Router()
const path="scr/public/products.json"
const productList = new prodManager(path);
//productList.writeEmpty()


router.get("/", async (req, res) => {
  try{
    productList.init();
    products = await  productList.getAll()
    return res.render("home",  {productsa: products} );
  } catch{
    res.status(500).send(("Internal Server Error"));  
  }
});


router.get("/realTimeProducts", async (req, res) => {
  try{
    productList.init();
    products = await  productList.getAll()
    return res.render("realTimeProducts",  {productsa: products} );
  } catch{
    res.status(500).send(("Internal Server Error"));  
  }
});

router.post("/", (req, res) => {
  console.log("Se ingreso producto");
  let product = req.body;
  if (product.title != "" && product.price != "" && product.description != "" && product.code != "" && product.stock != "" && product.category != "") {
    product = { ...product, id: products.length + 1 };
    products = [...products, product];
    res.render("form", { products: products });
  } else {
    res.render("form", { products: products });
  }
});


router.get("/er", async (req, res) => {
  try{
      this.products= await  productList.getAll()
      //res.render('form',{products:this.products})
      res.render("home", { products: this.products });
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