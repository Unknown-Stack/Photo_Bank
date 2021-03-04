const { Router } = require("express");
const Photo = require("../models/photo");
const auth = require("../middleware/auth");
const router = Router();

function mapCartItems(cart) {
  return cart.items.map((c) => ({
    ...c.photoId._doc,
    count: c.count,
  }));
}

function computePrice(photo) {
  return photo.reduce((total, photo) => {
    return (total += photo.price * photo.count);
  }, 0);
}

router.post("/add", auth, async (req, res) => {
  const photo_id = await Photo.findById(req.body.id);
  await req.user.addToCart(photo_id);
  res.redirect("/card");
});

router.get("/", auth, async (req, res) => {
  const user = await req.user.populate("cart.items.photoId").execPopulate();
  const photo = mapCartItems(user.cart);

  res.render("card", {
    title: "Корзина",
    isCard: true,
    photo: photo,
    price: computePrice(photo),
  });
});

router.delete("/remove/:id", auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate("cart.items.photoId").execPopulate();
  const photo = mapCartItems(user.cart);
  const cart = {
    photo: photo,
    price: computePrice(photo),
  };
  res.status(200).json(cart);
});

module.exports = router;
