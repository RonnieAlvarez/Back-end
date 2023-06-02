import * as eProductController from "../../controllers/eproducts.controller.js";
import * as eCartController from "../../controllers/ecarts.controller.js";

import CustomRouter from './custom.router.js'

export default class CartsRouter extends CustomRouter {
  init () {

this.get("/realTimeProducts",  { policies: ['USER','ADMIN'] },eProductController.getRealProducts);
this.post("/realTimeProducts",  { policies: ['USER','ADMIN'] },eProductController.createRealProduct);
this.get("/realTimeProducts/delete",  { policies: ['USER','ADMIN'] },eProductController.deleteRealProduct);
this.get("/realTimeCarts", { policies: ['USER','ADMIN'] }, eCartController.getRealCarts);
this.post("/realTimeCarts",  { policies: ['USER','ADMIN'] },eCartController.createRealCart);
this.post("/realTimeCarts/add", { policies: ['USER','ADMIN'] }, eCartController.saveProductToCart);
this.get("/realTimeCart/delete",  { policies: ['USER','ADMIN'] },eCartController.deleteRealCart);
this.get("/",  { policies: ['USER','ADMIN'] },eProductController.getProducts);
this.post("/",  { policies: ['USER','ADMIN'] },eProductController.createProduct);
this.get("/:pid", { policies: ['USER','ADMIN'] }, eProductController.getProduct);
this.put("/:pid", { policies: ['USER','ADMIN'] }, eProductController.updateProduct);
this.delete("/:pid",  { policies: ['USER','ADMIN'] },eProductController.deleteProduct);
this.get("*", { policies: ['USER','ADMIN'] }, (req, res) => {
  res.status(404).render('nopage',{messagedanger: "Cannot get that URL!!"});
});

}}