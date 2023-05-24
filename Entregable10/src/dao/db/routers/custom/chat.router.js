import * as eChatController from '../../controllers/echat.controller.js'

import CustomRouter from './custom.router.js'

export default class ChatRouter extends CustomRouter {
  init () {

this.get('/chat',{ policies: ['USER'] },eChatController.getchat)


}}