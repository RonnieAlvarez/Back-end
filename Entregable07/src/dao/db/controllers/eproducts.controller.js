import * as ProductService from "../services/eproducts.service.js";
import { STATUS } from "../../../config/constants.js";


/**
 * This is an asynchronous function that retrieves a product based on a given ID and returns a JSON
 * response with the product and a status.
 */
export async function getProduct(req, res) {
  try {
    let { pid } = req.params;
    pid = parseInt(pid);
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

//**************************************** */
export async function getProducts(req, res) {
  try {
    const user = req.session.user
    const products = await ProductService.getProducts();
    return res.render("home", { productsa: products,user });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
//**************************************** */
/**
 * This is an asynchronous function that retrieves a list of products from a database, paginates them,
 * and renders them in an HTML template with links to navigate between pages and return to the home
 * menu.
 * */
/**
 * This function retrieves all products from a ProductService and renders them in a real-time view.
 */
export async function getRealProducts(req, res) {
  try {
    const user = req.session.user
    const products = await ProductService.getAllProducts();
    return res.render("realTimeProducts", { productsa: products,user });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

/**
 * This function creates a new product and renders a page with all products.
 */
export async function createRealProduct(req, res) {
  try {
    const { body } = req;
    const user = req.session.user
    let products = await ProductService.createProduct(body);
    products = await ProductService.getProducts();
    res.status(201).render("realTimeProducts", { productsa: products,user });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

/**
 * This function deletes a real product using its ID and then renders a page with all the remaining
 * products.
 */
export async function deleteRealProduct(req, res) {
  try {
    const user = req.session.user
    const id = parseInt(req.query.pid);
    await ProductService.deleteRealProduct(id);
    let products = await ProductService.getAllProducts();
    res.status(201).render("realTimeProducts", { productsa: products,user });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

//****************************************** */

/**
 * This is an asynchronous function that creates a product and returns a JSON response with the product
 * and a success status code, or an error message and a fail status code.
 */
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

/**
 * This is an asynchronous function that updates a product and returns a JSON response with the updated
 * product and a status code.
 */
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

/**
 * This is an asynchronous function that deletes a product and returns a success message or an error
 * message with a corresponding status code.
 */
export async function deleteProduct(req, res) {
  try {
    const { pid } = req.params;

    await ProductService.deleteProduct(pid);
    res.status(201).json({
      message: "Product deleted !!",
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
