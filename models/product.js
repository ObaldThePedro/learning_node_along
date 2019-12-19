const getDb = require("../util/database").getDB;
const mongoDb = require("mongodb");
class Product {
  constructor(title, price, description, image, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.image = image;
    this._id = id ? mongoDb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then(result => console.log(result))
      .catch(error => console.log(error));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(error => console.log(error));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: mongoDb.ObjectId(prodId) })
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(error => console.log(error));
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: mongoDb.ObjectId(prodId) })
      .then(result => console.log("Deleted"))
      .catch(error => console.log(error));
  }
}
module.exports = Product;
