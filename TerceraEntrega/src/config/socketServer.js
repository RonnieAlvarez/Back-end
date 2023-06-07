import { Server } from "socket.io";
import { ChatModel } from "../dao/db/models/ecommerce.model.js";
import config from "./config.js";
import jwt from "jsonwebtoken";

const PRIVATE_KEY = config.jwtKey;
const messages = [];

function decodeToken(token) {
    try {
        const decoded = jwt.verify(token, PRIVATE_KEY); // Reemplaza 'secretKey' con tu propia clave secreta utilizada para firmar el token
        return decoded;
    } catch (error) {
        // Manejo de errores en caso de que el token sea inválido o haya expirado
        console.error("Error al decodificar el token:", error);
        return null;
    }
}

export function createSocketServer(server) {
    const socketServer = new Server(server);
    socketServer.on("connection", (socket) => {
        console.log("New Connection");
        let user = null;
//---------------
const cookie4 =String(socket.handshake.headers.cookie)
//cookie4 = req.cookies
const cookieaux = cookie4.split('; ');
let auxToken=[]
let tokens
if (cookieaux.length>1){
    auxToken = cookieaux.find(cookie => cookie.startsWith('jwtCookieToken='));
    tokens = auxToken.split('=')[1];
} else if (cookieaux.length=1 && cookie4.includes('jwtCookieToken')){
    tokens = cookie4.split("=")[1];}
else{
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
    res.send({ error: "Invalid Token", message: "Invalid Token for user: " });
    //async (req,res)=> res.status(401).redirect('/users/logout');
}

//------------------
    //    const tokens = socket.handshake.headers.cookie.split("=")[1];
        if (tokens) {
            const decoded = decodeToken(tokens);
            user = decoded.user;
        }
        let userEmail = user.email;
        socket.emit("userEmail", userEmail);
        socket.emit("Welcome", { welcome: "Welcome", messages });
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
        socket.on("message", async (data) => {
            data.userEmail = userEmail;
            console.log("Server:", data);
            messages.push(data);
            socketServer.emit("message", data);
            const Messages = new ChatModel({
                userEmail: data.userEmail,
                message: data.message,
                date: data.date,
            });
            try {
                const newChat = await Messages.save();
                console.log("New chat saved to database:", newChat);
            } catch (err) {
                console.error(err);
            }
        });
        socket.on("newUser", (_name) => {
            socket.broadcast.emit("newUser", _name);
        });
    });
}
