import { CartModel, ProductModel,UserModel } from "../models/ecommerce.model.js";

/**
 * This function retrieves a cart from a database based on a given ID and checks if it has been
 * deleted.
 * @param cid - The parameter `cid` is an identifier for a specific cart. It is used to query the
 * database for the cart with the matching `id` value.
 * @returns either an array of cart objects that match the given cid and are not deleted, or the string
 * "Registro eliminado" if there is a cart object that matches the given cid but is marked as deleted.
 */
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
/**
 * This function retrieves all non-deleted carts from a database using the CartModel.
 * @returns The function `getAllCarts` returns all the documents from the `CartModel` collection where
 * the `deletedAt` field does not exist.
 */
export async function getAllCarts() {
  try {
    const Carts = await CartModel.find({ deletedAt: { $exists: false } })
    return Carts;
  } catch (error) {
    throw new Error(error.message);
  }
}
//**************************************** */
/**
 * This function creates a new cart by getting all existing carts, finding the maximum ID, adding 1 to
 * it, and creating a new cart with that ID.
 * @param data - There are no parameters being passed to the createCart function. The function is
 * retrieving all existing carts, finding the maximum ID, adding 1 to it to create a new ID, and then
 * creating a new cart with that ID using the CartModel. The function then returns the newly created
 * cart.
 * @returns a newly created cart object with an id property that is one greater than the highest id in
 * the existing carts.
 */
export async function createCart(data) {
  // try {
  //   const Carts = await getAllCarts();
  //   let maxId=0
  //   Carts.forEach((event) => {
  //       if (event.id > maxId) maxId = event.id;
  //     });  
  //   const id = maxId + 1;
  //   const cart = await CartModel.create({id:id});
  //   return cart;
    try {
      //const Carts = await getAllCarts();
      //const maxId = Math.max(...Carts.map((cart) => cart.id));
      //const user = await UserModel.findById(data.userId);
      const cart = await CartModel.create({  uid: data });
      return cart;



  } catch (error) {
    throw new Error(error.message);
  } 
}

//************************************************ */
/**
 * This is an asynchronous function that updates a cart in a database using its ID and returns the
 * updated cart.
 * @param cid - cid is the ID of the cart that needs to be updated.
 * @param data - The `data` parameter in the `updateCart` function is an object that contains the
 * updated values for the cart. It could include properties such as `items`, `totalPrice`, `discounts`,
 * etc. These values will be used to update the corresponding fields in the cart document in the
 * database
 * @returns the updated cart object after updating it in the database.
 */
export async function updateCart(cid, data) {
  try {
    const updatedCart = await CartModel
    .findByIdAndUpdate(
      cid, data, {
      new: true })
    .populate('products.product')
    return updatedCart;
  } catch (error) {
    throw new Error(error.message);
  }
}
//***************************************************** */
/**
 * This is an asynchronous function that deletes a cart with a specific ID using a CartModel and throws
 * an error if there is one.
 * @param cid - cid is the identifier of the cart that needs to be deleted. It is passed as a parameter
 * to the deleteCart function.
 */
export async function deleteCart(cid) {
  try {
    await CartModel.delete({ id: cid });
  } catch (error) {
    throw new Error(error.message);
  }
}
//***************************************************** */
/**
 * This function deletes a cart from the database using its ID.
 * @param id - The id parameter is the unique identifier of the cart that needs to be deleted from the
 * database. The function uses the id to find and delete the corresponding cart document from the
 * CartModel collection.
 */
export async function deleteRealCart(id) {
  try {
    await CartModel.findOneAndDelete({ uid: id });
  } catch (error) {
    throw new Error(error.message);
  }
}

