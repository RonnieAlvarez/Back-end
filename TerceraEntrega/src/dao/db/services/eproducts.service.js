import { ProductModel } from "../models/ecommerce.model.js";

//**************************************** */
/**
 * This is an asynchronous function that retrieves a product from a database based on its ID and
 * returns it, or returns an error message if the product doesn't exist.
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
 */
export async function getAllProducts() {
  try {
    const Products = await ProductModel.find({ deletedAt: { $exists: false } }).lean()
    return Products;
  } catch (error) {
    throw new Error(error.message);
  }
}
//**************************************** */
/**
 * This function creates a new product with a unique ID and sets its status to true.
 */
export async function createProduct(id,data) {
  try {
    const Products = await getAllProducts();
    const result = Products.find(evento => evento.id === id)
    if (!result) {
      let maxId=0
      const amaxId = Products.map((evento) => {
        if (evento.id > maxId) maxId = evento.id;});
        const id = maxId + 1;
      } else {
        
          if (data.Title === "")        {data.Title = result.Title}
          if (data.Description === "")  {data.Description = result.Description}
          if (data.Code === "")         {data.Code = result.Code}
          if (Number(data.Price) === 0) {data.Price = Number(result.Price)||0}
          if (Number(data.Stock === 0)) {data.Stock = Number(result.Stock)||0}
          if (data.Category === "")     {data.Category = result.Category}
          
      }
      
      data =  { ...data, 'id':id,'Status':true };
  const product = await ProductModel.findOneAndUpdate({id:id}, data, {
    new: true, upsert: true
  });
    return product;
  } catch (error) {
    throw new Error(error.message);
  } 
}

//************************************************ */
/**
 * This is an asynchronous function that updates a product in a database using its ID and returns the
 * updated product.
 */
export async function updateProduct(pid, data) {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(pid, data, {
      new: true, upsert: true
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
 */
export async function deleteRealProduct(id) {
  try {
    await ProductModel.findOneAndDelete({ id: id });
  } catch (error) {
    throw new Error(error.message);
  }
}