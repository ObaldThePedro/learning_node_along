const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
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
  Product.findAll()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
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
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(cartProducts => {
          cartProducts.map(product => (totalPrice += product.price));
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Cart",
            prods: cartProducts,
            totalPrice: totalPrice
          });
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
};

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.body.id;
  req.user
    .getCart()
    .then(cart => cart.getProducts({ where: { id: prodId } }))
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => res.redirect("/cart"))
    .catch(error => console.log(error));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(error => console.log(error));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => res.redirect("/orders"))
    .catch(error => console.log(error));
};

exports.postCart = (req, res, next) => {
  let fetchedCart;
  let newQuantity = 1;
  const prodId = req.body.productID;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        let oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => res.redirect("/cart"))
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout"
  });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
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
  Product.findAll({
    where: {
      id: prodId
    }
  })
    .then(products => {
      res.render("shop/product-details", { product: products[0] });
    })
    .catch(error => console.log(error));
  //alternative to find by ID, which can be simpler, however with findAll there is more control over the query.
  // Product.findByPk(prodId)
  //   .then(product => {
  //     res.render("shop/product-details", { product: product });
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });
};
