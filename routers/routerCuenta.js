const { Router } = require("express");
const { rutaProtegida } = require("../middlewares");
const routerCuenta = Router();
const passport = require("../utils/passport");
const upload = require("../utils/upload");

module.exports = routerCuenta.post(
  "/login",
  passport.authenticate("login", { failureRedirect: `/api/cuenta/error?error="wrongCredentials"` }),
  (req, res) => {
    res.json({ success: true, clientId: req.user._id || req.user.id });
  }
);

routerCuenta.get('/verify', (req, res) => {
  if(req.isAuthenticated()){
    return res.json({ authentication: true });
  }

  return res.json({ authentication: false });
})

routerCuenta.get('/error', (req, res) => {
  const error = req.query.error;
  if(error){
    return res.json({ error })
  }

  return res.json({ error: "Unkown error" })
})

routerCuenta.get('/perfil', rutaProtegida(), (req, res) => {
    res.json(req.user);
})

routerCuenta.post(
  "/nuevo",
  upload.single("avatar"),
  passport.authenticate("signup", { failureRedirect: `/api/cuenta/error?error="wrongCredentials"` }),
  (req, res) => {
    res.json({ success: true });
  }
);

routerCuenta.get("/logout", rutaProtegida(), (req, res) => {
    req.logout({ keepSessionInfo: false }, () => {
        return res.json({ success: true });
    });
})
