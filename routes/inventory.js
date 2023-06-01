const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");

//////////////////
// ITEM ROUTES
//////////////////

//////////////////
// CREATE ROUTES
//////////////////
// GET inventory home page
router.get("/", item_controller.index);

// POST request to create Item.
router.post('/item/create', item_controller.item_create_post);

//////////////////
// READ ROUTES
//////////////////

// GET inventory home page
router.get('/', item_controller.index);

// GET request for list of all items
router.get('/items', item_controller.item_list);

// GET request to create Item.
router.get('/item/create', item_controller.item_create_get);

// GET request Item details.
router.get('/item/:id', item_controller.item_detail);

// GET request to update Item
router.get('/item/:id/update', item_controller.item_update_get);

// GET request to delete Item
router.get('/item/:id/delete', item_controller.item_delete_get);

//////////////////
// UPDATE ROUTES
//////////////////

// POST request to update Item
router.post('/item/:id/update', item_controller.item_update_post);

//////////////////
// DELETE ROUTES
//////////////////

// POST request to delete Item
router.post('/item/:id/delete', item_controller.item_delete_post);

//////////////////
// CATEGORY ROUTES
//////////////////

//////////////////
// CREATE ROUTES
//////////////////

// POST request to create Category.
router.post('/category/create', category_controller.category_create_post);

//////////////////
// READ ROUTES
//////////////////

// GET request for list of all categories
router.get("/categories", category_controller.category_list);

// GET request to create Category.
router.get("/category/create", category_controller.category_create_get);

// GET request Category details.
router.get("/category/:id", category_controller.category_detail);

// GET request to update Category
router.get("/category/:id/update", category_controller.category_update_get);

// GET request to delete Category
router.get("/category/:id/delete", category_controller.category_delete_get);

//////////////////
// UPDATE ROUTES
//////////////////

// POST request to update Category
router.post("/category/:id/update", category_controller.category_update_post);

//////////////////
// DELETE ROUTES
//////////////////

// POST request to delete Category
router.post("/category/:id/delete", category_controller.category_delete_post);

module.exports = router;