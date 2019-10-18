const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Cart {
  static addProduct(id, productPrice) {
    //fetch the previous cart
    fs.readFile(p, (error, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!error) {
        cart = JSON.parse(fileContent);
      }
      //Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity = updatedProduct.quantity + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), error => {
        console.log(error);
      });
    });
  }

  static deleteProduct(id, price) {
    fs.readFile(p, (error, fileContent) => {
      if (!error) {
        const cart = JSON.parse(fileContent);
        const updatedCart = { ...cart };
        const product = updatedCart.products.find(prod => prod.id === id);
        if (product.quantity > 1) {
          product.quantity = product.quantity - 1;
        } else {
          updatedCart.products = updatedCart.products.filter(
            prod => prod.id !== id
          );
        }
        if (updatedCart.products.length === 0) {
          updatedCart.totalPrice = 0;
        } else {
          updatedCart.totalPrice =
            updatedCart.totalPrice - price * product.quantity;
        }

        fs.writeFile(p, JSON.stringify(updatedCart), error => {
          console.log(error);
        });
      }
    });
  }

  static fetchCartProducts(cb) {
    getProductsFromFile(cb);
  }
};
