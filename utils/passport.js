const fs = require("fs/promises");
const passport = require("passport");
const logger = require("./logger");
const { Strategy: LocalStrategy } = require("passport-local");
const User = require("../models/userModel");
const { isValidPassword, encryptPassword } = require("./password");
const mailer = require("./mailer");

passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        logger.warn("Error en login");
        return done(err);
      }

      if (!user) {
        logger.info(`No se encontró el usuario ${username}`);
        return done(null, false, {
          message: `No se encontro el usuario ${username}`,
        });
      }

      if (!isValidPassword(user, password)) {
        logger.info(
          `Intento de ingreso usuario ${username}, contraseña incorrecta`
        );
        return done(null, false, { message: "Contraseña incorrecta" });
      }

      return done(null, user);
    });
  })
);

passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      User.findOne({ username }, async (err, user) => {
        if (err) {
          logger.warn("Error en signup");
          return done(err);
        }

        if (user) {
          logger.info(
            `Se intentó crear un usuario ya existente, se borrará su archivo de avatar`
          );
          await fs.unlink(`./public/avatars/${req.filename}`);
          return done(null, false, { message: "El usuario ya existe!" });
        }

        const newUser = {
          username,
          password: encryptPassword(password),
          name: req.body.name,
          age: req.body.age,
          address: req.body.address,
          cellphone: req.body.cellphone,
          avatar: `/public/avatars/${req.filename}`,
        };

        User.create(newUser, async (err, userWithId) => {
          if (err) {
            logger.info(`Error guardando el usuario ${newUser.username}`);
            await fs.unlink(`./public/avatars/${req.filename}`);
            return done(err);
          }

          mailer.mailOptions.attachments.push({
            path: `.${newUser.avatar}`,
            cid: "unique@avatar",
          });
          mailer.mailOptions.html = `
          <b>Se registró un nuevo usuario: </b>
          <br>
          <div>
            <p>Correo: ${newUser.username}</p>
          </div>
          <div style="display:flex;flex-flow:row wrap;gap:1rem;">
            <p>Nombre: ${newUser.name}</p>
            <p>Edad: ${newUser.age}</p>
          </div>
          <div style="display:flex;flex-flow:row wrap;gap:1rem;">
            <p>Dirección: ${newUser.address}</p>
            <p>Telefono: ${newUser.cellphone}</p>
          </div>
          <div class="text-center">
            <p>Avatar: </p>
            <img src="cid:unique@avatar" style="width: 125px; height: 125px; border-radius: 50%; border: 2px solid black;" />
          </div>
          `;

          mailer.transporter.sendMail(mailer.mailOptions, function (error, info) {
            if (error) {
              return logger.error(error);
            }

            logger.info(`Se envió un correo: ${info.response}`);
          });

          logger.info(`Se registró un nuevo usuario`);
          return done(null, userWithId);
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, done);
});

module.exports = passport;
