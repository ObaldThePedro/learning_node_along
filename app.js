const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const notFoundController = require("./controllers/pagenotfound");
const app = express();
const MongoConnect = require("./util/database").MongoConnect;

const User = require("./models/user");

app.set("view engine", "pug");
app.set("views", "views");

app.use((req, res, next) => {
  User.findById("5dfac5f4812ad8056b23aa46")
    .then(user => {
      req.user = new User(user.username, user.email, user.cart, user._id);
      next();
    })
    .catch(error => console.log(error));
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(notFoundController.notFound);
MongoConnect(() => {
  app.listen(3000);
});
