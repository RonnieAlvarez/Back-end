export default function auth(req,res,next){
    if(req.session.login){
        req.session.touch(),
        next();
    }else{
        res.status(401).redirect('/users/login');
    }
}