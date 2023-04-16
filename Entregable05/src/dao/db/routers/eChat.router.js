import  express  from "express";
import * as eChatController from '../controllers/echat.controller.js'

const chatroute = express.Router()

chatroute.get('/realTimeChat',eChatController.getchat)
chatroute.get("/chats", eChatController.getChats);
chatroute.post("/chats", eChatController.createChat);
chatroute.delete("/chats", eChatController.deleteChats);




export default chatroute