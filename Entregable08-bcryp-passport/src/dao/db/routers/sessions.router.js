import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post("/register", passport.authenticate('register', { failureRedirect: '/users/register' }),
    async (req, res) => {
        return res.status(201).redirect('/users/login')
    });


    router.post("/login", passport.authenticate('login', { failureRedirect: '/users/register' }), async (req, res) => {
        
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
    const user = req.user._doc;
        if (!user) return res.status(401).redirect('/users/register')
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            roll:user.roll
        }
        req.session.login=true;
        const sessemail = res.cookie('session-id',user.email);
        return res.redirect('/')
    });
    

export default router;