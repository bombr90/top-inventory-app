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

const item_create_post = asyncHandler(async (req, res, next) => {
  res.send("item_create_post not implemented");
});

const item_delete_get = asyncHandler(async (req, res, next) => {
  res.send("item_delete_get not implemented");
});

const item_delete_post = asyncHandler(async (req, res, next) => {
  res.send("item_delete_post not implemented");
});

const item_update_get = asyncHandler(async (req, res, next) => {
  res.send("item_update_get not implemented");
});

const item_update_post = asyncHandler(async (req, res, next) => {
  res.send("item_update_post not implemented");
});

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