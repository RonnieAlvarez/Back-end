import { TicketModel } from "../models/ecommerce.model.js";


export async function createtickets(req, res) {
    const { amount, purchaser } = req.body;

    // Generar un código único para el ticket
    const code = generateUniqueCode();

    // Crear una nueva instancia del modelo Ticket
    const newTicket = new TicketModel({
        code,
        amount,
        purchaser,
    });

    // Guardar el ticket en la base de datos
    newTicket
        .save()
        .then((savedTicket) => {
            res.status(201).json(savedTicket);
        })
        .catch((error) => {
            res.status(500).json({ error: "Error al guardar el ticket" });
        });
}

// Función para generar un código único para el ticket
function generateUniqueCode() {
    // Generar un identificador único utilizando un timestamp y un número aleatorio
    const timestamp = Date.now().toString(36);
    const randomNum = Math.floor(Math.random() * 100000).toString(36);
  
    // Concatenar el timestamp y el número aleatorio para formar el código único
    const uniqueCode = timestamp + randomNum;
  
    return uniqueCode;
  }
