import {Router} from 'express';
import {authToken} from '../../../utils.js';
import passport from "passport";
import { passportCall, authorization } from '../../../utils.js';


const router = Router();

// router.get('/',authToken, (req, res)=>{
//     res.render("profile", {
//         // user: req.session.user
//         user: req.user
//     });
// })


router.get("/",
    // authToken,
    passportCall('jwt'), 
    authorization('User'),
    async (req, res)=>{
         res.render("menuprincipal",{user: req.user})
    }
)



router.get('/login', async (req, res)=>{
     res.render("login");
})

router.get('/register', (req, res)=>{
    res.render("register");
})

router.get('/profile', (req, res)=>{
    const user = req.user
    res.render("profile", {user});
})

router.get('/logout',async (req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                res.json(err)
            }else {
                res.clearCookie('session-id')
                return res.status(201).redirect('/users/login')
            }
        })
    } catch{
        res.status(400).json({
            error: "Error",
            status: STATUS.FAIL,
        })
    }
})

export default router;