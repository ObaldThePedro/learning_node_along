const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

router.get("/products", adminController.getAdminProducts);

// /admin/add-product => POST
router.post("/add-product", adminController.postProduct);

router.get("/edit-product/:id", adminController.getEditProduct);

router.post("/edit-product/edit-product", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
