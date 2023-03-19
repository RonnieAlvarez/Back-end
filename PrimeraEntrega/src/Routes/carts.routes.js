import { Router } from "express";
import cartManager from "../Classes/cartsManager.js";

const carts = new cartManager("./src/Routes/carts.json");
const router = Router();
carts.init();

//
/********************************************************************************* */
//
/* This is a route that is used to get all the carts. */
router.get("/", async (req, res) => {
  try {
    const array = await carts.getcartAll();
    res.send(array);
  } catch {
    res.status(500).send(err.message);
  }
});
//
/********************************************************************************* */
//
/* Getting a cart by id. */
router.get("/:cid", async function (req, res) {
  try {
    const cid = Number(req.params.cid);
    const arrayCarts = await carts.getcartAll();
    const CartsObj = arrayCarts.find((p) => p.id === cid);
    if (!CartsObj) {
      res.status(404).send("Product not found");
      return;
    }
    res.send(CartsObj);
  } catch {
    res.status(500).send("Internal Server Error");
  }
});
//
/********************************************************************************* */
//
/* Deleting a cart by id. */
router.delete("/:cid", async (req, res) => {
  try {
    const id = parseInt(req.params.cid);
    carts.deleteById(id);
    res.send({ status: "Success", msg: "Cart Deleted" });
  } catch {
    res.status(500).send("Internal Server Error");
  }
});
//
/********************************************************************************* */
//
/* Adding a new cart to the carts.json file. */
router.post("/", async (req, res) => {
  try {
    const { products } = req.body;
    carts.addCart(products);
    res.send({ status: "Success", msg: "Cart Added" });
  } catch {
    res.status(500).send("Internal Server Error");
  }
});
//
/********************************************************************************* */
//
/* The above code is adding a product to a cart. */
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const { products } = req.body;
    const arrayCarts = await carts.getcartAll();
    const Cart = arrayCarts.find((c) => c.id === cid);
    const addQuantity = products[0].quantity;
    if (!Cart) {
      res.status(404).send("Cart not found");
    }
    const ProductExist = Cart.products.findIndex((p) => p.pid === pid);
    if (ProductExist >= 0) {
      Cart.products[ProductExist].quantity =
        Cart.products[ProductExist].quantity + addQuantity;
      carts.save(arrayCarts);
      res.send({ status: "Success", msg: "Cart Added" });
    }
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

export default router;
