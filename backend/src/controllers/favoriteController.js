const Product = require('../models/Product');
const User = require('../models/User');


exports.add = async (req, res, next) => {
  try {

    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = req.user;

    if (user.favorites.includes(productId)) {
      return res.status(200).json({ message: 'Already favorited' });
    }

    user.favorites.push(productId);

    await user.save();

    res.json({ message: 'Favorited' });

  } catch (err) {
    next(err);
  }
};


exports.remove = async (req, res, next) => {
  try {

    const productId = req.params.productId;

    const user = req.user;

    user.favorites = user.favorites.filter(
      id => id.toString() !== productId.toString()
    );

    await user.save();

    res.json({ message: 'Unfavorited' });

  } catch (err) {
    next(err);
  }
};


exports.list = async (req, res, next) => {
  try {

    const user = await User
      .findById(req.user._id)
      .populate('favorites');

    res.json({ items: user.favorites });

  } catch (err) {
    next(err);
  }
};
