const { Router } = require("express");
const Photo = require("../models/photo");
const auth = require("../middleware/auth");
const router = Router();

router.get("/", auth, (req, res) => {
  res.status(200);
  res.render("add", {
    title: "Добавить свое фото в банк",
    isAdd: true,
  });
});

router.post("/", auth, async (req, res) => {
  const photo = new Photo({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    img: req.body.img,
    userId: req.user,
  });

  try {
    await photo.save();
    res.redirect("/photo");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
