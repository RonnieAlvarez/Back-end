import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2"

/* This code is defining a Mongoose schema for a product. It includes various fields such as id, title,
description, code, price, status, stock, category, and thumbnail. Each field has a specific data
type and some have additional requirements such as being required or having a minimum value. The
schema also includes timestamps for when the product was created and updated. */
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

/* This code is defining a Mongoose schema for a shopping cart. It includes fields such as id,
products, and timestamp. The products field is an array of objects, each containing a product ID
(referenced from the Product model), a quantity, and a unique ID for the product in the cart. The
schema also includes the mongoose-delete plugin to enable soft deletion of cart items. */
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
            type: Number,
            default:0
        },
        pid:{
          type: Number,
          default:0
        }
      }
    ], default: []
    }, 
  timestamp: { type: String }
});

/* This code is defining a Mongoose schema for a chat message. It includes fields such as userEmail,
message, and date. The userEmail and message fields are required and have a data type of string. The
date field has a data type of string and a default value of the current date and time. It also
includes a custom validation function for the date field, which can be used to validate the date
format or range. */
const ChatSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  message: { type: String, required: true },
  date: { 
    type: String,
    default: Date.now,
    validate: {
      validator: function(value) {
        // Insert your custom date validation logic here
        return true; // Return true if validation passes, false otherwise
      },
      message: 'Invalid date' // Optional error message
    }
   },
});


/* This code is defining a pre-save hook for the ProductSchema. This hook is executed before a product
is saved to the database. It checks if the product has a Category field and if it does, it converts
the first letter of the category to uppercase and the rest of the letters to lowercase. This ensures
that the category is consistently formatted in a standardized way before it is saved to the
database. The `next()` function is called to move on to the next middleware function in the stack. */
ProductSchema.pre('save', function(next) {
  if (this.Category) {
    //this.Category = this.Category.toLowerCase();
    this.Category = this.Category.charAt(0).toUpperCase() + this.Category.slice(1).toLowerCase();
  }
  next();
});

/* This code is defining a Mongoose schema for a user. It includes fields such as first_name,
last_name, userEmail, age, password, and date. Each field has a specific data type and some have
additional requirements such as being required or having a unique value. The schema also includes a
custom validation function for the date field, which can be used to validate the date format or
range. This schema can be used to create a User model in the database. */
const UserSchema = new mongoose.Schema({
  //_id: {type: mongoose.SchemaTypes.ObjectId},
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, required: true, unique:true },
  age: { type: Number },
  password: { type: String },
  loggedBy:{ type:String,default:""},
  //roll:{type:String,required:false},
  roll: {
    type: String,
    default: 'User',
    enum: ['User', 'Admin'],
},
  date: { 
    type: String,
    default: Date.now,
    validate: {
      validator: function(value) {
        // Insert your custom date validation logic here
        return true; // Return true if validation passes, false otherwise
      },
      message: 'Invalid date' // Optional error message
    }
   }
},{
    timestamps: true,
  }
  );

const UserModel = new mongoose.model("users", UserSchema);

CartSchema.plugin(mongooseDelete,{ deletedAt: true });
const CartModel = new mongoose.model("Cart", CartSchema);

ProductSchema.plugin(mongooseDelete, { deletedAt: true });
ProductSchema.plugin(mongoosePaginate);
const ProductModel = mongoose.model("Product", ProductSchema);

ChatSchema.plugin(mongooseDelete, { deletedAt: true });
const ChatModel = mongoose.model("Messages", ChatSchema);

export  {ProductModel, CartModel, ChatModel}
export default UserModel