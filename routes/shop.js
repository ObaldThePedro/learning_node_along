const express = require("express");
const shopController = require("../controllers/shop");
const router = express.Router();

router.get("/", shopController.getProducts);

router.get("/products", shopController.getIndex);

router.get("/cart", shopController.getCart);

router.post("/cart/delete-item", shopController.postDeleteCartItem);

router.post("/cart", shopController.postCart);

// router.get("/checkout", shopController.getCheckout);

// router.get("/orders", shopController.getOrders);

router.get("/product-details/:id", shopController.getProduct);

// router.post("/createOrder", shopController.postOrder);

module.exports = router;
