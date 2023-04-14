import * as ProductService from "../services/eproducts.service.js";
import { STATUS } from "../../config/constants.js";

export async function getProduct(req, res) {
  try {
    const { pid } = req.params;
    const response = await ProductService.getProduct(pid);
    res.json({
      product: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
export async function getProducts(req, res) {
  try {
    const products = await ProductService.getProducts();
    return res.render("home", { productsa: products });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

export async function getRealProducts(req, res) {
  try {
    const products = await ProductService.getAllProducts();
    return res.render("realTimeProducts", { productsa: products });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
export async function createRealProduct(req, res) {
  try {
    const { body } = req;
    let products = await ProductService.createProduct(body);
    products = await ProductService.getProducts();
    res.status(201).render("realTimeProducts", { productsa: products });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
export async function deleteRealProduct(req, res) {
  try {
    const id = parseInt(req.query.pid);
    await ProductService.deleteRealProduct(id);
    let products = await ProductService.getAllProducts();
    res.status(201).render("realTimeProducts", { productsa: products });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

//****************************************** */
//****************************************** */
export async function createProduct(req, res) {
  try {
    const { body } = req;
    const response = await ProductService.createProduct(body);
    res.status(201).json({
      product: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const { pid } = req.params;
    const { body } = req;
    const response = await ProductService.updateProduct(pid, body);
    res.status(201).json({
      product: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
export async function deleteProduct(req, res) {
  try {
    const { pid } = req.params;

    await ProductService.deleteProduct(pid);
    res.status(201).json({
      message: "Producto eliminado correctamente",
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
