const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const Product = require('../models/productModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadProductImages = upload.fields([{ name: 'images', maxCount: 3 }]);

// upload.single('image') req.file
// upload.array('images', 5) req.files
exports.resizeProductImages = catchAsync(async (req, res, next) => {
  console.log(req.files);

  if (!req.files.images) return next();

  // 1) Cover image

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.getAllproduct = factory.getAll(Product);

exports.addProduct = factory.createOne(Product);
exports.getsingleproduct = factory.getOne(Product, { path: 'reviews' });
exports.productUpdate = factory.updateOne(Product);
// exports.delProduct = catchAsync(async (req, res) => {
//   const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//   res.status(202).json({
//     status: 'success',
//     data: {
//       deletedProduct
//     }
//   });
// });

exports.delProduct = factory.deleteOne(Product);
