const express = require('express');

const router = express.Router();

const { body } = require('express-validator');

const authController = require('../controllers/authController');


router.post(
  '/register',
  [
    body('name')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),

    body('email')
      .isEmail()
      .withMessage('Invalid email format'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  authController.register
);


router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format'),

    body('password')
      .exists()
      .withMessage('Password is required')
  ],
  authController.login
);


module.exports = router;
