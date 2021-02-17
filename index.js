// Подключаем модули для работы
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");

// Роуты
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const photoRoutes = require("./routes/photo");
const cardRoutes = require("./routes/card");

// Экспресс
const app = express();

// Настройка для handlebar
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

// Настройка движка, расширения, папки, папки
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Роутинг
app.use("/", homeRoutes);
app.use("/photo", photoRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);

// Старт сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
