const { Router } = require("express");
const Card = require("../models/card");
const Photo = require("../models/photo");

const router = Router();

router.post("/add", async (req, res) => {
  const photo_id = await Photo.getById(req.body.id);
  await Card.add(photo_id);
  res.redirect("/card");
});

router.get("/", async (req, res) => {
  const card = await Card.fetch();
  res.render("card", {
    title: "Корзина",
    isCard: true,
    photo: card.photo,
    price: card.price,
  });
});

router.delete("/remove/:id", async (req, res) => {
  const card = await Card.remove(req.params.id);
  res.status(200).json(card);
});
module.exports = router;
