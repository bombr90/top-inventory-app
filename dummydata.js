#! /usr/bin/env node

console.log(
  'This script populates some test items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(name) {
  const category = new Category({ name: name });
  await category.save();
  categories.push(category);
  console.log(`Added category: ${name}`);
}

async function itemCreate({
  name,
  description,
  category,
  unitPrice,
  discount,
  stock,
  unit,
  unitCount,
}) {
  const itemdetail = {
    name: name,
    description: description,
    category: category,
    unitPrice: unitPrice,
    discount: discount,
    stock: stock,
    unit: unit,
    unitCount: unitCount,
  };
  const item = new Item(itemdetail);
  await item.save();
  items.push(item);
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate("Meat"),
    categoryCreate("Seafood"),
    categoryCreate("Fruit"),
    categoryCreate("Vegetable"),
    categoryCreate("Non-Perishable"),
    categoryCreate("Special"),
    categoryCreate("Clearance"),
    categoryCreate("Test"),
  ]);
}

async function createItems() {
  console.log("Adding Items");
  await Promise.all([
    itemCreate({
      name: "White Jasmine Rice",
      description: "Premium long-grain Jasmine rice from Thailand.",
      category: [categories[4], categories[5]],
      unitPrice: 3.12375,
      discount: 0.1,
      stock: 20,
      unit: "kg",
      unitCount: 8,
    }),
    itemCreate({
      name: "Bleached All-Purpose Flour",
      description: "Refined and enriched flour from Canadian four-row wheat.",
      category: [categories[4]],
      unitPrice: 0.999,
      discount: 0,
      stock: 99,
      unit: "kg",
      unitCount: 10,
    }),
    itemCreate({
      name: "All natural organic peanut butter (chunky)",
      description:
        "100% peanut, peanut butter made from premium roasted nuts. No additives or preservatives added.",
      category: [categories[4], categories[5]],
      unitPrice: 0.561875,
      discount: 0.5,
      stock: 12,
      unit: "oz",
      unitCount: 16,
    }),
    itemCreate({
      name: "Iceberg lettuce",
      description: "Locally sourced iceberg head lettuce.",
      category: [categories[3]],
      unitPrice: 2.99,
      discount: 0,
      stock: 40,
      unit: "piece",
      unitCount: 1,
    }),
    itemCreate({
      name: "Atlantic Lobster (live)",
      description: "Live atlantic lobster (~3lb).",
      category: [categories[1], categories[5]],
      unitPrice: 18.375,
      discount: 0,
      stock: 23,
      unit: "kg",
      unitCount: 1.36,
    }),
    itemCreate({
      name: "Grade AAA Ribeye Steak",
      description: "Party pack of four premium rib-eye steaks (~3lb).",
      category: [categories[0], categories[5]],
      unitPrice: 11.359090909,
      discount: 0.1,
      stock: 10,
      unit: "lb",
      unitCount: 3,
    }),
    itemCreate({
      name: "Organic Strawberries",
      description: "14oz of Californian Sweet strawberries",
      category: [categories[2], categories[6]],
      unitPrice: 0.124375,
      discount: 0.1,
      stock: 14,
      unit: "oz",
      unitCount: 16,
    }),
    itemCreate({
      name: "BC fresh Blueberries",
      description: "2.2lb of BC high bush 'Patriot' blueberries.",
      category: [categories[2]],
      unitPrice: 3.99,
      discount: 0,
      stock: 19,
      unit: "lb",
      unitCount: 2.2,
    }),
  ]);
}