const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const notFoundController = require("./controllers/pagenotfound");
const app = express();
const mongoose = require("mongoose");

const User = require("./models/user");

app.set("view engine", "pug");
app.set("views", "views");

app.use((req, res, next) => {
  User.findById("5dfc0f8eb1e7c71dd86a3ff1")
    .then(user => {
      req.user = user;
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

mongoose
  .connect(
    "mongodb+srv://pedro:ZyiN799zGEwtq92W@cluster0-bm6fr.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          username: "Pedro",
          email: "pedro.loureiro7@hotmail.com",
          cart: {
            items: []
          }
        });
        user.save();
      }
    });

    app.listen(3030);
  })
  .catch(error => console.log(error));
