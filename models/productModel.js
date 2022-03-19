const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: [true, 'A Product must have a name'],
      maxlength: [40, 'A product must have less or equal 40 characters'],
      minlength: [5, 'A product must have more or equal 5 charcters']
    },
    slug: String,
    category: {
      type: String,
      required: [true, 'A product belongs to specific catergory'],
      enum: {
        values: ['Phone', 'Computer', 'Laptop', 'machine'],
        message: 'you can just select laptop phone machine and computer'
      }
    },
    price: {
      type: Number,
      required: [true, 'a product must have price']
    },
    priceDiscount: {
      type: Number
      // this validtor will work whenever we create new document not on update
      // validate: {
      //   function(val) {
      //     return val < this.price;
      //   },
      //   message: `Discount price ({VALUE}) should be below regular price`
      // }
    },
    images: [String],
    product_description: {
      type: String,
      required: [true, 'A product must have a description about it']
    },
    brand: {
      type: String,
      required: [true, 'A product must have brand name']
    },
    product_images: [{}],
    availability: {
      type: Boolean
      // required: [true, 'information about availabilty is important']
    },
    // reviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }],
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be about 1.0'],
      max: [5, 'Rating must be less than 5']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    quantityProduct: {
      type: Number
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });
productSchema.pre('save', function(next) {
  this.slug = slugify(this.product_name, { lower: true });
  next();
});
// virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});
productSchema.post('save', function(doc, next) {
  console.log(doc);
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
