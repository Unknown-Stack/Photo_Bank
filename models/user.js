const { Schema, model } = require("mongoose");
const { count } = require("./photo");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        photoId: {
          type: Schema.Types.ObjectId,
          ref: "Photo",
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (photo_id) {
  const clonedItems = [...this.cart.items];
  const idx = clonedItems.findIndex((c) => {
    return c.photoId.toString() === photo_id._id.toString();
  });

  if (idx >= 0) {
    clonedItems[idx].count = clonedItems[idx].count + 1;
  } else {
    clonedItems.push({
      photoId: photo_id._id,
      count: 1,
    });
  }

  this.cart = { items: clonedItems };

  return this.save();
};

userSchema.methods.removeFromCart = function (id) {
  let clonedItems = [...this.cart.items];
  const idx = clonedItems.findIndex((c) => {
    return c.photoId.toString() === id.toString();
  });
  if (clonedItems[idx].count === 1) {
    clonedItems = clonedItems.filter(
      (c) => c.photoId.toString() !== id.toString()
    );
  } else {
    clonedItems[idx].count--;
  }

  this.cart = { items: clonedItems };

  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model("User", userSchema);
