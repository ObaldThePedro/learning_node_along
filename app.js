const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const notFoundController = require("./controllers/pagenotfound");
const app = express();
const sequelize = require("./util/database");

app.set("view engine", "pug");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(notFoundController.notFound);

sequelize
  .sync()
  .then(result => {
    app.listen(2000);
  })
  .catch(error => {
    console.log(error);
  });
