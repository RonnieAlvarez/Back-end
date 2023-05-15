import {Router} from 'express';
import { passportCall, authorization } from '../../../utils.js';


const router = Router();

router.get("/",
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

/* This code defines a route for logging out a user. When the user accesses this route, the
`req.session` object is destroyed, which effectively logs the user out. If there is an error
destroying the session, the error is returned as a JSON response. If the session is successfully
destroyed, the `session-id` cookie is cleared and the user is redirected to the login page with a
status code of 201. */
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