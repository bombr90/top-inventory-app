const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Item = require("../models/item");
const Category = require("../models/category");

const category_detail = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name description stock").exec(),
  ]);
  if(category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  res.render("category_detail", {
    title: "Category Detail",
    category,
    itemsInCategory, 
  })
});

const category_list = asyncHandler(async (req, res, next) => {
  const categoryList = await Category.find().sort({ name: 1 }).exec();
  
  res.render("category_list", {
    title: "Category List",
    categoryList,
  });
});

const category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});

const category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      const categoryExists = await Category.findOne({ name: req.body.name }).exec();
      if (categoryExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(category.url);
      }
    }
  }),
];


const category_delete_get = asyncHandler(async (req, res, next) => {
 const [category, categoryItems] = await Promise.all([
   Category.findById(req.params.id).exec(),
   Item.find({ category: req.params.id }, "name description").exec(),
 ]);
 if (category === null) {
   // No results.
   res.redirect("/inventory/categories");
 }

 res.render("category_delete", {
   title: "Delete Category",
   category,
   categoryItems,
 });  
});

const category_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of Category and all its items (in parallel)
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name description").exec(),
  ]);

  if (categoryItems.length > 0) {
    // Category has items. Render in same way as for GET route.
    res.render("category_delete", {
      title: "Delete Category",
      category,
      categoryItems
    });
    return;
  } else {
    // Category has no items. Delete object and redirect to the list of category.
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect("/inventory/categories");
  }
});

const category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  if(category === null){
    const err = new Error("Category not found");
    err.status=404;
    return next(err);
  }

  res.render("category_form", { 
    title: "Update Category",
    category,
  });
});

const category_update_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const category = new Category({ 
      name: req.body.name,
      _id: req.params.id, 
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      //Update category and redirect
        await Category.findByIdAndUpdate(req.params.id, category);
        res.redirect(category.url);
    }
  }),
];

module.exports = {
  category_detail,
  category_list,
  category_create_get,
  category_create_post,
  category_delete_get,
  category_delete_post,
  category_update_get,
  category_update_post,
};
