const { Router } = require("express");
const router = Router();
const Photo = require("../models/photo");

router.get("/", async (req, res) => {
  const photoes = await Photo.getAll();
  res.status(200);
  res.render("photo", {
    title: "Банк фото",
    isPhoto: true,
    photoes,
  });
});

router.get("/:id", async (req, res) => {
  res.status(200);
  const photo_id = await Photo.getById(req.params.id);
  res.render("photo_id", {
    layout: "photo_id",
    title: `Фото ${photo_id.title}`,
    photo_id,
  });
});

router.get("/:id/edit", async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  const photo_id = await Photo.getById(req.params.id);
  res.render("photo_id-edit", {
    title: `Редактировать ${photo_id.title}`,
    photo_id,
  });
});

router.post("/edit", async (req, res) => {
  await Photo.update(req.body);
  res.redirect("/photo");
});
module.exports = router;
