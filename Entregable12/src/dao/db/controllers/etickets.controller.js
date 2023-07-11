import { getAllTickets } from "../services/etickets.service.js";

export async function showTickets(req, res) {
  try {
    let etickets = await getAllTickets();
    let user = req.user;
    res.render("realTimeTickets", { etickets: etickets, user: user });
  } catch (error) {
    res.status(400).render("nopage", { messagedanger: `${error.message}` });
  }
}
