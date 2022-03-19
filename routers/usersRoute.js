const express = require('express');

const userControl = require('../controllers/userController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMe',

  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.use(authController.protect, authController.restrictTo('admin'));
router
  .route('/')
  .get(userControl.getAllUsers)
  .post(userControl.addUser);
router
  .route('/:id')
  .get(userController.getsingleUser)
  .patch(userController.UserUpdate)
  .delete(userController.deleteUser);

module.exports = router;
