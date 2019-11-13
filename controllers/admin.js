const Product = require("../models/product");
const Cart = require("../models/cart");

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
  Product.findByPk(productId)
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
  const userId = req.user.id;
  Product.findByPk(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.image = updatedImage;
      product.description = updatedDescription;
      product.price = updatedPrice;
      product.userId = userId;
      return product.save();
    })
    .then(result => {
      "Updated product!";
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
  // Cart.fetchCartProducts(cart => {
  //   console.log(cart.products);
  //   if (cart.products.length > 0) {
  //     const cart_product = cart.products.find(p => p.id === prodId);
  //     cart_product.price = updatedPrice;
  //   }
  // });
  // product.save();
};

exports.getAdminProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render("admin/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
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
  req.user
    .createProduct({
      title: title,
      image: image,
      description: description,
      price: price
    })
    .then(result => {
      console.log("Product created");
      res.redirect("/admin/products");
    })
    .catch(error => {
      console.log(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.id;
  Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log("Product deleted");
      res.redirect("/");
    })
    .catch(error => console.log(error));
};
