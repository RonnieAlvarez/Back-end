import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";



const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
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
      required:false,
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

ProductSchema.plugin(mongooseDelete, { deletedAt: true });
export const ProductModel = mongoose.model("Product", ProductSchema);
