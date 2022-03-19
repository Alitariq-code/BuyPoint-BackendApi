const express = require('express');
const productControl = require('../controllers/productController');
const authController = require('../controllers/authController');

const reviewRouter = require('../routers/reviewRoute');

const router = express.Router();
router.use('/:ProductId/reviews', reviewRouter);
// router
//   .route('/:ProductId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router
  .route('/')
  .get(productControl.getAllproduct)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productControl.addProduct
  );
router
  .route('/:id')
  .get(productControl.getsingleproduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productControl.uploadProductImages,
    productControl.resizeProductImages,
    productControl.productUpdate
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productControl.delProduct
  );

module.exports = router;
