const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {type: String, minLength: 3, maxLength: 64, required: true},
  description: {type: String, minLength: 3, maxLength: 128 },
  category:[{type: Schema.Types.ObjectId, ref:"Category", required: true }],
  unitPrice: {type: Number, min: 0, required: true},
  discount: {type: Number, min: 0, max: 0.99},
  stock: {type: Number, min: 0, max: 99, required: true},
  unit: {
    type: String, 
    eNum:['piece','pack','bag','kg','g','lb','oz','l','ml'],
    default: "piece", 
    required: true,
  },
  unitCount: {type: Number, min: 0, max: 99, required: true},
  updated: { type: Date, default: Date.now() },
});

ItemSchema.virtual("url").get(function () {
  return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
