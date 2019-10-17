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
  Product.findById(productId, product => {
    if (!product) {
      return res.redirect("/");
    } else {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product
      });
    }
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.id;
  const updatedTitle = req.body.title;
  const updatedImage = req.body.image;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;
  const product = new Product(
    prodId,
    updatedTitle,
    updatedImage,
    updatedDescription,
    updatedPrice
  );
  product.save();
  res.redirect("/");
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("admin/product-list", {
      prods: products,
      path: "/admin/products",
      pageTitle: "Admin Products",
      hasProducts: products.length > 0
    });
  });
};

exports.postProduct = (req, res, next) => {
  const product = new Product(
    null,
    req.body.title,
    req.body.image,
    req.body.description,
    req.body.price
  );
  product.save();
  res.redirect("/");
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.id;
  Product.delete(prodId);
  res.redirect("/");
};
