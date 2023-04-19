import { STATUS } from "../../../config/constants.js";


/**
 * This function retrieves all carts from a database and renders them in a real-time view.
 */
export async function getMenu(req, res) {
  try {
    return res.status(201).render("realTimeMenu");
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
