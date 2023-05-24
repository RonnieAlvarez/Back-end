import CustomRouter from './custom.router.js';
import UserService from '../../services/users.service.js';
import { createHash, isValidPassword, generateJWToken } from '../../../../utils.js';


export default class UsersExtendRouter extends CustomRouter {
    init() {
        //Nota que dentro "init" realizamos la inicializacion de nuestras rutas
        const userService = new UserService();
        //Aqui se declaran los router.get
        this.get("/", ["USER"],callback1, callback2
        );

        this.get("/currentUser", ["USER", "USER_PREMIUM"], (req, res) => {
            console.log('current')
            res.send("Hola Coders2!");
            //res.sendSuccess(req.user);
        });

        this.get("/premiumUser", ["USER_PREMIUM"], (req, res) => {
            res.sendSuccess(req.user);
        });


        this.post("/login", ['USER'], async (req, res) => {
            const { email, password } = req.body;
            try {
                const user = await userService.findByUsername(email);
                console.log("Usuario encontrado para login:");
                console.log(user);
                if (!user) {
                    console.warn("User doesn't exists with username: " + email);
                    return res.status(202).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
                }
                if (!isValidPassword(user, password)) {
                    console.warn("Invalid credentials for user: " + email);
                    return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
                }
                const tokenUser = {
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    age: user.age,
                    role: user.role
                };
                const access_token = generateJWToken(tokenUser);
                console.log(access_token);
                res.send({ message: "Login successful!", access_token: access_token, id: user._id });
            } catch (error) {
                console.error(error);
                return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
            }
        });



        this.post("/register", ["USER"], async (req, res) => {
            const { first_name, last_name, email, age, password } = req.body;
            console.log("Registrando usuario:");
            console.log(req.body);

            const exists = await userService.findByUsername(email);
            if (exists) {
                return res.status(400).send({ status: "error", message: "Usuario ya existe." });
            }
            const user = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            };
            const result = await userService.save(user);
            res.status(201).send({ status: "success", message: "Usuario creado con extito con ID: " + result.id });
        });

function callback1 (req,res,next){
        console.log('principal 1')
        next()
    }
    
    async function callback2(req,res){
        try {
            let user = req.user;
            console.log(user)
            console.log('principal 2')
        return res.status(201).render("menuprincipal", {user})
    } catch (error) {
        
    }
}

    }
};