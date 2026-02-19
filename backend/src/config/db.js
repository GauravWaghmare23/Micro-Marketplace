const mongoose = require('mongoose');

module.exports = async function connectDB() {

  const uri =
    process.env.MONGO_URI;

    if (!uri) {
        console.error('MONGO_URI is not defined');
    }

  try {

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected');

  } catch (error) {

    console.error('MongoDB connection failed:', error.message);

    process.exit(1); 
  }
};
