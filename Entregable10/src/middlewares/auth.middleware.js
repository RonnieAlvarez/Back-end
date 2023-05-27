import jwt_decode from "jwt-decode"


/**
 * This function checks for a JWT token in the cookies of a request and sets the user property of the
 * request object if the token is valid, otherwise it redirects to the login page.
 */
export default function auth(req,res,next){
    const tokens = req.cookies.jwtCookieToken
    if (tokens){
        const decoded = jwt_decode(tokens)
        let user = decoded.user
        req.user = user
        console.log(user.roll)
        next(null,req.user)
    } 
    if (!req.user){
        console.log('auth middleware :'+tokens)
        res.status(401).redirect('/users/login');
    }

}

