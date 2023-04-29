import {Router} from 'express';
const router = Router();

router.get('/login', (req, res)=>{
    res.render("login");
})

router.get('/register', (req, res)=>{
    res.render("register");
})

router.get('/', (req, res)=>{
    res.render("profile", {
        user: req.session.user
    });
})

export default router;


// https://github.com/AleHts29/51135-programacion-backend/tree/main/Clase_19/src/views