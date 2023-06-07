import * as CartService from "../services/ecarts.service.js";
import { STATUS } from "../../../config/constants.js";
import { CartModel, ProductModel } from "../models/ecommerce.model.js";
import UserDto from "../../DTOs/user.Dto.js";

/**
 * This function retrieves all carts from a database and renders them in a real-time view.
 */
export async function getRealCarts(req, res) {
    try {
        let user = new UserDto(req.user)
        const carts = await CartModel.find({ uid: user._id }).populate("products").lean();
        const productsarray = await ProductModel.find().select("id Title Price");
        let total =0
        let carlinea=[]
        if(carts.length>0){
            carts[0].products.forEach((product) => {
                productsarray.forEach((linea)=>{
                    if(linea.id == product.pid){
                        carlinea.push({lid:linea.id,lQua:product.Quantity,lTitle:linea.Title,lPrice:linea.Price,lTotLine:linea.Price*product.Quantity})
                        total=total +linea.Price*product.Quantity
                    }
                })
            })
        }
        const products = Array.from(productsarray, ({ id, Title, Price }) => ({ id, Title, Price }));
        let canAddToCart = null
        if (user.roll==="USER") canAddToCart = true 
        return res.status(201).render("realTimeCarts", { carts: carlinea,user, products: products,lTotal:total,canAddToCart });
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
        let user = new UserDto(req.user)
        const carts = await CartService.createCart({uid: user._id});
        let canAddToCart = null
        if (user.roll==="USER") canAddToCart = true 
        return res.status(201).render("realTimeCarts", { carts: carts, user,canAddToCart });
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
        let user = new UserDto(req.user)
        await CartService.deleteRealCart(user._id);
        return res.status(200).redirect("/products/realTimeCarts/");
    } catch (error) {
        res.status(400).json({
            error: error.message,
            status: STATUS.FAIL,
        });
    }
}
/**
 * This function saves a product to a cart and returns a rendered view of all carts.
 */
export async function saveProductToCart(req, res) {
    try {
        const { body } = req;
        let user = new UserDto(req.user)
        let id = parseInt(body.id);
        let pid = parseInt(body.product);
        let Quantity = parseInt(body.Quantity);
        const product = await ProductModel.findOne({ id: pid });

        if (!product) {
            return res.status(201).render("nopage", { messagedanger: "Product doesn't Exist." });
        }
        let T_pid = product._id;
        let pTitle = product.Title;
        if (Quantity > product.Stock) {
            Quantity === product.Stock;
        }
    //    const linePrice = product.Price * Quantity;
        let cart = await CartModel.findOne({ uid: user._id }).populate("products");
        if (!cart) {
            let newCart = await CartModel.create({
                uid: user._id,
                products: { pid: pid, Quantity: Quantity, _pid: T_pid, Title: pTitle },
            });
        } else {
            let cartUpdated = await CartModel.findOneAndUpdate(
                { uid: user._id, "products.pid": pid },
                { $inc: { "products.$.Quantity": Quantity } },
                { new: true }
            ).populate("products.product");
            if (!cartUpdated) {
                cartUpdated = await CartModel.findOneAndUpdate(
                    { uid: user._id },
                    { $push: { products: { pid: pid, Quantity: Quantity, _pid: T_pid, Title: pTitle } } },
                    { new: true }
                );
            }
        }
        return res.status(200).redirect("/products/realTimeCarts/");
    } catch (error) {
        res.status(400).json({
            error: error.message,
            status: STATUS.FAIL,
        });
    }
}
