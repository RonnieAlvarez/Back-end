export default function auth(req,res,next){
    
    console.log(req.isAuthenticated())
    if(req.session.login||req.isAuthenticated()){
        const  {first_name,last_name, roll}  = req.user._doc;
        let name =first_name+' '+last_name
        //res.locals.user = req.user._doc.first_name+' '+req.user._doc.last_name
        req.session.touch(),
        next(null,{name,roll});
    }else{
        res.status(401).redirect('/users/login');
    }
}

// export default function getUsername(req, res, next) {
//     //res.locals.user = req.user._doc.first_name+' '+req.user._doc.last_name
//     req.username = req.user.username;
//     next();
//   }