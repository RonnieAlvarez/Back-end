import * as eProductController from "../../controllers/eproducts.controller.js";
import * as eCartController from "../../controllers/ecarts.controller.js";
import {authorization} from "../../../../utils.js";

import CustomRouter from './custom.router.js'

export default class CartsRouter extends CustomRouter {
  init () {

this.get("/realTimeProducts",  { policies: ['USER','ADMIN'] }, authorization(["USER","ADMIN"]),eProductController.getRealProducts);
this.post("/realTimeProducts",  { policies: ['ADMIN'] },authorization(["ADMIN"]),eProductController.createRealProduct);
this.get("/realTimeProducts/delete",  { policies: ['USER','ADMIN'] },eProductController.deleteRealProduct);
this.get("/realTimeCarts", { policies: ['USER','ADMIN'] }, eCartController.getRealCarts);
this.post("/realTimeCarts",  { policies: ['USER'] },eCartController.createRealCart);
this.post("/realTimeCarts/add", { policies: ['USER'] }, eCartController.saveProductToCart);
this.get("/realTimeCart/delete",  { policies: ['USER'] },eCartController.deleteRealCart);
this.post("/realTimeCarts/purchase", { policies: ['USER'] }, eCartController.purchaseProducts);
this.get("/",  { policies: ['USER','ADMIN'] },eProductController.getProducts);
this.post("/",  { policies: ['ADMIN'] },eProductController.createProduct);
this.get("/:pid", { policies: ['USER','ADMIN'] }, eProductController.getProduct);
this.put("/:pid", { policies: ['ADMIN'] }, eProductController.updateProduct);
this.delete("/:pid",  { policies: ['ADMIN'] },eProductController.deleteProduct);
this.get("*", { policies: ['USER','ADMIN'] }, (req, res) => {
  res.status(404).render('nopage',{messagedanger: "Cannot get that URL!!"});
});

}}