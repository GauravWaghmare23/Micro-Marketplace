const express = require('express');
const { query, param, body } = require('express-validator');
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// All admin routes require adminAuth
router.use(adminAuth);

// Users
router.get(
  '/users',
  [
    query('page').optional().toInt(),
    query('limit').optional().toInt(),
    query('q').optional().trim().escape()
  ],
  adminController.listUsers
);

router.get(
  '/users/:id',
  [param('id').isMongoId().withMessage('Invalid user id')],
  adminController.getUser
);

router.delete(
  '/users/:id',
  [param('id').isMongoId().withMessage('Invalid user id')],
  adminController.deleteUser
);

// Products
router.get(
  '/products',
  [
    query('page').optional().toInt(),
    query('limit').optional().toInt(),
    query('q').optional().trim().escape()
  ],
  adminController.listProducts
);

router.put(
  '/products/:id',
  [
    param('id').isMongoId().withMessage('Invalid product id'),
    body('title').optional().isString().trim().isLength({ min: 1 }),
    body('price').optional().isNumeric(),
    body('description').optional().isString().trim(),
    body('image').optional().isURL().withMessage('Invalid image URL')
  ],
  adminController.updateProduct
);

router.delete(
  '/products/:id',
  [param('id').isMongoId().withMessage('Invalid product id')],
  adminController.deleteProduct
);

module.exports = router;
