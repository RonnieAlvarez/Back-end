import { STATUS } from "../../../config/constants.js";
import handlebars from "handlebars";
import { ProductModel } from "../models/ecommerce.model.js";

/**
 * This function returns a rendered real-time menu and handles errors if any.
 * It contains methods and properties that allow the server to send data, set headers, and control the
 * response status code. In this specific code snippet, `res` is used to send a rendered HTML page with
 * @returns A rendered view called "realTimeMenu" with a status code of 201 is being returned.
 */
export async function getMenu(req, res) {
  try {
    const sessi = req.cookies;
    const sessionId = sessi["session-id"];
    let user = req.user._doc;
    const name = user.first_name+' '+user.last_name
    user={name,...user}
    const categories = await ProductModel.distinct("Category");
    return res.status(201).render("realTimeMenu", { categories, user });
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
    /* `res.locals.user = req.session.user;` is setting a local variable `user` on the `res` object,
    which can be accessed by the view engine when rendering the HTML template. The value of `user`
    is being retrieved from the `user` property on the `req.session` object, which is set when the
    user logs in and contains information about the current user's session. This allows the view
    engine to access the user's information and display it on the rendered HTML page. */
    //res.locals.user = req.session.user;
    //const { name, roll } = res.locals.user;
    const  {first_name,last_name, roll}  = req.user._doc;
    let name =first_name+' '+last_name
    /* ************************************* */
    const localPort = parseInt(process.env.port);
    let { page, limit, sort, sortorder, filter } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    if (sortorder === "Desc") {
      sort = `-${sort}`;
    }
    const query = {};
    const separator = ":";
    const index = filter.indexOf(separator);
    const key = filter.slice(0, index);
    const value = filter.slice(index + 1);
    query[key] = value;
    const products = await ProductModel.paginate(
      query,
      { page, limit, sort, sortorder, lean: true },
      { deletedAt: { $exists: false } }
    );
    const nextpage = parseInt(products.nextPage)
      ? parseInt(products.nextPage)
      : 1;
    const prevpage = parseInt(products.prevPage)
      ? parseInt(products.prevPage)
      : 1;
    const productsprevLink = `http://localhost:${localPort}/menu/products/?page=${prevpage}&limit=${limit}&sort=${sort}&filter=${filter}`;
    const productsnextLink = `http://localhost:${localPort}/menu/products/?page=${nextpage}&limit=${limit}&sort=${sort}&filter=${filter}`;
    const productHomeLink = `http://localhost:${localPort}/menu/menu`;
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
<div class="container mt-1 p-2 m-auto d-flex flex-column w-100 rounded">
    <div class="container my-1 d-flex flex-column sticky-top bg-dark p-2 rounded">
        <span class="d-sm-inline-flex text-center align-middle justify-content-center text-light fs-4 fw-bold opacity-75">
        Back-end Final Project </span>
    </div>
    <div class="container mt-1 p-2 m-auto  bg-dark rounded d-flex justify-content-between">
    <div>
    <a href=${productsprevLink}  class="btn btn-secondary btn-sm rounded sticky-sm-bottom ">Prev Page</a>
    <a href=${productsnextLink}  class="btn btn-secondary btn-sm rounded sticky-sm-bottom ">Next Page</a>
    <a href=${productHomeLink}  class="btn btn-secondary btn-sm rounded  sticky-sm-bottom ">Home Menu</a>
    </div>
    <div>
    <span class=" text-center" style="color:white">Products</span>
    </div>
    <div>
    // <span  class="btn btn-secondary btn-sm rounded  style="color:white">${roll}: ${name}</span>
    </div>
      </div>
    <div class="container d-flex flex-column-reverse mt-2  bg-dark p-2 rounded">
          <div >
              <table class='w-100 bg-info py-10 mt-2  mx-auto items-center p-2'>
              <thead class='bg-light text-start rounded'>
              <tr >
              <th>Product _ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Stock</th>
              </tr>
              </thead>
              <tbody class='bg-info rounded'>
              {{#each products.docs}}
              <tr>
              <td><span class=" mx-2">{{lookup this "id"}}</span></td>
              <td><span class=" mx-2">{{lookup this "Title"}}</span></td>
              <td><span class=" mx-2">{{lookup this "Price"}}</span></td>
              <td><span class=" mx-2">{{lookup this "Description"}}</span></td>
              <td><span class=" mx-2">{{lookup this "Category"}}</span></td>
              <td><span class=" mx-2">{{lookup this "Stock"}}</span></td>
              </tr>
              {{/each}}
              </tbody
              </table>
          </div>
          <div class="container mt-1 p-2 m-auto bg-info rounded d-flex justify-content-between">
          <span>Page {{ products.page }} of {{ products.totalPages }} </span> 
          <span> showing ${filter}</span>
          <span> {{ products.docs.length }}  products of {{ products.totalDocs }} results</span></span>
          </div>
      </div>
    </div>
</div>
</body>
</html>
`);

    const renderedHtml = template({ products: products });
    return res.send(renderedHtml);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

/**
 * This function renders the main menu page with the user's session information.
 */
export async function menuprincipal(req, res) {
  let user = req.session.user;
  //let user = req.user._doc;
  //const name = user.first_name+' '+user.last_name
  //user={name,...user}
  
  try {
    return res.render("menuprincipal", { user });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

/**
 * This function logs out a user by destroying their session and redirecting them to the login page.
 */
export async function logout(req, res) {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.json(err);
      } else {
        res.clearCookie("session-id");
        res.redirect("/login");
      }
    });
  } catch {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
