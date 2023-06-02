import {eticketsModel} from '../models/ecommerce.model.js'



export async function createTicket(data) {
    try {
      data =  { ...data, 'code':code,'amount':amount, 'purchaser':purchaser};
      const tickets = await eticketsModel.create(data);
      return tickets;
    } catch (error) {
      throw new Error(error.message);
    } 
  }

  export async function getAllTickets() {
    try {
      const Tickets = await eticketsModel.find({ deletedAt: { $exists: false } })
      return Tickets;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  amount,
        purchaser