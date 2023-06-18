import * as eProductController from "../../controllers/eproducts.controller.js";
import * as eCartController from "../../controllers/ecarts.controller.js";
import {authorization} from "../../../../utils.js";

import CustomRouter from './custom.router.js'

export default class CartsRouter extends CustomRouter {
  init () {
this.get("/mockingProducts",  { policies: ['USER','ADMIN'] }, authorization(["USER","ADMIN"]),eProductController.getMockingProducts);
this.get("/realTimeProducts",  { policies: ['USER','ADMIN'] }, authorization(["USER","ADMIN"]),eProductController.getRealProducts);
this.post("/realTimeProducts",  { policies: ['ADMIN'] },authorization(["ADMIN"]),eProductController.createRealProduct);
this.get("/realTimeProducts/delete",  { policies: ['ADMIN'] },authorization(["ADMIN"]),eProductController.deleteRealProduct);
this.get("/realTimeCarts", { policies: ['USER','ADMIN'] }, eCartController.getRealCarts);
this.post("/realTimeCarts",  { policies: ['USER'] },authorization(["USER"]),eCartController.createRealCart);
this.post("/realTimeCarts/add", { policies: ['USER'] },authorization(["USER"]), eCartController.saveProductToCart);
this.get("/realTimeCart/delete",  { policies: ['USER'] },authorization(["USER"]),eCartController.deleteRealCart);
this.post("/realTimeCarts/purchase", { policies: ['USER'] },authorization(["USER"]), eCartController.purchaseProducts);
this.get("/",  { policies: ['USER','ADMIN'] },eProductController.getProducts);
this.post("/",  { policies: ['ADMIN'] },authorization(["ADMIN"]),eProductController.createProduct);
this.get("/:pid", { policies: ['USER','ADMIN'] }, eProductController.getProduct);
this.put("/:pid", { policies: ['ADMIN'] },authorization(["ADMIN"]),eProductController.updateProduct);
this.delete("/:pid",  { policies: ['ADMIN'] },authorization(["ADMIN"]),eProductController.deleteProduct);
this.get("*", { policies: ['USER','ADMIN'] }, (req, res) => {
  res.status(404).render('nopage',{messagedanger: "Cannot get that URL!!"});
});

}}