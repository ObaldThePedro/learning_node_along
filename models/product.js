const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Product", productSchema);

// const getDb = require("../util/database").getDB;
// const mongoDb = require("mongodb");
// class Product {
//   constructor(title, price, description, image, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.image = image;
//     this._id = id ? mongoDb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp
//       .then(result => console.log(result))
//       .catch(error => console.log(error));
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then(products => {
//         return products;
//       })
//       .catch(error => console.log(error));
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: mongoDb.ObjectId(prodId) })
//       .next()
//       .then(product => {
//         console.log(product);
//         return product;
//       })
//       .catch(error => console.log(error));
//   }

//   static deleteById(prodId) {
//     const db = getDb();

//     db.collection("users")
//       .find()
//       .toArray()
//       .then(users =>
//         users.map(user => {
//           let updatedCart = user.cart.items.filter(
//             item => item.productId.toString() !== prodId.toString()
//           );
//           return db
//             .collection("users")
//             .updateOne(
//               { _id: mongoDb.ObjectId(user._id) },
//               { $set: { cart: { items: updatedCart } } }
//             );
//         })
//       );

//     return db
//       .collection("products")
//       .deleteOne({ _id: mongoDb.ObjectId(prodId) });
//   }
// }
// module.exports = Product;
