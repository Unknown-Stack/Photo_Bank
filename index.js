// Подключаем модули для работы
const express = require("express");
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);

// Роуты
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const photoRoutes = require("./routes/photo");
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");

const MONGODB_URI =
  "mongodb+srv://iknownstack:78984567@cluster0.asvud.mongodb.net/photoBank";

const User = require("./models/user");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");

// Экспресс
const app = express();

// Настройка для handlebar
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: require("./utils/hbs-helper"),
});

const store = new MongoStore({
  collection: "sessions",
  uri: MONGODB_URI,
});

// Настройка движка, расширения, папки, папки
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "some secret value",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById("603d431873f7d3404c2d3bf2");
//     req.user = user;
//     next();
//   } catch (e) {
//     console.log(e);
//   }
// });

// Роутинг
app.use("/", homeRoutes);
app.use("/photo", photoRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    // const candidate = await User.findOne();
    // if (!candidate) {
    //   const user = new User({
    //     email: "sdanilh@yandex.ru",
    //     name: "Danil",
    //     cart: { items: [] },
    //   });
    //   await user.save();
    // }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
