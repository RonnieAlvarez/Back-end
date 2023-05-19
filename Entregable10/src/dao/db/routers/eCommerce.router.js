import express from "express";
import * as eProductController from "../controllers/eproducts.controller.js";
import * as eCartController from "../controllers/ecarts.controller.js";

const route = express.Router();

/* These are routes for handling HTTP requests related to products with socket.io. */
route.get("/realTimeProducts", eProductController.getRealProducts);
route.post("/realTimeProducts", eProductController.createRealProduct);
route.get("/realTimeProducts/delete", eProductController.deleteRealProduct);

/* These are routes for handling HTTP requests related to carts with socket.io. */
route.get("/realTimeCarts", eCartController.getRealCarts);
route.post("/realTimeCarts", eCartController.createRealCart);
route.post("/realTimeCarts/add", eCartController.saveProductToCart);
route.get("/realTimeCart/delete", eCartController.deleteRealCart);

/* These are routes for handling HTTP requests related to products without socket.io. */
route.get("/", eProductController.getProducts);
route.post("/", eProductController.createProduct);
route.get("/:pid", eProductController.getProduct);
route.put("/:pid", eProductController.updateProduct);
route.delete("/:pid", eProductController.deleteProduct);

route.get("*", (req, res) => {
  res.status(404).send("Cannot get that URL!!");
});

export default route;