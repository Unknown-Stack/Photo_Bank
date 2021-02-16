const { Router } = require("express");
const Photo = require("../models/photo");
const router = Router();

router.get("/", (req, res) => {
  res.status(200);
  res.render("add", {
    title: "Добавить свое фото в банк",
    isAdd: true,
  });
});

router.post("/", async (req, res) => {
  const photo = new Photo(
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.img
  );
  await photo.save();
  res.redirect("/photo");
});
module.exports = router;
