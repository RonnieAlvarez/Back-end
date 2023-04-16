import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const productModelName = 'productName';

const ProductSchema = new mongoose.Schema({
  _pid: {
    type: mongoose.Types.ObjectId, // Asigna un ObjectId único
    required: true
  },
  pid:{
    type: Number
  },
  Quantity: {
    type: Number,
    required: true
  }
});

const cartModelName = 'cartName'

const CartSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  products: [ProductSchema],
  timestamp : {type : String, required : true}
});

CartSchema.plugin(mongooseDelete, { deletedAt: true });
export const CartModel = new mongoose.model("Cart", CartSchema);


