import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true
    },
    Title: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: false,
    },
    Code: {
      type: String,
      required: false,
      min: 0,
    },
    Price: {
      type: Number,
      required: false,
      min: 0,
    },
    Status: {
      type: Boolean,
      required: false,
    },
    Stock: {
      type: Number,
      required: false,
    },
    Category: {
      type: String,
      required: false,
    },
    Thumbnail: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);


const CartSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  products:{
    type:[
      {
        product:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        Quantity: {
            type: Number
        },
        pid:{
          type: Number 
        }
      }
    ], default: []
    }, 
  timestamp: { type: String }
});

CartSchema.plugin(mongooseDelete,{ deletedAt: true });
const CartModel = new mongoose.model("Cart", CartSchema);

ProductSchema.plugin(mongooseDelete, { deletedAt: true });
const ProductModel = mongoose.model("Product", ProductSchema);

export { ProductModel, CartModel };
