const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    image: {
      type: String,
      trim: true
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', ProductSchema);
