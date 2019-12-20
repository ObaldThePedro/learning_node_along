const mongoDb = require("mongodb");

const Product = require("../models/product");
const User = require("../models/user");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.id;
  if (!editMode) {
    return res.redirect("/");
  }
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.id;
  const updatedTitle = req.body.title;
  const updatedImage = req.body.image;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.image = updatedImage;
      product.description = updatedDescription;
      product.price = updatedPrice;
      return product.save();
    })
    .then(result => {
      "Updated product!";
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.getAdminProducts = (req, res, next) => {
  Product.find()
    //useful methods to retrieve manipulated data,or fields that we might want, or not want
    // .select("title price -_id")
    // .populate("userId", "name")
    .then(products => {
      res.render("admin/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/admin/products",
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.postProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.body.image;
  const description = req.body.description;
  const price = req.body.price;

  const product = new Product({
    title: title,
    image: image,
    description: description,
    price: price,
    userId: req.user
  });

  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(error => {
      console.log(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  let cart;
  const prodId = req.body.id;
  User.find().then(users =>
    users.map(user => {
      cart = user.cart.items.filter(item => {
        return item.productId.toString() !== prodId.toString();
      });
      user.cart.items = cart;
      user.save();
    })
  );
  return Product.findByIdAndDelete(prodId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(error => console.log(error));
};
