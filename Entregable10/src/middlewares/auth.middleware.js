import jwt_decode from "jwt-decode"


/**
 * This function checks for a JWT token in the cookies of a request and sets the user property of the
 * request object if the token is valid, otherwise it redirects to the login page.
 * @param req - req stands for request and it is an object that contains information about the HTTP
 * request that was made, such as the URL, headers, and any data that was sent with the request. It is
 * passed as the first parameter to the auth function.
 * @param res - `res` is an object representing the HTTP response that an Express.js server sends when
 * it receives an HTTP request. It contains methods for setting the response status, headers, and body.
 * In this code snippet, `res` is used to send a redirect response to the client if the user is not
 * @param next - next is a callback function that is used to pass control to the next middleware
 * function in the stack. It is typically called at the end of the current middleware function to
 * indicate that it has completed its processing and the next middleware function can take over. If an
 * error occurs in the current middleware function, it
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
        res.status(401).redirect('/users/login');
    }

}

