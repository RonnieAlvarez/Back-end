/**
 * This is an authentication middleware function that checks if a user is logged in and returns their
 * name and roll if they are, otherwise it redirects them to the login page with a 401 status code.
 * @param req - The request object represents the HTTP request that the client (usually a web browser)
 * sends to the server.
 * @param res - res stands for response and it is an object that represents the HTTP response that an
 * Express app sends when it receives an HTTP request. It contains methods for sending the response
 * back to the client, such as res.send(), res.json(), res.redirect(), etc.
 * @param next - `next` is a callback function that is called when the middleware function is done
 * processing the request. It is used to pass control to the next middleware function in the chain. If
 * an error occurs, the error should be passed as the first argument to `next`. If there are no errors,
 * `
 */
export default function auth(req,res,next){

    if(req.session.login||req.isAuthenticated()){
        const  {first_name,last_name, roll}  = req.user._doc;
        let name =first_name+' '+last_name
        req.session.touch(),
        console.log('TTL de la sesión:', req.session.cookie.expires);
        next(null,{name,roll});
    }else{
        res.status(401).redirect('/users/login');
    }
}
