import { ProductModel } from "../models/ecommerce.model.js";

//**************************************** */
export async function getProduct(pid) {
  try {
    const Products = await ProductModel.find({
      $and: [{ _id: pid }, { deleted: false }],
    });
    if ({ _id: pid } && { deleted: true }) {
      return "Registro eliminado";
    }
    return Products;
  } catch (error) {
    throw new Error(error.message);
  }
}
//**************************************** */
export async function getProducts(page, limit) {
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
export async function getAllProducts() {
  try {
    const Products = await ProductModel.find({ deletedAt: { $exists: false } }).Paginate({},{sort,limit, pages})
    //const Products = await ProductModel.Paginate({},{sort:sort,limit:limit,pages:pages})
    return Products;
  } catch (error) {
    throw new Error(error.message);
  }
}
//**************************************** */
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
export async function deleteProduct(pid) {
  try {
    await ProductModel.delete({ id: pid });
  } catch (error) {
    throw new Error(error.message);
  }
}
//***************************************************** */
export async function deleteRealProduct(id) {
  try {
    await ProductModel.findOneAndDelete({ id: id });
  } catch (error) {
    throw new Error(error.message);
  }
}