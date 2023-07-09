import * as UserService from "../services/users.service.js";
import { UserModel } from "../models/ecommerce.model.js";
import config from "../../../config/config.js";
import nodemailer from "nodemailer";

import bcrypt from "bcrypt";

export async function forgot_password(req, res) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    ca: null,
    secure: false,
    auth: {
      user: config.GOOGLE_CLIENT_EMAIL,
      pass: config.GOOGLE_CLIENT_SECRET,
    },
  });
  transport.verify(function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to send emails");
    }
  });

  const { email } = req.body;

  // Verificar si el usuario existe en la base de datos
  const user = await UserModel.findOne({ email });
  //console.log(user);
  if (!user) {
    return res.status(404).send("Usuario no encontrado");
  }

  // Generar un token único para el restablecimiento de contraseña
  const token = Math.random().toString(36).substring(2) + Date.now();

  // Guardar el token en la base de datos junto con la fecha de expiración
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  //await UserService.save1({ user });

  await user.save();

  const url = `${req.protocol}://${req.hostname}:${config.port}/users/reset-password/${token}`;
  // Enviar el correo electrónico con el enlace de restablecimiento de contraseña
  const mailOptions = {
    from: "eCommerce shop 🛒 " + config.GOOGLE_CLIENT_EMAIL,
    to: email,
    subject: "Reset Password",
    text: `To Reser your Password , click the link: ` + url,
  };

  const sendMail = async () => {
    await transport.sendMail(mailOptions);
  };

  sendMail();
  // window.close();
  res.send("Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña");
}

export async function reset_password(req, res) {
  const { token } = req.params;

  // Buscar al usuario en la base de datos por el token de restablecimiento de contraseña
  const user = await UserModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) {
    return res.status(400).send("Enlace de restablecimiento de contraseña inválido o expirado");
  }

  // Mostrar el formulario para ingresar la nueva contraseña
  res.send(`
    <form action="/users/postResetPassword/${token}" method="post">
      <input type="password" name="password" placeholder="Nueva contraseña" required>
      <input type="submit" value="Restablecer contraseña">
    </form>
  `);
  // window.close();
  res.status(401).redirect("/users/login");
}

// Ruta para guardar la nueva contraseña
export async function postResetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  // Buscar al usuario en la base de datos por el token de restablecimiento de contraseña
  const user = await UserModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) {
    return res.status(400).send("Enlace de restablecimiento de contraseña inválido o expirado");
  }

  // Hashear la nueva contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Actualizar la contraseña del usuario en la base de datos
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.status(401).redirect("/users/login");
  //res.send("Contraseña restablecida exitosamente");
}
