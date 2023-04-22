import  express  from "express";
import * as eChatController from '../controllers/echat.controller.js'

const chatroute = express.Router()

chatroute.get('/chat',eChatController.getchat)

export default chatroute