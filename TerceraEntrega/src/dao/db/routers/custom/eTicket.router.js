import * as eTicketsController from '../../controllers/etickets.controller.js'

import CustomRouter from './custom.router.js'

export default class eTicketRouter extends CustomRouter {
  init () {


this.post('/Tickets', { policies: ['USER','ADMIN'] },eTicketsController.createtickets)



}}