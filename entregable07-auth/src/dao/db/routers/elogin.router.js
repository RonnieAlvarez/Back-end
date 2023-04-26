import  express  from "express";
import auth from "../../../middlewares/auth.middleware.js"
import * as eloginController from '../controllers/elogin.controller.js'

const route = express.Router()

route.get('/logout',eloginController.logout)
//route.get('/login',eloginController.login)
route.post('/login',eloginController.login)

route.get("/",auth,eloginController.menuprincipal)

export default route