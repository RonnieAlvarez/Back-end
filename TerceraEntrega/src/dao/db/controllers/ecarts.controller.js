import * as CartService from "../services/ecarts.service.js";
import { STATUS } from "../../../config/constants.js";
import { CartModel, ProductModel } from "../models/ecommerce.model.js";

/**
 * This function retrieves all carts from a database and renders them in a real-time view.
 */
export async function getRealCarts(req, res) {
    try {
        let user = req.user;
        const carts = await CartModel.find({ uid: user._id }).populate("products").lean();
        const productsarray = await ProductModel.find().select("id Title Price");
        let total =0
        let carlinea=[]
        carts[0].products.forEach((product) => {
            productsarray.forEach((linea)=>{
                if(linea.id == product.pid){
                    carlinea.push({lid:linea.id,lQua:product.Quantity,lTitle:linea.Title,lPrice:linea.Price,lTotLine:linea.Price*product.Quantity})
                    total=total +linea.Price*product.Quantity
                }
            })
        })
        
        //console.log(carlinea)
        //console.log('El total de la compra ',total)
    
//        const prueba2 = await CartModel.find({ uid: user._id }).populate("products", "id Title Price ").lean();
//        console.log('prueba2 ',prueba2);
        const products = Array.from(productsarray, ({ id, Title, Price }) => ({ id, Title, Price }));
    //    console.log(products)
    console.log(carlinea)
    console.log(user._id)
    console.log(products)
    console.log(total)
        return res.status(201).render("realTimeCarts", { carts: carlinea,user, products: products,lTotal:total });
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
        let T_pid = product._id;
        let pTitle = product.Title;
        if (Quantity > product.Stock) {
            Quantity === product.Stock;
        }
        const linePrice = product.Price * Quantity;
        // if (!id) {
        //     const Carts = await CartService.getAllCarts();
        //     let maxId = 0;
        //     Carts.forEach((event) => {
        //         if (event.id > maxId) maxId = event.id;
        //     });
        //     id = maxId + 1;
        // }
        let cartReady = {};
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
            //console.log(cartUpdated);
            if (!cartUpdated) {
                cartUpdated = await CartModel.findOneAndUpdate(
                    //{uid: user._id ,"products.pid": pid},
                    { uid: user._id },
                    { $push: { products: { pid: pid, Quantity: Quantity, _pid: T_pid, Title: pTitle } } },
                    { new: true }
                );
            }
            //  let prueba = CartModel.findOne({uid: user._id }).lean(true)
            //    console.log(prueba)
            //    cartReady = cartUpdated ? cartUpdated : newCart
        }
        return res.status(200).redirect("/products/realTimeCarts/");

        //return res.status(201).render("realTimeCarts", { productsa:cartReady._doc.products , user });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            status: STATUS.FAIL,
        });
    }
}
