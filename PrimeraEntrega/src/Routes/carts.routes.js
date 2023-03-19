import { Router } from "express"
import cartManager from "../Classes/cartsManager.js";

const carts = new cartManager("./src/Routes/carts.json")
const router = Router()
carts.init()


router.get("/", async (req, res) => {
    try{
        const array = await  carts.getcartAll();
        res.send(array);
    } catch {
      res.status(500).send(err.message);
    }
})    
  
/********************************************************************************* */
// --------------------------------------------------------------------------------

router.post('/',async (req,res)=>{
    try{
      const { products} = req.body
        carts.addCart(products)
          res.send({status:"Success",msg:"Cart Added"})
        }catch{
          res.status(500).send(err.message);
        }
})


export default router