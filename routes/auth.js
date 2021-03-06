const { Router } = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const router = Router();

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Авторизация",
    isLogin: true,
    Rerror: req.flash("Rerror"),
    Lerror: req.flash("Lerror"),
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);
      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          } else {
            res.redirect("/");
          }
        });
      } else {
        req.flash("Lerror", "Неверный пароль");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("Lerror", "Такого пользователя не существует");
      res.redirect("/auth/login#login");
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, repeat, name } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      req.flash("Rerror", "Пользователь с таким email существует");
      res.redirect("/auth/login#register");
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: { items: [] },
      });
      await user.save();
      res.redirect("/auth/login#login");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
