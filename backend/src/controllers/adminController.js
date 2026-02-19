const { validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');

// Helper for pagination
function paginate(query, page = 1, limit = 20) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  return { query, page: p, limit: l, skip: (p - 1) * l };
}

exports.listUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { q } = req.query;
    const { page = 1, limit = 20 } = req.query;

    let filter = {};

    if (q) {
      const r = new RegExp(q, 'i');
      filter = { $or: [{ name: r }, { email: r }] };
    }

    const { skip, limit: l, page: p } = paginate(filter, page, limit);

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(l)
    ]);

    res.json({ total, page: p, limit: l, users });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const target = await User.findById(id);
    if (!target) return res.status(404).json({ message: 'User not found' });

    // Prevent removing the last admin
    if (target.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin' });
      }
    }

    await User.findByIdAndDelete(id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.listProducts = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { q } = req.query;
    const { page = 1, limit = 20 } = req.query;

    let filter = {};

    if (q) {
      const r = new RegExp(q, 'i');
      filter = { $or: [{ title: r }, { description: r }] };
    }

    const { skip, limit: l, page: p } = paginate(filter, page, limit);

    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l)
    ]);

    res.json({ total, page: p, limit: l, products });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const update = {};
    ['title', 'price', 'description', 'image'].forEach((f) => {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    });

    const product = await Product.findByIdAndUpdate(id, update, { new: true });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await Product.findByIdAndDelete(id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
