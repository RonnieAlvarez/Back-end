import { Server } from "socket.io";
import {ChatModel} from "../dao/db/models/ecommerce.model.js";

const messages = [];

export function createSocketServer(server) {
  const socketServer = new Server(server);

  socketServer.on("connection", (socket) => {
    console.log("New Connection");
    socket.emit("Welcome", { welcome: "Welcome", messages });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("message", async (data) => {
      console.log("Server:", data);
      messages.push(data);
      socketServer.emit("message", data);

      const chat = new ChatModel({
        user: data.user,
        message: data.message,
        date: data.date,
      });
      try {
        const newChat = await chat.save();
        console.log("New chat saved to database:", newChat);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("newUser", (nombre) => {
      socket.broadcast.emit("newUser", nombre);
    });
  });
}
