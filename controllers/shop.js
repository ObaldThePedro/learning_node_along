const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Index",
      path: "/products",
      hasProducts: products.length > 0
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.fetchCartProducts(cart => {
    const cartProducts = [];
    Product.fetchAll(products => {
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            quantity: cartProductData.quantity
          });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        prods: cartProducts,
        totalPrice: cart.totalPrice
      });
      console.log(cartProducts);
    });
  });
};

exports.postDeleteCartItem = (req, res, next) => {
  console.log("hELLO");
  const prodId = req.body.id;
  const product = Product.findById(prodId, product => {
    console.log(product);
    const productPrice = product.price;
    Cart.deleteProduct(prodId, productPrice);
  });
  res.redirect("/cart");
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productID;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });

  res.redirect("/cart");
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout"
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Orders"
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.id;
  Product.findById(prodId, product => {
    res.render("shop/product-details", { product });
  });
};
