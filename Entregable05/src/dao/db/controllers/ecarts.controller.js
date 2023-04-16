import * as CartService from "../services/ecarts.service.js";
import { STATUS } from "../../../config/constants.js";
import { CartModel } from "../models/ecommerce.model.js";

/**
 * This function retrieves all carts from a database and renders them in a real-time view.
 * @param req - The request object represents the HTTP request that was sent by the client to the
 * server. It contains information about the request such as the URL, headers, and any data that was
 * sent in the request body.
 * @param res - `res` is the response object that is used to send the response back to the client. It
 * is an instance of the `http.ServerResponse` class in Node.js. The `res` object has methods like
 * `res.status()`, `res.render()`, and `res.json()` that are
 * @returns a rendered view called "realTimeCarts" with an object containing the retrieved carts as a
 * property called "carts". The HTTP status code returned is 201 if the operation is successful, and
 * 400 if there is an error.
 */
export async function getRealCarts(req, res) {
  try {
    const carts = await CartModel.find();
    return res.status(201).render("realTimeCarts", { carts: carts });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
/**
 * This function creates a new cart, retrieves all existing carts, and renders them in a real-time
 * view.
 * @param req - The req parameter is an object that represents the HTTP request made by the client. It
 * contains information such as the request method, headers, URL, and any data sent in the request
 * body.
 * @param res - `res` is the response object that is used to send the response back to the client. It
 * contains methods like `status()` to set the HTTP status code, `json()` to send a JSON response, and
 * `render()` to render a view template.
 * @returns a rendered view called "realTimeCarts" with a status code of 201 and an object containing
 * an array of carts retrieved from the database. If there is an error, the function will return a JSON
 * object with an error message and a status code of 400.
 */
export async function createRealCart(req, res) {
  try {
    const { body } = req;
    await CartService.createCart(body);
    const carts = await CartModel.find();
    return res.status(201).render("realTimeCarts", { carts: carts });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
/**
 * This function deletes a cart with a specific ID and returns a rendered view of all remaining carts.
 * @param req - The request object contains information about the HTTP request that was made, such as
 * the URL, headers, and any data that was sent in the request body.
 * @param res - `res` is the response object that is used to send the response back to the client. It
 * contains methods like `status()` to set the HTTP status code, `json()` to send a JSON response, and
 * `render()` to render a view template.
 * @returns a response with a status code of 201 and rendering a view called "realTimeCarts" with a
 * list of carts retrieved from the database after deleting a cart with the specified ID. If there is
 * an error, the function returns a response with a status code of 400 and a JSON object containing the
 * error message and a status code indicating failure.
 */
export async function deleteRealCart(req, res) {
  try {
    const id = parseInt(req.query.cid);
    await CartService.deleteRealCart(id);
    const carts = await CartModel.find();
    return res.status(201).render("realTimeCarts", { carts: carts });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

/**
 * This function saves a product to a cart and returns a rendered view of all carts.
 * @param req - req is the request object that contains information about the HTTP request made by the
 * client, such as the request headers, request parameters, and request body.
 * @param res - The `res` parameter is the response object that will be sent back to the client with
 * the response data. It is used to send HTTP responses such as status codes, headers, and data.
 * @returns a response with status code 201 and rendering the "realTimeCarts" view with the carts data.
 */
export async function saveProductToCart(req, res) {
  try {
    const { body } = req;
    let id = parseInt(body.id);
    let pid = parseInt(body.pid);
    let Quantity = parseInt(body.Quantity);

    if (!id) {
      const Carts = await CartService.getAllCarts();
      let maxId = 0;
      Carts.forEach((event) => {
        if (event.id > maxId) maxId = event.id;
      });
      id = maxId + 1;
    }

    let cart = await CartModel.findOne({ id: id }).populate("products");
    if (!cart) {
      let newCart = await CartModel.create({
        id: id,
        products: { pid: pid, Quantity: Quantity },
      });
    } else {
      const filter = { id: id };
      const update = { $push: { products: { pid: pid, Quantity: Quantity } } };
      const options = { new: true };
      let updatedCart = await CartModel.findOneAndUpdate(
        filter,
        update,
        options
      );
    }
    const carts = await CartModel.find();
    return res.status(201).render("realTimeCarts", { carts: carts });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
