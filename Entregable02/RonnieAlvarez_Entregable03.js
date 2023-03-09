/********************************************************************************* */
//
//ENTREGABLE 02 RONNIE ALVAREZ CASTRO  CODERHOUSE PROGRAMA FULLSTACK CURSO BACKEND
// 04 Marzo 2023
/********************************************************************************* */
//
const fs = require("fs");
/***************************************************************************** */
class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.save(this.products);
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

      //Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar,
      //así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y
      //debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID
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

      //Debe tener un método getProductById, el cual debe recibir un id,
      //y tras leer el archivo, debe buscar el producto con el id especificado
      // y devolverlo en formato objeto
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
      //Debe tener un método deleteProduct, el cual debe recibir un id y debe
      // eliminar el producto que tenga ese id en el archivo.
      this.products = await this.getProducts();
      //let arrayAux =[].concat(arrayAux)
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
      //await this.writeEmpty(this.path);
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
    //await fs.promises.mkdir(this.path, { recursive: true })

    //Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente
    //especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre
    // guardarlo como un array en el archivo).
    try {

      let productObj = {
        title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
      id: this.#getMaxId() + 1,
      // Al agregarlo, debe crearse con un id autoincrementable
    };
    // Validar que no se repita el campo “code” y que todos los campos sean obligatorios
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

// INICIO DE LAS PRUEBAS
/***************************************************************************** */
console.clear();
console.log(
  "************************** INICIO PRUEBAS ******************************"
);
//Se creará una instancia de la clase “ProductManager”
let prod1 = new ProductManager("./archivo.txt");
//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
//console.log(prod1.getProducts());
//Se llamará al método “addProduct” con los campos:
//title: “producto prueba”
//description:”Este es un producto prueba”
//price:200,
//thumbnail:”Sin imagen”
//code:”abc123”,
//stock:25
prod1.addProduct(
  "Producto 1 Prueba",
  "Este es un producto prueba",
  200,
  "sin imagen",
  "abc123",
  25
);
//El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
prod1.addProduct(
  "producto 2 ",
  "Esta es otra prueba",
  100,
  "sin imagen",
  "abc124",
  5
);
prod1.addProduct(
  "Producto 3 a Borrar",
  "Esta es otra prueba",
  10,
  "sin imagen",
  "abc125",
  25
);

//Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
//console.log(prod1.getProducts());
console.log(
  "************************** PRODUCTOS AGREGADOS *************************"
);

//Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id
//especificado, en caso de no existir, debe arrojar un error.
//console.log(prod1.getProductById(1));
//console.log(prod1.getProductById(4));

//Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará
// que no se elimine el id y que sí se haya hecho la actualización.
prod1.UpdateProductById(
  2,
  "Pedro Colindrin",
  "Camisa de Vestir",
  600,
  "toledo",
  "qwe987",
  25
);

//console.log(prod1.getProductById(1));
//console.log(prod1.getProducts());
//Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto
// o que arroje un error en caso de no existir.

prod1.deleteById(3);
//console.log(prod1.getProducts());
// Aqui estoy eliminando todos los registros para comprobar el metodo deleteAll()

prod1.deleteAll();
//console.log(prod1.getProducts());
console.log("************************** FINAL *************************");

//    ************   FIN DEL DOCUMENTO    *****************
