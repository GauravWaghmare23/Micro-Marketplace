const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const favoriteController = require('../controllers/favoriteController');


router.post(
  '/:productId',
  auth,
  favoriteController.add
);


router.delete(
  '/:productId',
  auth,
  favoriteController.remove
);


router.get(
  '/',
  auth,
  favoriteController.list
);


module.exports = router;
