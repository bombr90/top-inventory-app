const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Item = require("../models/item");
const Category = require("../models/category");

const category_detail = asyncHandler(async (req, res, next) => {
  res.send("category_detail not implemented");
});

const category_list = asyncHandler(async (req, res, next) => {
  res.send("category_list not implemented");
});

const category_create_get = asyncHandler(async (req, res, next) => {
  res.send("category_create_get not implemented");
});

const category_create_post = asyncHandler(async (req, res, next) => {
  res.send("category_create_post not implemented");
});

const category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("category_delete_get not implemented");
});

const category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("category_delete_post not implemented");
});

const category_update_get = asyncHandler(async (req, res, next) => {
  res.send("category_update_get not implemented");
});

const category_update_post = asyncHandler(async (req, res, next) => {
  res.send("category_update_post not implemented");
});

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
