/********************************************************************************* */
import fs from "fs";
/***************************************************************************** */
export default class cartManager {
  /**
   * The constructor function is a function that is called when a new object is created.
   * @param path - The path of the track.
   */
  constructor(path) {
    this.path = path;
    this.carts = [];
  }
  /***************************************************************************** */
  //
  /* A function that is called when the class is instantiated. */
  init = async () => {
    try {
      let data = await fs.promises.readFile(this.path);
      this.carts = JSON.parse(data);
    } catch {
      this.carts = [
        {
          id: 1,
          products: [{ prodid: 1, quantity: 1 }],
        },
        {
          id: 2,
          products: [{ prodid: 2, quantity: 1 }],
        },
      ];
      this.save(this.carts);
    }
  };
  /***************************************************************************** */
  //
  /* Reading the file and returning the carts. */
  getcartAll = async () => {
    let data = await fs.promises.readFile(this.path, "utf-8");
    this.carts = JSON.parse(data);
    return this.carts;
  };
  /***************************************************************************** */
  //
  /* Saving the array in the file. */
  save = async (array) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(array));
    } catch (error) {
      console.log(`Error (${error.code}) when trying to save data!`);
    }
  };
  /***************************************************************************** */
  //
  /* Getting the cart by id. */
  getCartById = async (id) => {
    try {
      this.carts = await this.getcartAll();
      return this.carts.find((p) => p.id === id) ?? "Cart not found";
    } catch {
      return "Cart not found";
    }
  };
  /***************************************************************************** */
  //
  /* Deleting an element from the array. */
  deleteById = async (id) => {
    try {
      this.carts = await this.getcartAll();
      this.carts = this.carts.filter((idbuscado) => idbuscado.id != id);
      await this.save(this.carts);
      console.log(`The element with id: ${id} was removed !`);
      return this.carts;
    } catch (error) {
      console.log(`Error (${error.code}) when trying to delete id: ${id}.`);
    }
  };
  /***************************************************************************** */
  //
  /* Adding a new cart to the carts array. */
  addCart = async (products) => {
    console.log(products);
    try {
      let cartObj = {
        id: this.#getMaxIdCart() + 1,
        products: products,
      };
      console.log(cartObj);
      const required = Object.values(cartObj).includes(null || undefined);
      if (required) {
        console.log("All fields are Requied... Please Check!");
      } else {
        const existCart = this.carts.find((p) => p.id === cartObj.id);
        if (existCart) {
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
  //
  #getMaxIdCart() {
    /* Getting the max id of the carts. */
    let maxId = 0;
    this.carts.map((evento) => {
      if (evento.id > maxId) maxId = evento.id;
    });
    return maxId;
  }
}

/***************************************************************************** */
/*                         CLASS Cart Manager END                              */
/***************************************************************************** */
