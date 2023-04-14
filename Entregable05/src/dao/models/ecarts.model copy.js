import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const CartSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  Products: [{
      Pid: {
        type: Number,
        required: true,
      },
      Quantity: {
        type: Number,
        required: true,
      },
    }]
});

CartSchema.plugin(mongooseDelete, { deletedAt: true });
export const CartModel = new mongoose.model("Cart", CartSchema);


