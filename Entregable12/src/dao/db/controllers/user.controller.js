import * as UserService from "../services/users.service.js";
import { UserModel } from "../models/ecommerce.model.js";
import config from "../../../config/config.js";
import nodemailer from "nodemailer";
import { isValidPassword } from "../../../utils.js";

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
      res.status(400).render("nopage", { messagedanger: `${error.message}` });
    }
    // else {
    //   console.log("Server is ready to send emails");
    // }
  });

  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(400).render("nopage", { messagedanger: `User not found !!` });
  }
  const token = Math.random().toString(36).substring(2) + Date.now();
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  await user.save();
  const url = `${req.protocol}://${req.hostname}:${config.port}/users/reset-password/${token}`;
  const mailOptions = {
    from: "eCommerce shop 🛒 " + config.GOOGLE_CLIENT_EMAIL,
    to: email,
    subject: "Reset Password",
    //text: `To Reser your Password , click the link: ` + url,
    html: ` 
    <div style="background-color: #0DCAF0; height:200px; border: 2px solid darkgrey; border-radius: 30px; padding: 30px; text-align: center;">
      <h1>Reset Password</h1>
      <h3 style="font-weight: bold;margin-botton:20px;">To Reset your Password ,
       click the link <strong>below:</h3><br>
       <h2><a href='${url}'>RESET PASSWORD</a></strong></h2><br>
    </div>

    `,
  };
  const sendMail = async () => {
    await transport.sendMail(mailOptions);
  };
  sendMail();
  res.status(200).render("nopage", { messageSuccess: "We send you an email with the link to Reset the Password !!" });
}

export async function reset_password(req, res) {
  const { token } = req.params;
  const user = await UserModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) {
    res.status(400).render("nopage", { messagedanger: "Link to Reset the Password invalid or expired !!" });
    setTimeout(() => {
      try {
        res.status(401).redirect("/users/login");
      } catch (error) {
        res.status(400).render("nopage", { messagedanger: `${error.message}` });
      }
    }, 2000);
  }
  res.send(`
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DESAFIO Passport - GitHub</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    
</head>

<body class="bg-ligth">
    <div class="container my-1 d-flex flex-column sticky-top bg-dark p-2 rounded">
        <span class="d-sm-inline-flex text-center align-middle justify-content-center text-light fs-4 fw-bold opacity-75">
        Back-end Final Project </span>
    </div>
    
  <div id="login" class="container bg-info rounded mt-3 pb-2" style="width:500px">
    <h3 class="text-center text-white pb-2">My eCommerce App</h3>
    <div class="container border border-secondary rounded p-3 m-2">
        <form class="m-2" action="/users/postResetPassword/${token}" method="post">
          <input type="password" name="password" placeholder="Reset Password" required>
          <input type="submit" value="Restablecer contraseña">
          <p>minimum 8 long and minimum 4 letters</p>
        </form>
    </div>
  </div>
</body>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
    crossorigin="anonymous"></script>
</html>
  `);
}

// Ruta para guardar la nueva contraseña
export async function postResetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;
  const user = await UserModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) {
    return res.status(400).render("nopage", { messagedanger: `Link to Reset the Password invalid or expired !! ` });
    //    res.redirect("/users/forgot");
  }
  if (isValidPassword(user, password)) {
    return res.status(400).render("nopage", { messagedanger: "The Password could'nt be the same !!" });
  }
  if (!validarPassword(password)) {
    return res
      .status(400)
      .render("nopage", { messagedanger: "The password does not meet the requirements !! \n 8+ alphanum chars, 1+ num, and non-alphanum chars" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // Actualizar la contraseña del usuario en la base de datos
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.status(401).redirect("/users/login");
}

function validarPassword(password) {
  const regex = /^(?=.*[a-zA-Z]{4,})[a-zA-Z\d]{8,}$/;
  return regex.test(password);
}

export async function toggleRoll(req, res) {
  try {
    let { email } = req.params;
    email = email.slice(1, email.length);
    let user = await UserModel.findOne({ email: email });
    if (user) {
      if (user.roll === "PREMIUM") {
        user.roll = "USER";
      } else if (user.roll === "USER") {
        user.roll = "PREMIUM";
      }
      const actualizado = await user.save(user);
      if (actualizado) {
        return res.status(400).render("nopage", { messageSuccess: `User was Updated !! ` }).redirect("/users/logout");
      } else {
        return res.status(400).render("nopage", { messagedanger: `User not Updated !! ` });
      }
    }
  } catch (error) {
    res.status(400).render("nopage", { messagedanger: `${error.message}` });
  }
}
