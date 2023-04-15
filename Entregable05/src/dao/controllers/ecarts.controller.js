import * as CartService from "../services/ecarts.service.js";
import { STATUS } from "../../config/constants.js";
import { CartModel } from "../models/ecommerce.model.js";


export async function getRealCarts(req, res) {
  try {
    // let carts = await CartService.getAllCarts();
    // let aId=0
    // let apid=0
    // let aQua=0
    // let acarts=[]
    // carts.forEach((event) => {
    //   aId=event.id
    //   if (event.products.length>0){
    //     const {
    //       _doc: { products: [{ _doc: { pid, Quantity } }] },
    //     } = event 
    //     apid=pid ? pid:0
    //     aQua=Quantity ? Quantity:0
    //   }else{
    //     apid=0
    //     aQua=0
    //   }
    //     acarts.push({id:aId,pid:apid,Quantity:aQua})
    //   }); 
const carts = await CartModel.find()
    return res.status(201).render("realTimeCarts", { carts: carts });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
export async function createRealCart(req, res) {
  try {
    const { body } = req;
    await CartService.createCart(body);
    // carts = await CartService.getAllCarts();
    // let aId=0
    // let apid=0
    // let aQua=0
    // let acarts=[]
    // carts.forEach((event) => {
    //     aId=event.id
    //     if (event.products.length>0){
    //       const {
    //         _doc: { products: [{ _doc: { pid, Quantity } }] },
    //       } = event 
    //       apid=pid ? pid:0
    //       aQua=Quantity ? Quantity:0
    //     }else{
    //       apid=0
    //       aQua=0
    //     }
    //     acarts.push({id:aId,pid:apid,Quantity:aQua})
    //   }); 
    const carts = await CartModel.find()
    return res.status(201).render("realTimeCarts", { carts: carts });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
export async function deleteRealCart(req, res) {
  try {
    const id = parseInt(req.query.cid);
    await CartService.deleteRealCart(id);

    // let carts = await CartService.getAllCarts();
    // let aId=0
    // let apid=0
    // let aQua=0
    // let acarts=[]
    // carts.forEach((event) => {
    //     aId=event.id
    //     if (event.products.length>0){
    //       const {
    //         _doc: { products: [{ _doc: { pid, Quantity } }] },
    //       } = event 
    //       apid=pid ? pid:0
    //       aQua=Quantity ? Quantity:0
    //     }else{
    //       apid=0
    //       aQua=0
    //     }
    //     acarts.push({id:aId,pid:apid,Quantity:aQua})
    //   }); 

  //  res.status(201).render("realTimeCarts", { cartsa: acarts });
    const carts = await CartModel.find()
    return res.status(201).render("realTimeCarts", { carts: carts });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}


export async function saveProductToCart(req,res) {
  try {
    const { body } = req;
    let id = parseInt(body.id);
    let pid = parseInt(body.pid);
    let Quantity = parseInt(body.Quantity);
    
/* This code block is checking if the `id` parameter is not provided in the request body. If `id` is
not provided, it retrieves all the carts using `CartService.getAllCarts()` and finds the maximum
`id` value among them. It then assigns `id` to be the maximum `id` value plus 1, which ensures that
the new cart being created will have a unique `id`. */
if (!id){
  const Carts = await CartService.getAllCarts();
  let maxId=0
  Carts.forEach((event) => {
      if (event.id > maxId) maxId = event.id;
    });  
   id = maxId + 1;
}
/* This code block is checking if a cart with the given `id` exists in the database. If it does not
exist, a new cart is created with the provided `id`, `pid`, and `Quantity` values. If it does exist,
the cart is updated with the provided `pid` and `Quantity` values. The `populate('products')` method
is used to populate the `products` field of the cart with the actual product objects instead of just
their ids. */
let cart = await CartModel.findOne({id:id}).populate('products')
if (!cart){
let newCart = await CartModel.create({
  id: id,
  products: {pid: pid,Quantity: Quantity}
  });
}else{
  //let Data = cart.products
  //agregar productos a un array y populate?
  //cart.products.unshift({pid: pid,Quantity: Quantity}) 
//   let newCart = await CartModel.updateOne({
//     id: id,
//     products: products.unshift({pid: pid,Quantity: Quantity}) 
//     });
const filter = { id: id };
const update = { $push: { products: { pid: pid, Quantity: Quantity } } };
const options = { new: true };
let updatedCart = await CartModel.findOneAndUpdate(filter, update, options);
}

    // let carts = await CartService.getAllCarts();
    // let aId=0
    // let apid=0
    // let aQua=0
    // let acarts=[]
    // carts.forEach((event) => {
    //     aId=event.id
    //     if (event.products.length>0){
    //       const {
    //         _doc: { products: [{ _doc: { pid, Quantity } }] },
    //       } = event 
    //       apid=pid ? pid:0
    //       aQua=Quantity ? Quantity:0
    //     }else{
    //       apid=0
    //       aQua=0
    //     }
    //     acarts.push({id:aId,pid:apid,Quantity:aQua})
    //   }); 
    // res.status(201).render("realTimeCarts", { cartsa: acarts });
    const carts = await CartModel.find()
    return res.status(201).render("realTimeCarts", { carts: carts });
    } catch (error) {
      res.status(400).json({
        error: error.message,
        status: STATUS.FAIL,
      });
    }
  }
  

// export async function deleteProductFromCart(id, productId) {
//   try {
//       const cart = await CarritosModel.findById(id);
//       cart.products.remove(productId);
//       cart.save();
//       return true;
//   } catch (error) {
//       console.log(error);
//       return false;
//   }
// }

// export async function  getAllProductsFromCart(id) {
//   try {
//       return await CarritosModel.findById(id).populate('products').select({products: 1, _id:0});
//   } catch (error) {
//       console.log(error);
//       return false;
//   }
// }
