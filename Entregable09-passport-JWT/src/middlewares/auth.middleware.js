import jwt_decode from "jwt-decode"
export default function auth(req,res,next){

    const tokens = req.cookies.jwtCookieToken
    if (tokens){
        const decoded = jwt_decode(tokens)
        let user = decoded.user
        req.user = user
        next(null,req.user)
    } 
    if (!req.user){
        res.status(401).redirect('/users/login');
    }
}

