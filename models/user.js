const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let updatedCartItems = [...this.cart.items];
  let newQuantity = 1;

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };

  this.cart = updatedCart;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const getDb = require("../util/database").getDB;
// const mongoDb = require("mongodb");

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   deleteCartProduct(productId) {
//     let updatedCartItems = [...this.cart.items];
//     const productToDeleteIndex = this.cart.items.findIndex(
//       item => item.productId.toString() === productId.toString()
//     );
//     if (updatedCartItems[productToDeleteIndex].quantity > 1) {
//       updatedCartItems[productToDeleteIndex].quantity =
//         updatedCartItems[productToDeleteIndex].quantity - 1;
//     } else {
//       updatedCartItems = updatedCartItems.filter(
//         product => product.productId.toString() !== productId.toString()
//       );
//       console.log(updatedCartItems);
//     }
//     const db = getDb();
//     return db.collection("users").updateOne(
//       {
//         _id: mongoDb.ObjectId(this._id)
//       },
//       { $set: { cart: { items: updatedCartItems } } }
//     );
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": mongoDb.ObjectId(this._id) })
//       .toArray();
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: mongoDb.ObjectId(this._id),
//             username: this.username,
//             email: this.email
//           }
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(result => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: mongoDb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(product => {
//       return product.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(product => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(item => {
//               return item.productId.toString() === product._id.toString();
//             }).quantity
//           };
//         });
//       });
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: mongoDb.ObjectId(userId) })
//       .then(user => {
//         return user;
//       })
//       .catch();
//   }
// }

// module.exports = User;
