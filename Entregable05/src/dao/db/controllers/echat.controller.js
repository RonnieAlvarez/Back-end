import {ChatModel}  from '../models/ecommerce.model.js'
import { STATUS } from "../../../config/constants.js";

export async function getchat(req, res) {
    try {
      return res.status(201).render("realTimeChat");
    } catch (error) {
      res.status(400).json({
        error: error.message,
        status: STATUS.FAIL,
      });
    }
  }


// export async function getChats(req, res) {
//   try {
//     const chats = await ChatModel.find().sort("-date");
//     res.json(chats);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

// export async function createChat(req, res) {
//   const chat = new ChatModel({
//     user: req.body.user,
//     message: req.body.message,
//     date: req.body.date,
//   });
//   try {
//     const newChat = await chat.save();
//     res.status(201).json(newChat);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// }

// export async function deleteChats(req, res) {
//   try {
//     await ChatModel.deleteMany();
//     res.json({ message: "All chats deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }
