import { Router } from 'express';
import  userModel from "../models/ecommerce.model.js";
import {createHash, isValidPassword } from '../../../utils.js';

const router = Router();

router.post("/register", async (req, res)=>{
    const { first_name, last_name, email, age, password,roll} = req.body;
    console.log("Registrando usuario:");
    console.log(req.body);

    const exists = await userModel.findOne({email});
    if (exists){
            return res.redirect('/users/login')
    }
    const user = {
        first_name,
        last_name,
        email,
        age,
        roll:'User',
        password:createHash(password)
    };
    const result = await userModel.create(user);
    return res.status(201).redirect('/users/login')
}); 

router.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    if (email==='adminCoder@coder.com' && password ==='adminCod3r123'){
        req.session.user= {
            name : 'CoderHouse',
            email: email,
            age: 21,
            roll:"Admin"
        }
        req.session.login=true;
        const sessemail = res.cookie('session-id',email);
        return res.redirect('/')
    }
    //const user = await userModel.findOne({email,password}); 
    const user = await userModel.findOne({email}); 
    //if(!user) return res.status(401).redirect('/users/register')
    if(!isValidPassword(user,password )){
        return res.status(401).redirect('/users/register')
    }

    req.session.user= {
        name : `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        roll:user.roll
    }
        req.session.login=true;
        const sessemail = res.cookie('session-id',email);
    return res.redirect('/')
});

export default router;