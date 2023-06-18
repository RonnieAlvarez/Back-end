import { CartModel, ProductModel,UserModel } from "../models/ecommerce.model.js";

/**
 * This function retrieves a cart from a database based on a given ID and checks if it has been
 * deleted.
 */
export async function getCart(cid) {
  try {
    const Carts = await CartModel.find({
      $and: [{ id: cid }, { deleted: false }],
    });
    if ({ id: cid } && { deleted: true }) {
      return "Record deleted";
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
 */
export async function createCart(data) {
      try {
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


/**
 * This JavaScript function generates a unique code by combining a timestamp and a random number.
 * @returns a unique code generated by concatenating a timestamp and a random number.
 */
export function generateUniqueCode() {
  // Generar un identificador único utilizando un timestamp y un número aleatorio
  const timestamp = Date.now().toString(36);
  const randomNum = Math.floor(Math.random() * 100000).toString(36);
  // Concatenar el timestamp y el número aleatorio para formar el código único
  const uniqueCode = timestamp + randomNum;
  return uniqueCode;
}

/**
 * The function saves a ticket and logs a message indicating whether it was saved successfully or if
 * there was an error.
 */
export function saveTicket(ticket) {
  ticket
  .save()
  .then((savedTicket) => {
      console.log({ticket:'Saved ticket ok '+savedTicket});
  })
  .catch((error) => {
      console.log({ error: "Error saving the ticket. Error: "+error });
  });
}