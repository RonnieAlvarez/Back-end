export default function auth(req,res,next){
    if(req.session.login){
        //con la siguiente linea mientras este viva la session actualiza el maxAge
        req.session.touch(),
        next();
    }else{
        res.status(401).redirect('/login');
        // res.status(401).send('No autorizado');
        // res.redirect('/login');
    }
}