import * as ProductService from "../services/eproducts.service.js";
import { ProductModel } from "../models/ecommerce.model.js";
import { STATUS } from "../../../config/constants.js";
import handlebars from 'handlebars';

/**
 * This is an asynchronous function that retrieves a product based on a given ID and returns a JSON
 * response with the product and a status.
 */
export async function getProduct(req, res) {
  try {
    const { pid } = req.params;
    const response = await ProductService.getProduct(pid);
    res.json({
      product: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}


/**
 * This is an asynchronous function that retrieves a list of products from a database, paginates them,
 * and renders them in an HTML template with links to navigate between pages and return to the home
 * menu.
 * */
export async function getProducts(req, res) {
  try {
    const url = req.originalUrl;
    const localPort = parseInt(process.env.port);
    let { page, limit } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const products = await ProductModel.paginate(
      { deletedAt: { $exists: false } },
      { page, limit, lean: true  }
    );

    const productsprevLink = `http://localhost:${localPort}/?page=${products.prevPage}&limit=${limit}`;
    const productsnextLink = `http://localhost:${localPort}/?page=${products.nextPage}&limit=${limit}`;
    const productHomeLink = `http://localhost:${localPort}/menu/menu`
    if (!products.docs) {
      return res.send("<p>No products found</p>");
    }

    const template = handlebars.compile(`
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Desafio-06 BackEnd</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>

<body class="bg-ligth">
    

      <div class="container mt-1 p-2 m-auto bg-dark">
        {{#each products.docs}}
          <div class="py-10 mt-2  mx-auto flex items-center bg-info">
            <h2 class="mx-5">ID: {{lookup this "id"}}</h2>
            <h2 class="mx-5">Name: {{lookup this "Title"}}</h2>
            <h3 class="mx-5">Price: {{lookup this "Price"}}</h3>
            <h4 class="mx-5">Description: {{lookup this "Description"}}</h4>
          </div>
        {{/each}}
      </div>
      <div class="container mt-1 p-2 m-auto bg-dark rounded">
      <a href=${productsprevLink}  class="btn btn-secondary btn-sm rounded  ">Prev Page</a>
      <a href=${productsnextLink}  class="btn btn-secondary btn-sm rounded  ">Next Page</a>
      <a href=${productHomeLink}  class="btn btn-secondary btn-sm rounded  ">Home Menu</a>
      </div>
      <div class="container mt-1 p-2 m-auto bg-info rounded">
      <p>Page {{ products.page }} of {{ products.totalPages }}, showing {{ products.docs.length }} out of {{ products.totalDocs }} results</p>
    </div>
    
      </body>

</html>
    `);

    const renderedHtml = template({ products: products });
    return res.send(renderedHtml);
    //document.getElementById("stats").innerHTML = products
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}


/**
 * This function retrieves all products from a ProductService and renders them in a real-time view.
 */
export async function getRealProducts(req, res) {
  try {
    const products = await ProductService.getAllProducts();
    return res.render("realTimeProducts", { productsa: products });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

/**
 * This function creates a new product and renders a page with all products.
 */
export async function createRealProduct(req, res) {
  try {
    const { body } = req;
    let products = await ProductService.createProduct(body);
    products = await ProductService.getProducts();
    res.status(201).render("realTimeProducts", { productsa: products });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

/**
 * This function deletes a real product using its ID and then renders a page with all the remaining
 * products.
 */
export async function deleteRealProduct(req, res) {
  try {
    const id = parseInt(req.query.pid);
    await ProductService.deleteRealProduct(id);
    let products = await ProductService.getAllProducts();
    res.status(201).render("realTimeProducts", { productsa: products });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

//****************************************** */

/**
 * This is an asynchronous function that creates a product and returns a JSON response with the product
 * and a success status code, or an error message and a fail status code.
 */
export async function createProduct(req, res) {
  try {
    const { body } = req;
    const response = await ProductService.createProduct(body);
    res.status(201).json({
      product: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

/**
 * This is an asynchronous function that updates a product and returns a JSON response with the updated
 * product and a status code.
 */
export async function updateProduct(req, res) {
  try {
    const { pid } = req.params;
    const { body } = req;
    const response = await ProductService.updateProduct(pid, body);
    res.status(201).json({
      product: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

/**
 * This is an asynchronous function that deletes a product and returns a success message or an error
 * message with a corresponding status code.
 */
export async function deleteProduct(req, res) {
  try {
    const { pid } = req.params;

    await ProductService.deleteProduct(pid);
    res.status(201).json({
      message: "Producto eliminado correctamente",
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
