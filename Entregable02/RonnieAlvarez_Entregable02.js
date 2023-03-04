//ENTREGABLE 02 RONNIE ALVAREZ CASTRO  CODERHOUSE PROGRAMA FULLSTACK CURSO BACKEND 
//
//
const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.save(this.products);
  }

  // Metodo writeEmpty(path)
  writeEmpty() {
    //Este metodo escribe un archivo en blanco
    this.products = [];
    try {
      this.save(this.products);
    } catch {
      console.log(`File ${path} was created without data`);
    }
  }
  // Metodo getProducts()
  getProducts() {
    //Debe tener un método getProducts, el cual debe leer el archivo de productos y
    //devolver todos los productos en formato de arreglo.
    const data = fs.readFileSync(this.path, "utf-8");
    this.products = JSON.parse(data);
    return this.products;
  }

  // Metodo Save(array)
  async save(array) {
    // Este metodo escribe el array en el archivo
    fs.writeFileSync(this.path, JSON.stringify(array));
  }
  //Metodo UpdateProductById(id)
  async UpdateProductById(
    idi,
    title,
    description,
    price,
    thumbnail,
    code,
    stock
  ) {
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
    this.products = this.getProducts();
    const existeProducto = this.products.findIndex((p) => p.id === idi);
    if (existeProducto >= 0) {
      this.products[existeProducto] = productObj;
      console.log(
        `The product with the id ${idi} already exist and was Updated.`
      );
      this.save(this.products);
    } else {
      console.log("Product doesnt exist");
    }
  }
  // Metodo getProductById(id)
  getProductById(id) {
    //Debe tener un método getProductById, el cual debe recibir un id,
    //y tras leer el archivo, debe buscar el producto con el id especificado
    // y devolverlo en formato objeto
    return this.products.find((p) => p.id === id) ?? "Product not found";
  }
  // Metodo deleteById(Number)
  async deleteById(id) {
    //Debe tener un método deleteProduct, el cual debe recibir un id y debe
    // eliminar el producto que tenga ese id en el archivo.
    this.products = this.getProducts();
    this.products = this.products.filter((idbuscado) => idbuscado.id != id);
    this.save(this.products);
    console.log(`The element with id: ${id} was removed !`);
    return this.products;
  }
  //Metodo deleteAll()
  async deleteAll() {
    try {
      this.products = [];
      this.writeEmpty(this.path);
      console.log(`All data was removed!!`);
    } catch (error) {
      console.log(
        `Error (${error.code}) when trying to delete the file content.`
      );
    }
  }
  //Metodo addProduct(title, description, price, thumbnail, code, stock)
  async addProduct(title, description, price, thumbnail, code, stock) {
    //Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado,
    //asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).
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
        this.save(this.products);
        console.log(`El producto con código ${code} ha sido agregado.`);
      }
    }
  }
  //Metodo Privado getMaxId()
  #getMaxId() {
    //Devuelve el Maximo valor del ID
    let maxId = 0;
    this.products.map((evento) => {
      if (evento.id > maxId) maxId = evento.id;
    });
    return maxId;
  }
}

console.clear();
console.log( "************************** INICIO PRUEBAS ******************************");
//Se creará una instancia de la clase “ProductManager”
let prod1 = new ProductManager("./archivo.txt");
//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log(prod1.getProducts());
//Se llamará al método “addProduct” con los campos:
//title: “producto prueba”
//description:”Este es un producto prueba”
//price:200,
//thumbnail:”Sin imagen”
//code:”abc123”,
//stock:25
prod1.addProduct(
  "Producto Prueba",
  "Este es un producto prueba",
  200,
  "sin imagen",
  "abc123",
  25
);
//El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
prod1.addProduct(
  "Otra Prueba",
  "Esta es otra prueba",
  100,
  "sin imagen",
  "abc124",
  5
);
prod1.addProduct(
  "Prueba Producto a Borrar",
  "Esta es otra prueba",
  10,
  "sin imagen",
  "abc125",
  25
);
//Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
console.clear()
console.log(prod1.getProducts());
console.log("************************** PRODUCTOS AGREGADOS *************************");
//Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
console.log(prod1.getProductById(1));
console.log(prod1.getProductById(4));
//Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
prod1.UpdateProductById(
  2,
  "Pedro Colindrin",
  "Camisa de Vestir",
  600,
  "toledo",
  "qwe987",
  25
);
console.log(prod1.getProductById(1));
console.log(prod1.getProducts());
//Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
prod1.deleteById(3);
console.log(prod1.getProducts());
// Aqui estoy eliminando todos los registros para comprobar el metodo deleteAll()
prod1.deleteAll();
console.log(prod1.getProducts());
console.log("************************** FINAL *************************");
