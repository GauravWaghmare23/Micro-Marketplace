const express = require('express');

const router = express.Router();

const { body, param } = require('express-validator');

const productController = require('../controllers/productController');
const auth = require('../middleware/auth');


router.get(
  '/',
  productController.getList
);


router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid product ID'),
  productController.getOne
);


router.post(
  '/',
  auth,
  [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .trim(),

    body('price')
      .isNumeric()
      .withMessage('Price must be a number')
  ],
  productController.create
);


router.put(
  '/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Invalid product ID')
  ],
  productController.update
);


router.delete(
  '/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Invalid product ID')
  ],
  productController.remove
);


module.exports = router;
