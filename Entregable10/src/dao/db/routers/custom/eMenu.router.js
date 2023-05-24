import * as eMenuController from '../../controllers/emenu.controller.js'

import CustomRouter from './custom.router.js'

export default class eMenuRouter extends CustomRouter {
  init () {


this.get('/products', { policies: ['USER'] },eMenuController.getmenuProducts)
this.get('/menu', { policies: ['USER'] },eMenuController.getMenu)


}}