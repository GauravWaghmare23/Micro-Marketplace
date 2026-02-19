const { validationResult } = require('express-validator');
const Product = require('../models/Product');


exports.create = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {

    const payload = req.body;

    payload.createdBy = req.user._id;

    const product = new Product(payload);

    await product.save();

    res.status(201).json(product);

  } catch (err) {
    next(err);
  }
};


exports.getList = async (req, res, next) => {
  try {

    const {
      page = 1,
      limit = 10,
      search = '',
      sort = 'desc'
    } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const items = await Product
      .find(query)
      .sort({ createdAt: sort === 'desc' ? 1 : -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await Product.countDocuments(query);

    res.json({
      items,
      total,
      page: pageNumber,
      limit: limitNumber
    });

  } catch (err) {
    next(err);
  }
};


exports.getOne = async (req, res, next) => {
  try {

    const product = await Product
      .findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(product);

  } catch (err) {
    next(err);
  }
};


exports.update = async (req, res, next) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Not found' });
    }

    if (
      product.createdBy &&
      product.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(product, req.body);

    await product.save();

    res.json(product);

  } catch (err) {
    next(err);
  }
};


exports.remove = async (req, res, next) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Not found' });
    }

    if (
      product.createdBy &&
      product.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await product.remove();

    res.json({ message: 'Deleted' });

  } catch (err) {
    next(err);
  }
};
