const { default: mongoose } = require('mongoose');
const moongoose = require('mongoose');

const buySchema = new moongoose.Schema({
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required']
    }
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'cart must belong to a User']
  },
  price: {
    type: Number,
    required: [true, 'Cart must have a price']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
});

buySchema.pre(/^find/, function(next) {
  this.populate('user').populate('products');
});

const buy = mongoose.model('buy', buySchema);
module.exports = buy;
