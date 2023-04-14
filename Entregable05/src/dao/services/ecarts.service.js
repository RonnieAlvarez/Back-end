import { CartModel, ProductModel } from "../models/ecommerce.model.js";

export async function getCart(cid) {
  try {
    const Carts = await CartModel.find({
      $and: [{ id: cid }, { deleted: false }],
    });
    if ({ id: cid } && { deleted: true }) {
      return "Registro eliminado";
    }
    return Carts;
  } catch (error) {
    throw new Error(error.message);
  }
}

//**************************************** */
export async function getAllCarts() {
  try {
    const Carts = await CartModel.find({ deletedAt: { $exists: false } })
    return Carts;
  } catch (error) {
    throw new Error(error.message);
  }
}
//**************************************** */
export async function createCart(data) {
  try {
    const Carts = await getAllCarts();
    let maxId=0
    Carts.forEach((event) => {
        if (event.id > maxId) maxId = event.id;
      });  
    const id = maxId + 1;
    const cart = await CartModel.create({id:id});
    return cart;
  } catch (error) {
    throw new Error(error.message);
  } 
}

//************************************************ */
export async function updateCart(cid, data) {
  try {
    const updatedCart = await CartModel.findByIdAndUpdate(cid, data, {
      new: true,
    });
    return updatedCart;
  } catch (error) {
    throw new Error(error.message);
  }
}
//***************************************************** */
export async function deleteCart(cid) {
  try {
    await CartModel.delete({ id: cid });
  } catch (error) {
    throw new Error(error.message);
  }
}
//***************************************************** */
export async function deleteRealCart(id) {
  try {
    await CartModel.findOneAndDelete({ id: id });
  } catch (error) {
    throw new Error(error.message);
  }
}

