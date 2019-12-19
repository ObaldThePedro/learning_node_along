const mongoDb = require("mongodb");

const Product = require("../models/product");

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

  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedDescription,
    updatedImage,
    prodId
  )
    .save()
    .then(result => {
      "Updated product!";
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll()
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

  const product = new Product(
    title,
    price,
    description,
    image,
    null,
    req.user._id
  );
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
  const prodId = req.body.id;
  Product.deleteById(prodId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(error => console.log(error));
};
