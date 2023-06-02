import * as CartService from "../services/ecarts.service.js";
import { STATUS } from "../../../config/constants.js";
import { CartModel, ProductModel } from "../models/ecommerce.model.js";

/**
 * This function retrieves all carts from a database and renders them in a real-time view.
 */
export async function getRealCarts(req, res) {
    try {
        const carts = await CartModel.find();
        let user = req.user;
        const productsarray = await ProductModel.find().select('id Title')
        const products = Array.from(productsarray, ({ id, Title }) => ({  id, Title }));
        return res.status(201).render("realTimeCarts", { carts: carts, user,products: products});
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
 */
export async function createRealCart(req, res) {
    try {
        const { body } = req;
        let user = req.user;
        await CartService.createCart(body);
        const carts = await CartModel.find();
        return res.status(201).render("realTimeCarts", { carts: carts, user });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            status: STATUS.FAIL,
        });
    }
}
/**
 * This function deletes a cart with a specific ID and returns a rendered view of all remaining carts.
 */
export async function deleteRealCart(req, res) {
    try {
        const id = parseInt(req.query.cid);
        let user = req.user;
        await CartService.deleteRealCart(id);
        const carts = await CartModel.find();
        return res.status(201).render("realTimeCarts", { carts: carts, user });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            status: STATUS.FAIL,
        });
    }
}
// 64778062166dbe736ea458b9
/**
 * This function saves a product to a cart and returns a rendered view of all carts.
 */
export async function saveProductToCart(req, res) {
    try {
        const { body } = req;
        let user = req.user;
        let id = parseInt(body.id);
        let pid = parseInt(body.product);
        let Quantity = parseInt(body.Quantity);

        const product = await ProductModel.findOne({ id: pid });
        // si no existe el producto se cae la app
        if (!product) {
           return res.status(201).render("nopage", { messagedanger: "Product doesn't Exist." });
        } 

        if (Quantity > product.Stock) {
            Quantity === product.Stock;
        }
        const linePrice = product.Price * Quantity;
        if (!id) {
            const Carts = await CartService.getAllCarts();
            let maxId = 0;
            Carts.forEach((event) => {
                if (event.id > maxId) maxId = event.id;
            });
            id = maxId + 1;
        }
        let cart = await CartModel.findOne({ id: id }).populate("products");
        console.log(cart._doc,cart._doc._id)
        if (!cart) {
            let newCart = await CartModel.create({
                id: id,
                uid:user._id,
                products: { pid: pid, Quantity: Quantity, _pid: product._id },
            });
        } else {
            const filter = { id: id };
            //const update = {$push: { products: { pid: pid, Quantity: Quantity, totlinea: linePrice, Title: product.Title } }, };
            const update = {$push: { products: { pid: pid, Quantity: Quantity, totlinea: linePrice, Title: product.Title } }, };
            const options = { new: true };
            
            let updatedCart = await CartModel.findOneAndUpdate(filter, update, options);
        }
        const carts = await CartModel.find();
        return res.status(200).redirect('/products/realTimeCarts/');
        //return res.status(201).render("realTimeCarts", { carts: carts, user });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            status: STATUS.FAIL,
        });
    }
}
