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

module.exports = router;
