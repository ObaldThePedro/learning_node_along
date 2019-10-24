const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      console.log(rows);
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
        hasProducts: rows.length > 0,
        activeShop: true,
        productCSS: true
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Index",
        path: "/products",
        hasProducts: rows.length > 0
      });
    })
    .catch(err => console.log(err));
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
    Cart.deleteProduct(prodId, product.price);
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
  Product.findById(prodId)
    .then(([product]) => {
      res.render("shop/product-details", { product: product[0] });
    })
    .catch(error => console.log(error));
};
