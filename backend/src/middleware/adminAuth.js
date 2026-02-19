const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {

  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'change_this_long_secret'
    );

    const user = await User.findById(payload.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.user = user;

    next();

  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
