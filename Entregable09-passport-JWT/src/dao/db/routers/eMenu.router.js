import  express  from "express";
import * as eMenuController from '../controllers/emenu.controller.js'

const Menuroute = express.Router()

Menuroute.get('/products',eMenuController.getmenuProducts)
Menuroute.get('/menu',eMenuController.getMenu)

export default Menuroute