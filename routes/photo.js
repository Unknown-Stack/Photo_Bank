const { Router } = require("express");
const router = Router();
const Photo = require("../models/photo");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const photoes = await Photo.find().populate("userId").lean();
  res.status(200);
  res.render("photo", {
    title: "Банк фото",
    isPhoto: true,
    photoes,
    userId: req.user ? req.user._id.toString() : null,
  });
});

router.get("/:id", async (req, res) => {
  res.status(200);
  const photo_id = await Photo.findById(req.params.id).lean();
  res.render("photo_id", {
    layout: "photo_id",
    title: `Фото ${photo_id.title}`,
    photo_id,
  });
});

router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  const photo_id = await Photo.findById(req.params.id).lean();
  if (photo_id.userId.toString() != req.user._id.toString()) {
    res.redirect("/photo");
  }
  res.render("photo_id-edit", {
    title: `Редактировать ${photo_id.title}`,
    photo_id,
  });
});

router.post("/edit", auth, async (req, res) => {
  await Photo.findByIdAndUpdate(req.body.id, req.body);
  res.redirect("/photo");
});

router.post("/remove", auth, async (req, res) => {
  try {
    await Photo.deleteOne({ _id: req.body.id });
    res.redirect("/photo");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
