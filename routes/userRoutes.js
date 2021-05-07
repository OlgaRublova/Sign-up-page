const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

//convention is to call it 'router'
const router = express.Router();

//param middleware
//router.param('id', checkID);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
    .route('/')
    .get(authController.protect, userController.getAllUsers)
    .post(userController.createUser)

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(authController.protect, authController.restrictTo('admin', 'moderator'), userController.deleteUser)

//to make in available in 'app.js' for morgan
module.exports = router;