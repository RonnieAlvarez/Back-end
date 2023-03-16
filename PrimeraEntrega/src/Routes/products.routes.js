import { Router } from "express"
const router = Router()
let products=[]

router.get('/products',(req,res)=>{
    res.send(products)
})


export default router