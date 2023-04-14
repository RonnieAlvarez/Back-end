import  express  from "express";
import * as eProductController from '../controllers/eproducts.controller.js'
import * as eCartController from '../controllers/ecarts.controller.js'

const route = express.Router()

    route.get('/',eProductController.getProducts)
    route.get('/realTimeProducts',eProductController.getRealProducts)
    route.post('/realTimeProducts',eProductController.createRealProduct)
    route.get('/realTimeProducts/delete',eProductController.deleteRealProduct)

    route.get('/realTimeCarts',eCartController.getRealCarts)
    route.post('/realTimeCarts',eCartController.createRealCart)
    route.post('/realTimeCarts/add',eCartController.saveProductToCart)
    route.get('/realTimeCart/delete',eCartController.deleteRealCart)

    route.get('/realTimeChat',(req, res) => {
        res.render('firstRoute',"realTimeChat");
       })

    route.get('/:pid',eProductController.getProduct)
    route.put('/:pid',eProductController.updateProduct)
    route.delete('/:pid',eProductController.deleteProduct)


export default route