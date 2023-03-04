// ENTREGABLE 01 RONNIE ALVAREZ CASTRO  CODERHOUSE PROGRAMA FULLSTACK CURSO BACKEND 17/02/2023
//
//
// Realizar una clase “ProductManager” que gestione un conjunto de productos.
class productManager {
  constructor() {
    // Debe crearse desde su constructor con el elemento products, el cual será un arreglo vacío.
    this.products = [];
  }
  // Cada producto que gestione debe contar con las propiedades:
  // title (nombre del producto)
  // description (descripción del producto)
  // price (precio)
  // thumbnail (ruta de imagen)
  // code (código identificador)
  // stock (número de piezas disponibles)

  addProduct(title, description, price, thumbnail, code, stock) {
    // Debe contar con un método “addProduct” el cual agregará un producto al arreglo de productos inicial.
    let productObj = {
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
      id: this.#getMaxId()+1,
      // Al agregarlo, debe crearse con un id autoincrementable
    };

    
    // Validar que no se repita el campo “code” y que todos los campos sean obligatorios
    const requerido = Object.values(productObj).includes(null || undefined);
    if (requerido) {
      console.log("Todos los campos son requeridos... Verifique por favor");
    } else {
      const existeProducto = this.products.find((p) => p.code === code);
      if (existeProducto) {
        console.log(`El producto con código ${code} ya existe.`);
      } else {
        this.products.push(productObj);
        console.log(`El producto con código ${code} ha sido agregado.`);
      }
    }
  }
  #getMaxId(){
    let maxId=0
    this.products.map((evento)=>{
      if(evento.id>maxId) maxId=evento.id;
    })
    return maxId;
  }
  getProducts() {
    // Debe contar con un método “getProducts” el cual debe devolver el arreglo con todos los productos creados hasta ese momento
    return this.products;
  }
  getProductById(id) {
    // Debe contar con un método “getProductById” el cual debe buscar en el arreglo el producto que coincida con el id
    // En caso de no coincidir ningún id, mostrar en consola un error “Not found”
    return this.products.find((p) => p.id === id) ?? "Product not found";
  }
}
console.clear();
console.log('********************************')
// Se crea instancia prod1 de la clase productManager
const prod1 = new productManager();

prod1.addProduct("lee", "pantalon", 25, "cualquyie", "asd123", 15);
prod1.addProduct("levis", "camisa", 40, "otro thum", "asd654", 15);
prod1.addProduct("lee", "short", 15, "cual", "asd123", 5);
prod1.addProduct("lee", "short", 15, "cual", "asd123");
prod1.addProduct("cortefiel", "abrigo", 140, "otro thum", "rew952", 6);
prod1.addProduct("corte de Hierro", "abrigo", 140, "otro", "rew953", 6);

console.log(prod1.getProducts());
console.log(prod1.getProductById(2));

