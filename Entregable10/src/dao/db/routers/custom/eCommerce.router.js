import express from "express";
import * as eProductController from "../../controllers/eproducts.controller.js";
import * as eCartController from "../../controllers/ecarts.controller.js";
import CustomRouter from './custom.router.js'

export default class CartsRouter extends CustomRouter {
  init () {

this.get("/realTimeProducts",  { policies: ['PUBLIC'] },eProductController.getRealProducts);
this.post("/realTimeProducts",  { policies: ['PUBLIC'] },eProductController.createRealProduct);
this.get("/realTimeProducts/delete",  { policies: ['PUBLIC'] },eProductController.deleteRealProduct);
this.get("/realTimeCarts", { policies: ['PUBLIC'] }, eCartController.getRealCarts);
this.post("/realTimeCarts",  { policies: ['PUBLIC'] },eCartController.createRealCart);
this.post("/realTimeCarts/add", { policies: ['PUBLIC'] }, eCartController.saveProductToCart);
this.get("/realTimeCart/delete",  { policies: ['PUBLIC'] },eCartController.deleteRealCart);
this.get("/",  { policies: ['PUBLIC'] },eProductController.getProducts);
this.post("/",  { policies: ['PUBLIC'] },eProductController.createProduct);
this.get("/:pid", { policies: ['PUBLIC'] }, eProductController.getProduct);
this.put("/:pid", { policies: ['PUBLIC'] }, eProductController.updateProduct);
this.delete("/:pid",  { policies: ['PUBLIC'] },eProductController.deleteProduct);
this.get("*", { policies: ['PUBLIC'] }, (req, res) => {
  res.status(404).send("Cannot get that URL!!");
});

}}