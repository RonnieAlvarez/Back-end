import {Router} from 'express';

const router = Router();

router.get('/login', (req, res)=>{
    res.render("login");
})

router.get('/register', (req, res)=>{
    res.render("register");
})

router.get('/profile', (req, res)=>{
    const user = req.session.user
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