import { Router } from 'express';
import userModel from '../models/ecommerce.model.js';
import {isValidPassword} from '../../../utils.js';
import { generateJWToken } from '../../../utils.js';

const router = Router();

router.post("/loginjwt", async (req, res)=>{
   const {email, password} = req.body
   try {
    const user = await userModel.findOne({email: email});
//    console.log("Usuario encontrado para login:");
    //console.log(user);

    if(!user){
        console.warn("User doesn't exists with username: " + email);
        return res.status(401).send({error: "Not found", message: "User not found: " + email}); 
    }

    if(!isValidPassword){
        console.warn("Invalid credentials for user: " + email);
        return res.status(401).send({status:"error",error:"Invalid credentials!"}); 
    }

    const tokenUser = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        roll: user.roll
    }

    const access_token = generateJWToken(tokenUser);
//    console.log(access_token);


    // Con Cookies
    res.cookie('jwtCookieToken', access_token , {
        maxAge: 60000,
        // httpOnly: false // expone la cookie
        httpOnly: true // No expone la cookie debe ir en true
    })

    // res.send({message: "login successful!!", jwt: access_token })
    res.send({message: "Login successful!"});
    
   } catch (error) {
    //console.error(error);
        return res.status(500).send({status:"error",error:"Internal Error!"});
   }
    
});

export default router;