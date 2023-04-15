import * as CartService from "../services/ecarts.service.js";
import { STATUS } from "../../config/constants.js";
import { CartModel } from "../models/ecommerce.model.js";


export async function getRealCarts(req, res) {
  try {
    let carts = await CartService.getAllCarts();
    let aId=0
    let apid=0
    let aQua=0
    let acarts=[]
    carts.forEach((event) => {
      aId=event.id
      if (event.products.length>0){
        const {
          _doc: { products: [{ _doc: { pid, Quantity } }] },
        } = event 
        apid=pid ? pid:0
        aQua=Quantity ? Quantity:0
      }else{
        apid=0
        aQua=0
      }
        acarts.push({id:aId,pid:apid,Quantity:aQua})
      }); 

    return res.render("realTimeCarts", { cartsa: acarts });
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
    let carts = await CartService.createCart(body);
    carts = await CartService.getAllCarts();
    let aId=0
    let apid=0
    let aQua=0
    let acarts=[]
    carts.forEach((event) => {
        aId=event.id
        if (event.products.length>0){
          const {
            _doc: { products: [{ _doc: { pid, Quantity } }] },
          } = event 
          apid=pid ? pid:0
          aQua=Quantity ? Quantity:0
        }else{
          apid=0
          aQua=0
        }
        acarts.push({id:aId,pid:apid,Quantity:aQua})
      }); 

    res.status(201).render("realTimeCarts", { cartsa: acarts });
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
    let carts = await CartService.getAllCarts();
    let aId=0
    let apid=0
    let aQua=0
    let acarts=[]
    carts.forEach((event) => {
        aId=event.id
        if (event.products.length>0){
          const {
            _doc: { products: [{ _doc: { pid, Quantity } }] },
          } = event 
          apid=pid ? pid:0
          aQua=Quantity ? Quantity:0
        }else{
          apid=0
          aQua=0
        }
        acarts.push({id:aId,pid:apid,Quantity:aQua})
      }); 

    res.status(201).render("realTimeCarts", { cartsa: acarts });
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
    //const { pid, Quantity } = body;
    //pid=parseInt(pid);
    //Quantity=parseInt(Quantity);
if (!id){
  const Carts = await CartService.getAllCarts();
  let maxId=0
  Carts.forEach((event) => {
      if (event.id > maxId) maxId = event.id;
    });  
   id = maxId + 1;
}
let cart = await CartModel.findOne({id:id}).populate('products')
if (!cart){
let newCart = await CartModel.create({
  id: id,
  products: {pid: pid,Quantity: Quantity}
  });
}else{
  let newCart = await CartModel.updateOne({
    id: id,
    products: {pid: pid,Quantity: Quantity}
    });
}

     
    //CartModel.update
    //carts.save
  //  let carts = await CartModel.find({}).populate('products')
    let carts = await CartService.getAllCarts();
    let aId=0
    let apid=0
    let aQua=0
    let acarts=[]
    carts.forEach((event) => {
        aId=event.id
        if (event.products.length>0){
          const {
            _doc: { products: [{ _doc: { pid, Quantity } }] },
          } = event 
          apid=pid ? pid:0
          aQua=Quantity ? Quantity:0
        }else{
          apid=0
          aQua=0
        }
        acarts.push({id:aId,pid:apid,Quantity:aQua})
      }); 
    res.status(201).render("realTimeCarts", { cartsa: acarts });
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
