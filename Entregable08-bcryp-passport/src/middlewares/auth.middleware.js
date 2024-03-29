export default function auth(req,res,next){
    
    console.log(req.isAuthenticated())
    console.log(req.session.login)
    if(req.session.login||req.isAuthenticated()){
        const  {first_name,last_name, roll}  = req.user._doc;
        let name =first_name+' '+last_name
        req.session.touch(),
        next(null,{name,roll});
    }else{
        res.status(401).redirect('/users/login');
    }
}
