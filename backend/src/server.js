require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4000;


async function startServer() {
  try {

    await connectDB();

    // Run seed tasks (idempotent) after DB connection to ensure default admin exists
    try {
      // require here so it's executed after connectDB
      const { runSeeds } = require('./seed/seed');
      // run without reconnecting (connectIfNeeded = false)
      await runSeeds(false);
    } catch (seedErr) {
      console.warn('Seeding step failed (continuing):', seedErr.message || seedErr);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
