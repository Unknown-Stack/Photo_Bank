const { Router } = require("express");
const Order = require("../models/order");
const auth = require("../middleware/auth");
const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      "user.userId": req.user.id,
    })
      .lean()
      .populate("user.userId");
    res.render("orders", {
      isOrder: true,
      title: "Заказы",
      orders: orders.map((o) => {
        return {
          id: o._id,
          date: o.date,
          user: o.user,
          photo: o.photo,
          price: o.photo.reduce((total, c) => {
            return (total += c.count * c.photo_id.price);
          }, 0),
        };
      }),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.photoId").execPopulate();
    console.log(user);

    const photo = user.cart.items.map((i) => ({
      count: i.count,
      photo_id: { ...i.photoId._doc },
    }));
    console.log(photo);

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      photo: photo,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
