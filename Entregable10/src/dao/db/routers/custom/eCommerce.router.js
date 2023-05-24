import * as eProductController from "../../controllers/eproducts.controller.js";
import * as eCartController from "../../controllers/ecarts.controller.js";

import CustomRouter from './custom.router.js'

export default class CartsRouter extends CustomRouter {
  init () {

this.get("/realTimeProducts",  { policies: ['USER'] },eProductController.getRealProducts);
this.post("/realTimeProducts",  { policies: ['USER'] },eProductController.createRealProduct);
this.get("/realTimeProducts/delete",  { policies: ['USER'] },eProductController.deleteRealProduct);
this.get("/realTimeCarts", { policies: ['USER'] }, eCartController.getRealCarts);
this.post("/realTimeCarts",  { policies: ['USER'] },eCartController.createRealCart);
this.post("/realTimeCarts/add", { policies: ['USER'] }, eCartController.saveProductToCart);
this.get("/realTimeCart/delete",  { policies: ['USER'] },eCartController.deleteRealCart);
this.get("/",  { policies: ['USER'] },eProductController.getProducts);
this.post("/",  { policies: ['USER'] },eProductController.createProduct);
this.get("/:pid", { policies: ['USER'] }, eProductController.getProduct);
this.put("/:pid", { policies: ['USER'] }, eProductController.updateProduct);
this.delete("/:pid",  { policies: ['USER'] },eProductController.deleteProduct);
this.get("*", { policies: ['USER'] }, (req, res) => {
  res.status(404).send("Cannot get that URL!!");
});

}}