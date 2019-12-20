const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/product-list", {
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

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  let totalPrice = 0;
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      console.log(user.cart.items);
      const products = user.cart.items;
      user.cart.items.map(
        product =>
          (totalPrice += parseInt(product.productId.price) * product.quantity)
      );
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        prods: products,
        totalPrice: totalPrice
      });
    })
    .catch(error => console.log(error));
};

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.body.id;
  return req.user
    .postDeleteCartItem(prodId)
    .then(() => res.redirect("/cart"))
    .catch(error => console.log(error));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(product => {
        return {
          quantity: product.quantity,
          product: { ...product.productId._doc }
        };
      });
      const order = new Order({
        user: {
          username: req.user.username,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => res.redirect("/orders"))
    .catch(error => console.log(error));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productID;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => res.redirect("/cart"))
    .catch(error => console.log(error));
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout"
//   });
// };

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      console.log(orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Orders",
        orders: orders
      });
    })
    .catch(error => console.log(error));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.id;

  Product.findById(prodId)
    .then(product => {
      res.render("shop/product-details", {
        product: product
      });
    })
    .catch(error => console.log(error));
};
