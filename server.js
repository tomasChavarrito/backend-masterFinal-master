require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("./utils/passport");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const cluster = require("cluster");

//Firebase
if (process.env.STORAGE == "firebase") {
  const admin = require("firebase-admin");
  const serviceAccount = require("./config/ecommercecoderhouse-2f872-9d1109101c0e.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

//Mongo
mongoose.connect(
  `mongodb+srv://Frauseano:wANgPcp1nM05DXXP@frangfdbs.vnwag.mongodb.net/?retryWrites=true&w=majority`,
  () => logger.debug("Conectado a mongo")
);

//Middlewares
app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://Frauseano:wANgPcp1nM05DXXP@frangfdbs.vnwag.mongodb.net/?retryWrites=true&w=majority`,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: "qwerty",
    rolling: true,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 600 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Routers
const routerProductos = require("./routers/routerProductos");
const routerCarritos = require("./routers/routerCarritos");
const routerCuenta = require("./routers/routerCuenta");
app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarritos);
app.use("/api/cuenta", routerCuenta);
app.use((req, res, next) => {
  res.status(404).send({
    error: "-2",
    description: `route ${req.path} method ${req.method} not yet implemented`,
  });
});

if (cluster.isMaster && process.env.MODE === "CLUSTER") {
  for (let i = 0; i < require("os").cpus().length; i++) {
    cluster.fork();
  }
} else {
  const server = app.listen(process.env.PORT || 8080, () => {
    logger.debug("Listening on port 8080");
  });
}

app.on("error", console.error);
