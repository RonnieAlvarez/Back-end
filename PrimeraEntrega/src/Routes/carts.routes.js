import { Router } from "express"
const router = Router()
let carts=[]

router.get('/carts',(req,res)=>{
    res.send(carts)
})

export default router