import { ProductModel } from "../models/ecommerce.model.js";

//**************************************** */
/**
 * This is an asynchronous function that retrieves a product from a database based on its ID and
 * returns it, or returns an error message if the product doesn't exist.
 * @param pid - pid is a parameter that represents the product ID. It is used to query the database and
 * retrieve the product with the matching ID.
 * @returns either an array of products that match the given `pid` and have `deleted` property set to
 * `false`, or a string "Record doesnt exist !!" if no matching products are found.
 */
export async function getProduct(pid) {
  try {
    const Products = await ProductModel.find({
      $and: [{ id: pid }, { deleted: false }],
    });
    if (Products.length === 0) {
      return "Record doesnt exist !!";
    }
    return Products;
  } catch (error) {
    throw new Error(error.message);
  }
}
//**************************************** */
/**
 * This function retrieves menu products from a database using pagination and error handling.
 * @param page - The page number of the paginated results to retrieve.
 * @param limit - The limit parameter is used to specify the maximum number of documents to be returned
 * per page in the pagination.
 * @returns This function returns a promise that resolves to an object containing paginated menu
 * products from the database. If an error occurs, it returns an object with an error message and a
 * status code of 400.
 */
export async function getmenuProducts(page, limit) {
  try {
    const Products = await ProductModel.paginate({ deletedAt: { $exists: false } }, { page: page, limit: limit, lean: true });
    return Products;
  } catch (error) {
    return {
      error: error.message,
      status: 400
    };
  }
}
//**************************************** */
/**
 * This function retrieves all products that have not been deleted from a database using the
 * ProductModel.
 * @returns The `getProducts` function is returning a promise that resolves to an array of products
 * that have not been deleted.
 */
export async function getProducts() {
  try {
    const Products = await ProductModel.find({ deletedAt: { $exists: false } });
    return Products;
  } catch (error) {
    throw new Error(error.message);
  }
}

//**************************************** */
/**
 * This function retrieves all products that have not been deleted from a database using the
 * ProductModel.
 * @returns The function `getAllProducts` is returning all the products that have not been deleted from
 * the database. The products are retrieved using the `ProductModel.find()` method and filtered by the
 * `deletedAt` field that does not exist. The function returns a promise that resolves to an array of
 * products.
 */
export async function getAllProducts() {
  try {
    const Products = await ProductModel.find({ deletedAt: { $exists: false } })
    return Products;
  } catch (error) {
    throw new Error(error.message);
  }
}
//**************************************** */
/**
 * This function creates a new product with a unique ID and sets its status to true.
 * @param data - The data parameter is an object that contains the information needed to create a new
 * product. It likely includes properties such as name, description, price, and other details about the
 * product.
 * @returns The `createProduct` function returns a Promise that resolves to a newly created product
 * object with an added `id` property and a `Status` property set to `true`. If an error occurs during
 * the execution of the function, it throws an error with the error message.
 */
export async function createProduct(data) {
  try {
    const Products = await getAllProducts();
    let maxId=0
    const amaxId = Products.map((evento) => {
      if (evento.id > maxId) maxId = evento.id;});
    const id = maxId + 1;
    data =  { ...data, 'id':id,'Status':true };
    const product = await ProductModel.create(data);
    return product;
  } catch (error) {
    throw new Error(error.message);
  } 
}

//************************************************ */
/**
 * This is an asynchronous function that updates a product in a database using its ID and returns the
 * updated product.
 * @param pid - pid is the ID of the product that needs to be updated in the database.
 * @param data - The `data` parameter is an object that contains the updated information for a product.
 * It could include properties such as the product name, description, price, image, etc. This function
 * uses the `ProductModel` to find and update the product with the given `pid` (product ID) using
 * @returns the updated product object after updating it in the database.
 */
export async function updateProduct(pid, data) {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(pid, data, {
      new: true,
    });
    return updatedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
}
//***************************************************** */
/**
 * This is an asynchronous function that deletes a product with a given ID using a ProductModel and
 * throws an error if there is one.
 * @param pid - pid stands for "product ID". It is the unique identifier of the product that needs to
 * be deleted from the database.
 */
export async function deleteProduct(pid) {
  try {
    await ProductModel.delete({ id: pid });
  } catch (error) {
    throw new Error(error.message);
  }
}
//***************************************************** */
/**
 * This function deletes a real product from the database using its ID.
 * @param id - The id parameter is the unique identifier of the product that needs to be deleted from
 * the database.
 */
export async function deleteRealProduct(id) {
  try {
    await ProductModel.findOneAndDelete({ id: id });
  } catch (error) {
    throw new Error(error.message);
  }
}