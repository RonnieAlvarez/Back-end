/********************************************************************************* */
import fs from "fs";
/***************************************************************************** */
export default class cartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }
  /***************************************************************************** */
  //inicializa el archivo con un array vacio y si no existe lo crea con 10 objetos
  //de prueba
  init = async () => {
    try {
      let data = await fs.promises.readFile(this.path);
      this.carts = JSON.parse(data);
    } catch {
      this.carts = [
        {
          id: 1,
          products: [{"prodid":1}],
        },
        {
          id: 2,
          products: [{"prodid":2}],
        }
      ];
      this.save(this.carts);
    }
  };
  /***************************************************************************** */
  // devuelve todos los elementos del array
  getcartAll = async () => {
    let data = await fs.promises.readFile(this.path, "utf-8");
    this.carts = JSON.parse(data);
    return this.carts;
  };
  /***************************************************************************** */
  // Metodo writeEmpty(path)
  writeEmpty = async () => {
    //Este metodo escribe un archivo en blanco
    this.carts = [];
    try {
      await this.save(this.carts);
    } catch {
      console.log(`File ${path} was created without data`);
    }
  };
  /***************************************************************************** */
  // Metodo getProducts()
  getCarts = async () => {
    //Debe tener un método getProducts, el cual debe leer el archivo de productos y
    //devolver todos los productos en formato de arreglo.
    const data = await fs.promises.readFile(this.path, "utf-8");
    this.carts = await JSON.parse(data);
    return this.carts;
  };
  /***************************************************************************** */
  // Metodo getProducts()
  getCartsLimit = async (limit) => {
    //Debe tener un método getProducts, el cual debe leer el archivo de productos y
    //devolver todos los productos en formato de arreglo.
    const data = await fs.promises.readFile(this.path, "utf-8");
    this.carts = await JSON.parse(data);
    const dataLimit = this.carts.slice(0, limit);
    return dataLimit;
  };

  /***************************************************************************** */
  // Metodo Save(array)
  save = async (array) => {
    // Este metodo escribe el array en el archivo
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(array));
    } catch (error) {
      console.log(`Error (${error.code}) when trying to save data!`);
    }
  };
  /***************************************************************************** */
  //Metodo UpdateProductById(id)
  UpdateCartById = async (newObj) => {
  try {
      let pid=newObj.id
      this.carts = await this.getCarts();
      const existeCart = this.carts.findIndex((p) => p.id === pid);
      if (existeCart >= 0) {
        this.products[existeCart] = {...this.Carts[existeCart],...newObj}
        console.log(`The cart with the id ${pid} already exist and was Updated.`        );
        await this.save(this.carts);
      } else {
        console.log("Cart doesnt exist");
      }
    } catch (error) {
      console.log(
        `Error (${error.code}) when trying to Update the product with this id ${pid}.`
      );
    }
  };
  /***************************************************************************** */
  // Metodo getProductById(id)
  getCartById = async (id) => {
    try {
      this.carts = await this.getCarts();
      return this.carts.find((p) => p.id === id) ?? "Cart not found";
    } catch {
      return "Cart not found";
      
    }
  };
  /***************************************************************************** */
  // Metodo deleteById(Number)
  deleteById = async (id) => {
    try {
      this.carts = await this.getCarts();
      this.carts = this.carts.filter((idbuscado) => idbuscado.id != id);
      await this.save(this.carts);
      console.log(`The element with id: ${id} was removed !`);
      return this.carts;
    } catch (error) {
      console.log(`Error (${error.code}) when trying to delete id: ${id}.`);
    }
  };
  /***************************************************************************** */
  //Metodo deleteAll()
  deleteAll = async () => {
    try {
      setTimeout(async () => {
        this.carts = [];
        await this.save(this.carts);
        console.log(`All data was removed!!`);
      }, 1000);
    } catch (error) {
      console.log(
        `Error (${error.code}) when trying to delete the file content.`
      );
    }
  };
  /***************************************************************************** */
  //Metodo addProduct(title, description, price, thumbnail, code, stock)
  addCart = async (products ) => {
    console.log(products)
    try {
      let cartObj = {
        id: this.#getMaxIdCart() + 1,
        products: products
      };
      
      console.log(cartObj)
      const requerido = Object.values(cartObj).includes(null || undefined);
      if (requerido) {
        console.log("All fields are Requied... Please Check!");
      } else {
        const existeCart = this.carts.find((p) => p.id === cartObj.id);
        if (existeCart) {
          console.log(`The product with the ID ${cartObj.id} already exist.`);
        } else {
          this.carts.push(cartObj);
          await this.save(this.carts);
          console.log(`The element with code: ${cartObj.id} was added !`);
        }
      }
    } catch (error) {
      console.log(
        `Error (${error.code}) when trying to add id  to the file content.`
      );
    }
  };
  /***************************************************************************** */
  //Metodo Privado getMaxId()
  #getMaxIdCart() {
    //Devuelve el Maximo valor del ID
    let maxId = 0;
    this.carts.map((evento) => {
      if (evento.id > maxId) maxId = evento.id;
    });
    return maxId;
  }
  /***************************************************************************** */
}
/***************************************************************************** */
/*          FINAL DE LA CLASE Cart Manager                                  */
/***************************************************************************** */
/***************************************************************************** */
