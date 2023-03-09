/********************************************************************************* */
//
//  ENTREGABLE 03 RONNIE ALVAREZ CASTRO  CODERHOUSE PROGRAMA FULLSTACK CURSO BACKEND
// 
/********************************************************************************* */
//  Se deberá utilizar la clase ProductManager que actualmente utilizamos
//  con persistencia de archivos
//
//
import fs from "fs"
/***************************************************************************** */
export default class prodManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }
  /***************************************************************************** */
  //inicializa el archivo con un array vacio y si no existe lo crea con 10 objetos
  //de prueba
  init = async ()=>{
    try {
			let data = await fs.promises.readFile(this.path);
			this.products = JSON.parse(data);
    } catch{
      this.products = [{"title":"Producto 1 Prueba","description":"Este es un producto prueba","price":200,"thumbnail":"sin imagen","code":"abc123","stock":25,"id":1},{"title":"producto 2 ","description":"Esta es otra prueba","price":100,"thumbnail":"sin imagen","code":"abc124","stock":5,"id":2},{"title":"Producto 3","description":"Esta es otra prueba","price":10,"thumbnail":"sin imagen","code":"abc125","stock":25,"id":3},{"title":"Producto 4","description":"Esta es otra prueba","price":10,"thumbnail":"sin imagen","code":"abc126","stock":25,"id":4},{"title":"Producto 5","description":"Esta es otra prueba","price":10,"thumbnail":"sin imagen","code":"abc127","stock":25,"id":5},{"title":"Producto 6","description":"Esta es otra prueba","price":10,"thumbnail":"sin imagen","code":"abc128","stock":25,"id":6},{"title":"Producto 7","description":"Esta es otra prueba","price":10,"thumbnail":"sin imagen","code":"abc129","stock":25,"id":7},{"title":"Producto 8","description":"Esta es otra prueba","price":10,"thumbnail":"sin imagen","code":"abc130","stock":25,"id":8},{"title":"Producto 9","description":"Esta es otra prueba","price":10,"thumbnail":"sin imagen","code":"abc131","stock":25,"id":9},{"title":"Producto 10","description":"Esta es otra prueba","price":10,"thumbnail":"sin imagen","code":"abc132","stock":25,"id":10}]
      this.save(this.products);
    }
  }
  /***************************************************************************** */
  // devuelve todos los elementos del array
   getAll=async ()=>{
    let data = await fs.promises.readFile(this.path);
    this.products = JSON.parse(data);
    return this.products
   }
  /***************************************************************************** */
  // Metodo writeEmpty(path)
  writeEmpty= async ()=> {
    //Este metodo escribe un archivo en blanco
    this.products = [];
    try {
      await this.save(this.products);
    } catch {
      console.log(`File ${path} was created without data`);
    }
  }
  /***************************************************************************** */
  // Metodo getProducts()
  getProducts= async ()=> {
    //Debe tener un método getProducts, el cual debe leer el archivo de productos y
    //devolver todos los productos en formato de arreglo.
    const data = await fs.promises.readFile(this.path, "utf-8");
    this.products = await JSON.parse(data);
    return this.products;
  }
    /***************************************************************************** */
  // Metodo getProducts()
  getProductsLimit= async (limit)=> {
    //Debe tener un método getProducts, el cual debe leer el archivo de productos y
    //devolver todos los productos en formato de arreglo.
    const data = await fs.promises.readFile(this.path, "utf-8");
    this.products = await JSON.parse(data);
    const dataLimit = this.products.slice(0,limit)
    return dataLimit;
  }

  /***************************************************************************** */
  // Metodo Save(array)
  save =  async (array)=> {
    // Este metodo escribe el array en el archivo
    try{
      await fs.promises.writeFile(this.path, JSON.stringify(array));
    } catch(error) {
      console.log(
        `Error (${error.code}) when trying to save data!`
      );
    }
  }
  /***************************************************************************** */
  //Metodo UpdateProductById(id)
  UpdateProductById = async (
    idi,
    title,
    description,
    price,
    thumbnail,
    code,
    stock
  )=> {
    try{
      let productObj = {
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock,
        id: idi,
      };
    this.products = await this.getProducts();
    const existeProducto = this.products.findIndex((p) => p.id === idi);
    if (existeProducto >= 0) {
      this.products[existeProducto] = productObj;
      console.log(
        `The product with the id ${idi} already exist and was Updated.`
        );
        await this.save(this.products);
      } else {
        console.log("Product doesnt exist");
      }
    }catch (error) {
      console.log(
        `Error (${error.code}) when trying to Update the product with this id ${idi}.`
      );
    }
  }
  /***************************************************************************** */
  // Metodo getProductById(id)
  getProductById = async (id)=> {
    try{
      this.products = await this.getProducts();
      return this.products.find((p) => p.id === id) ?? "Product not found";
    } catch{
      return "Product not found"
    }
  }
  /***************************************************************************** */
  // Metodo deleteById(Number)
  deleteById= async (id)=> {
    try{
      this.products = await this.getProducts();
      this.products = this.products.filter((idbuscado) => idbuscado.id != id);
      await this.save(this.products);
      console.log(`The element with id: ${id} was removed !`);
      return this.products
    } catch (error) {
      console.log(
        `Error (${error.code}) when trying to delete id: ${id}.`
      );
    }
  }
  /***************************************************************************** */
  //Metodo deleteAll()
  deleteAll= async()=> {
    try {
      setTimeout(
        async ()=>{
          this.products = [];
          await this.save(this.products);
          console.log(`All data was removed!!`);
        },1000)
    } catch (error) {
      console.log(
        `Error (${error.code}) when trying to delete the file content.`
      );
    }
  }
  /***************************************************************************** */
  //Metodo addProduct(title, description, price, thumbnail, code, stock)
   addProduct = async (title, description, price, thumbnail, code, stock)=> {
    try {
      let productObj = {
        title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
      id: this.#getMaxId() + 1,
    };
    const requerido = Object.values(productObj).includes(null || undefined);
    if (requerido) {
      console.log("All fields are Requied... Please Check!");
    } else {
      const existeProducto = this.products.find((p) => p.code === code);
      if (existeProducto) {
        console.log(`The product with the code ${code} already exist.`);
      } else {
        this.products.push(productObj);
        await this.save(this.products);
        console.log(`The element with code: ${code} was added !`);
      }
    }
    }  catch (error) {
      console.log(
        `Error (${error.code}) when trying to add id ${id} to the file content.`
      );
    }

  }
  /***************************************************************************** */
  //Metodo Privado getMaxId()
  #getMaxId() {
    //Devuelve el Maximo valor del ID
    let maxId = 0;
    this.products.map((evento) => {
      if (evento.id > maxId) maxId = evento.id;
    });
    return maxId;
  }
  /***************************************************************************** */
}
/***************************************************************************** */
/*          FINAL DE LA CLASE Product Manager                                  */
/***************************************************************************** */
/***************************************************************************** */
