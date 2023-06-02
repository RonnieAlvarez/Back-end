import { Router } from "express";
import { passportCall, authorization } from "../../../utils.js";
import bcrypt from "bcrypt";

const router = Router();

router.get('/favicon.ico',(req,res)=>{
    res.sendFile('favicon.ico')
})

router.get("/", passportCall("jwt"), authorization(["USER","ADMIN"]), async (req, res) => {
    res.render("menuprincipal", { user: req.user });
});

router.get("/login", async (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/gitregister", (req, res) => {
    res.render("gitRegister");
});

router.get("/profile", passportCall("jwt"), authorization(["USER","ADMIN"]), (req, res) => {
    res.render("profile", { user: req.user });
});

/* This code defines a route for logging out a user. When the user accesses this route, the
`req.session` object is destroyed, which effectively logs the user out. If there is an error
destroying the session, the error is returned as a JSON response. If the session is successfully
destroyed, the `session-id` cookie is cleared and the user is redirected to the login page with a
status code of 201. */
router.get("/logout", async (req, res) => {
    try {
        let randomNumberToAppend = Math.floor(Math.random() * 1000 + 1).toString();
        let randomIndex = Math.floor(Math.random() * 10 + 1);
        let hashedRandomNumberToAppend = await bcrypt.hash(randomNumberToAppend, 10);
        req.token = req.token + hashedRandomNumberToAppend;
        req.session.user = " ";
        res.clearCookie("jwtCookieToken");
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to destroy session" });
            }
            res.clearCookie("session-id");
            return res.redirect("/users/login");
        });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
