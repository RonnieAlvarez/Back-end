import { STATUS } from "../../../config/constants.js";
import handlebars from 'handlebars';
import { ProductModel } from "../models/ecommerce.model.js";



/**
 * This function returns a rendered real-time menu and handles errors if any.
 * It contains methods and properties that allow the server to send data, set headers, and control the
 * response status code. In this specific code snippet, `res` is used to send a rendered HTML page with
 * @returns A rendered view called "realTimeMenu" with a status code of 201 is being returned.
 */
export async function getMenu(req, res) {
  try {
    return res.status(201).render("realTimeMenu");

  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}


/**
 * This is an asynchronous function that retrieves and paginates products based on query
 * parameters, and returns an HTML template with the results.
  * @returns This function returns an HTML page with a list of products, pagination links, and
 * information about the current page and total number of results. The products are retrieved from a
 * MongoDB database using the `ProductModel.paginate()` method, and the query parameters `page`,
 * `limit`, `sort`, `sortorder`, and `filter` are used to control the pagination and filtering of the
 * results. The HTML
 */
export async function getmenuProducts(req, res) {
  try {
    const localPort = parseInt(process.env.port);
    let { page, limit,sort,sortorder,filter} = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    if (sortorder ==='Desc'){
      sort=`-${sort}`
    }
    
    
const query = {};
const separator = ':';
const index = filter.indexOf(separator); 
const key = filter.slice(0, index); 
const value = filter.slice(index + 1); 
query[key] = value; 

    const products = await ProductModel.paginate(
      query,{ page, limit,sort,sortorder, lean: true  },{ deletedAt: { $exists: false } }
    )
  

    const productsprevLink = `http://localhost:${localPort}/menu/products/?page=${products.prevPage}&limit=${limit}&sort=${sort}&filter=${filter}`;
    const productsnextLink = `http://localhost:${localPort}/menu/products/?page=${products.nextPage}&limit=${limit}&sort=${sort}&filter=${filter}`;
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
      <p>Page {{ products.page }} of {{ products.totalPages }}, showing ${filter} {{ products.docs.length }} out of {{ products.totalDocs }} results</p>
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


