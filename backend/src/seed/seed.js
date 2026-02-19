require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Product = require('../models/Product');

const MONGO = process.env.MONGO_URI;

async function runSeeds(connectIfNeeded = true) {
  try {
    if (connectIfNeeded) {
      await mongoose.connect(MONGO);
      console.log('Connected to DB (seed)');
    }

    // Ensure at least sample users exist
    const existingUsers = await User.countDocuments();
    if (existingUsers === 1) {
      const hashedPassword = await bcrypt.hash('password123', 10);

      await User.create([
        {
          name: 'Alice',
          email: 'alice@example.com',
          password: hashedPassword
        },
        {
          name: 'Bob',
          email: 'bob@example.com',
          password: hashedPassword
        }
      ]);

      console.log('Users seeded');
    } else {
      console.log('Users already exist, skipping user seed');
    }

    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      const users = await User.find();
      const products = [];
      for (let i = 1; i <= 1000; i++) {
        products.push({
          title: `Sample Product ${i}`,
          price: Math.round(Math.random() * 200) + 10,
          description: `This is sample product number ${i}`,
          image: `https://picsum.photos/seed/micro${i}/400/300`,
          createdBy: users[i % users.length]._id
        });
      }

      await Product.insertMany(products);
      console.log('Products seeded');
    } else {
      console.log('Products already exist, skipping product seed');
    }

    // Create the default admin user if not present (idempotent)
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'gauravwaghmare17384@gmail.com';
    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      const adminPwd = process.env.DEFAULT_ADMIN_PWD || '123456789';
      const hashedAdminPwd = await bcrypt.hash(adminPwd, 12);

      await User.create({
        name: process.env.DEFAULT_ADMIN_NAME || 'Admin',
        email: adminEmail,
        password: hashedAdminPwd,
        role: 'admin'
      });

      console.log('Default admin created:', adminEmail);
    } else {
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
        console.log('Existing user updated to admin:', adminEmail);
      } else {
        console.log('Admin user already present, skipping admin seed');
      }
    }

    return true;
  } catch (error) {
    console.error('Seeding failed:', error.message);
    throw error;
  }
}

// Allow running directly: connects to DB and runs seeds
if (require.main === module) {
  (async () => {
    try {
      await runSeeds(true);
      process.exit(0);
    } catch (err) {
      process.exit(1);
    }
  })();
}

module.exports = { runSeeds };
