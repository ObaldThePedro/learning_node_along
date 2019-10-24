const Cart = require("../models/cart");
const db = require("../util/database");

module.exports = class Product {
  constructor(id, title, image, description, price) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, image, description, price) VALUES (?,?,?,?)",
      [this.title, this.image, this.description, this.price]
    );
  }

  static delete(id) {}

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
