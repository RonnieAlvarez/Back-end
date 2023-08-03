import { Router } from "express";
import { passportCall, authorization } from "../../../utils.js";
import __dirname from "../../../utils.js";
import bcrypt from "bcrypt";
import { forgot_password, reset_password, postResetPassword, toggleRoll } from "../controllers/user.controller.js";
import userModel from "../models/ecommerce.model.js";
import multer from "multer";

const router = Router();
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `${__dirname}/src/public/uploads`);
//   },
//   filename: (req, file, cb) => {
//     // Genere un nombre de archivo único para el archivo
//     //cb(null, `${file.originalname}-${Date.now()}.${file.mimetype}`);
//     //cb(null, file.originalname);
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const uploader = multer({
//   storage,
//   onError: function (err, next) {
//     console.log(err);
//     next();
//   },
// });
const uploader = multer({
  // Define qué archivos se pueden cargar
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["text/plain", "image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed types are text/plain, image/jpeg, image/jpg, and image/png."));
    }
  },

  storage: multer.diskStorage({
    destination: `${__dirname}/public/uploads`,
    filename: (req, file, cb) => {
      // Genera un nombre aleatorio para el archivo
      const filename = `${Date.now()}-${file.originalname}`;

      cb(null, filename);
    },
  }),
});

router.get("/favicon.ico", (req, res) => {
  res.sendFile("favicon.ico");
});
router.get("/", passportCall("jwt"), authorization(["USER", "ADMIN", "PREMIUM"]), async (req, res) => {
  res.render("menuprincipal", { user: req.user });
});
router.get("/login", async (req, res) => {
  res.render("login");
});
router.get("/forgot", async (req, res) => {
  res.render("forgot");
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/gitregister", (req, res) => {
  res.render("gitRegister");
});
router.get("/profile", passportCall("jwt"), authorization(["USER", "ADMIN", "PREMIUN"]), (req, res) => {
  res.render("profile", { user: req.user });
});
router.get("/premium/:email", toggleRoll);

router.post("/premium/:email/documents", uploader.array("files"), (req, res, next) => {
  if (!req.files) {
    return res.status(400).send({ status: "error", mensaje: "No se adjunto archivo." });
  }
  console.log(req.files);
  const file = req.files;
  //  file.save();
  res.send("Archivo cargado con éxito!");
});

/* This code defines a route for logging out a user. When the user accesses this route, the
`req.session` object is destroyed, which effectively logs the user out. If there is an error
destroying the session, the error is returned as a JSON response. If the session is successfully
destroyed, the `session-id` cookie is cleared and the user is redirected to the login page with a
status code of 201. */
router.get("/logout", async (req, res) => {
  try {
    user = await userModel.findOneAndUpdate({ email: req.user.email }, { $set: { last_connection: new Date() } });
    let randomNumberToAppend = Math.floor(Math.random() * 1000 + 1).toString();
    let randomIndex = Math.floor(Math.random() * 10 + 1);
    let hashedRandomNumberToAppend = await bcrypt.hash(randomNumberToAppend, 10);
    req.token = req.token + hashedRandomNumberToAppend;
    req.session.user = " ";
    res.clearCookie("jwtCookieToken");
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).render("nopage", { messagedanger: `${error.message}` });
      }
      res.clearCookie("session-id");
      return res.redirect("/users/login");
    });
  } catch (error) {
    return res.status(500).render("nopage", { messagedanger: `${error.message}` });
  }
});
router.post("/forgot-password", forgot_password);
router.get("/reset-password/:token", reset_password);
router.post("/postResetPassword/:token", postResetPassword);

/* The code snippet is configuring the storage options for multer, a middleware for handling file
uploads in Node.js. */

export default router;
