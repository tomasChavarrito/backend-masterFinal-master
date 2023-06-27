const mailer = require("./mailer");
const twilio = require("twilio");

exports.enviarMensajes = async (cart, user) => {
  try {
    const productList = cart.products
      .map((p) => `<li>Nombre: ${p.name} | Precio: ${p.price}</li>`)
      .join("\n");

    mailer.mailOptions.html = `
    <b>Nuevo pedido de: ${user.name}</b>
    <br>
    <ol>
      ${productList}
    </ol>
    <b>Total: ${cart.products.reduce((a, p) => a + p.price * 1, 0)}</b>
    `;

    mailer.transporter.sendMail(mailer.mailOptions, function (error, info) {
      if (error) {
        return logger.error(error);
      }

      logger.info(`Se envió un correo de pedido: ${info.response}`);
    });

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const sms = await client.messages.create({
      to: `+${user.cellphone}`,
      messagingServiceSid: 'MG88f0b1e5621c642581f51b7e95f9d1be',
      body: "Su pedido fue recibido y esta en proceso!"
    })

    logger.info(sms);

    const message = await client.messages.create({
      body: `Nuevo pedido de: ${user.name} - ${user.username}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.ADMIN_PHONE_NUMBER,
    });

    logger.info(message);

  } catch (err) {
    logger.error(err.message);
  }
};
