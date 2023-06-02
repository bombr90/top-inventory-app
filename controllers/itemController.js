const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Item = require("../models/item");
const Category = require("../models/category");

const index = asyncHandler(async(req,res,next) => {
  const [
    itemCount,
    categoryCount
  ] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ])
  res.render('index', {
    title: "Inventory App Home",
    item_count: itemCount,
    category_count: categoryCount,
  })
})

const item_detail = asyncHandler(async(req,res,next)=>{
  const item = await Item.findById(req.params.id).populate("category").exec();

  if(item===null){
    const err = new Error("Item not found");
    err.status= 404;
    return next(err);
  }
  res.render("item_detail", {
    title: item.name,
    item,
  })
})

const item_list = asyncHandler(async (req, res, next) => {
  const itemList = await Item.find().sort({ name: 1 }).exec();
  res.render("item_list", {
    title: "Item List",
    itemList,
  });
});

const item_create_get = asyncHandler(async (req, res, next) => {
  const categoryList = await Category.find().sort({name:1}).exec();
  res.render("item_form", {
    title: 'Create Item',
    categoryList,
  })
});

const item_create_post = [
  // Convert the category to an array.
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },
  // Validate and sanitize client provided fields.
  body("name", "Item name must contain between 3 and 64 characters")
    .trim()
    .isLength({ min: 3, max: 64 })
    .escape(),
  body(
    "description",
    "Item description must contain between 3 and 128 characters"
  )
    .trim()
    .isLength({ min: 3, max: 64 })
    .escape(),
  body("category.*").escape(),
  body("unitPrice", "Item unit price must be greater than 0.01")
    .trim()
    .isFloat({ min: 0.01 })
    .isDecimal({ format: "0.01" })
    .escape(),
  body("unit", "Item unit must be valid").trim().notEmpty().escape(),
  body("unitCount", "Item unit count must be greater than 0")
    .trim()
    .isInt({ min: 1, gt: 0 })
    .escape(),
  body("stock", "Quantity of stock must be greater than 0")
    .trim()
    .isInt({ min: 1, gt: 0 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      unitPrice: req.body.unitPrice,
      unit: req.body.unit,
      unitCount: req.body.unitCount,
      stock: req.body.stock,
      discount: 0,
      updated: Date.now(),
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      //Get all categories
      const categoryList = await Category.find().sort({ name: 1 }).exec();
      //Mark selected categories as checked
      for(const category of categoryList) {
        if (item.category.indexOf(category._id) > -1) {
          category.checked = "true";
        }
      }
      res.render("item_form", {
        title: "Create Item",
        categoryList,
        item,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      const itemExists = await Item.findOne({
        name: req.body.name,
      }).exec();
      if (itemExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(itemExists.url);
      } else {
        await item.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(item.url);
      }
    }
  }),
];

const item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  if (item === null) {
    // No results.
    res.redirect("/inventory/items");
  }
  res.render("item_delete", {
    title: "Delete Item",
    item,
  });  
});

const item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndRemove(req.body.itemid);
  res.redirect("/inventory/items");
});

const item_update_get = asyncHandler(async (req, res, next) => {
  const [item, categoryList] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find().exec(),
  ]);
  console.log(item.category);
  //Mark selected categories as checked
  for (const category of categoryList) {
    if (item.category.indexOf(category._id) > -1) {
      category.checked = "true";
    }
  }
  if (item === null) {
    // No results.
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  res.render("item_form", {
    title: "Update Item",
    item,
    categoryList,
  });
});

const item_update_post = [
  // Convert the category to an array.
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },
  // Validate and sanitize client provided fields.
  body("name", "Item name must contain between 3 and 64 characters")
    .trim()
    .isLength({ min: 3, max: 64 })
    .escape(),
  body(
    "description",
    "Item description must contain between 3 and 128 characters"
  )
    .trim()
    .isLength({ min: 3, max: 128 })
    .escape(),
  body("category.*").escape(),
  body("unitPrice", "Item unit price must be greater than 0.01")
    .trim()
    .isFloat({ min: 0.01 })
    .isDecimal({ format: "0.01" })
    .escape(),
  body("unit", "Item unit must be valid").trim().notEmpty().escape(),
  body("unitCount", "Item unit count must be greater than 0")
    .trim()
    .isInt({ min: 1, gt: 0 })
    .escape(),
  body("stock", "Quantity of stock must be greater than 0")
    .trim()
    .isInt({ min: 1, gt: 0 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a item object with escaped and trimmed data.
    const item = new Item({
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      unitPrice: req.body.unitPrice,
      unit: req.body.unit,
      unitCount: req.body.unitCount,
      stock: req.body.stock,
      discount: 0,
      updated: Date.now(),
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      //Get all categories
      const categoryList = await Category.find().sort({ name: 1 }).exec();
      //Mark selected categories as checked
      for (const category of categoryList) {
        if (item.category.indexOf(category._id) > -1) {
          category.checked = "true";
        }
      }
      res.render("item_form", {
        title: "Update Item",
        categoryList,
        item,
        errors: errors.array(),
      });
      return;
    } else {
        await Item.findByIdAndUpdate(req.params.id, item);
        res.redirect(item.url);
    }
  }),
];

module.exports = {
  index,
  item_detail,
  item_list,
  item_create_get,
  item_create_post,
  item_delete_get,
  item_delete_post,
  item_update_get,
  item_update_post
}