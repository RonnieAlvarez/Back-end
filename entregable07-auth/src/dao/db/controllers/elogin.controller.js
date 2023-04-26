import { STATUS } from "../../../config/constants.js";


  export async function logout(req,res) {
    try{
        req.session.destroy((err)=>{
            if(err){
                res.json(err)
            }else {
                res.clearCookie('session-id')
            //    res.send('Salio de la aplicacion')
                res.redirect('/login')
            }
        })
    } catch{
        res.status(400).json({
            error: error.message,
            status: STATUS.FAIL,
        })
    }
}


    
    
export async function login (req,res) {
    try {
        const {email,pass} = req.body
        if(email==="admin@mail.com" && pass==="1234"){
            req.session.contador=0;
            req.session.login=true;
            res.cookie('session-id',email);
        //    res.send(`Bienvenido ${name}`)
            res.redirect('/')
        }else{
            res.send("Usuario o contraseña incorrectos")
        }  
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            status: STATUS.FAIL,
        })
    }
}

export async function menuprincipal(req, res) {
    const sessi = req.cookies
    const sessionId=sessi['session-id']

        try {
            return res.render("menuprincipal",{sessionId});
        } catch (error) {
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL,
            });
        }
    }
    
