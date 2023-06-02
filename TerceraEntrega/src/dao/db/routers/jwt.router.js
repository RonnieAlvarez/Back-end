import { Router } from "express";
import userModel from "../models/ecommerce.model.js";
import { isValidPassword } from "../../../utils.js";
import { generateJWToken } from "../../../utils.js";
import config from "../../../config/config.js"

const router = Router();

/* This code defines a route for handling a POST request to "/current". It expects the request body to
contain an email and password. It then tries to find a user in the database with the given email. If
the user is not found, it returns a 401 error with a message indicating that the user was not found.
If the user is found, it checks if the password is valid using the `isValidPassword` function (which
is not shown in this code snippet). If the password is not valid, it returns a 401 error with a
message indicating that the credentials are invalid. If the password is valid, it generates a JWT
token containing the user's name, email, age, and roll, and sets it as a cookie with the name
"jwtCookieToken". It then sends a response with a message indicating that the login was successful.
If there is an error during this process, it returns a 500 error with a message indicating that
there was an internal error. */
router.post("/current", async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await userModel.findOne({ email: email });
        if (!user) {
            if (email === config.adminName && password === config.adminPassword) {
                user = {
                    first_name: "Admin",
                    last_name: "CoderHouse",
                    email: email,
                    age: 21,
                    roll: "ADMIN"
                }} else {
                    console.warn("User doesn't exists with username: " + email);
                    return res
                    .status(401)
                    .send({
                        error: "Not found",
                        message: "User not found: " + email,
                    });
                }
        }
        if (!isValidPassword) {
            console.warn("Invalid credentials for user: " + email);
            return res
                .status(401)
                .send({ status: "error", error: "Invalid credentials!" });
        }
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            roll: user.roll,
        }
        const access_token = generateJWToken(tokenUser);
        //res.set('Authorization',`Bearer ${access_token}`);
        res.cookie("jwtCookieToken", access_token, {
            maxAge: 60000,
            // httpOnly: false // expone la cookie
            httpOnly: true, // No expone la cookie debe ir en true
        });
        res.send({ message: "Login successful!" });

    } catch (error) {
        return res
            .status(500)
            .send({ status: "error", error: "Internal Error!" });
    }
});

export default router;
