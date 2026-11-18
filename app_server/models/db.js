const mongoose = require('mongoose');
const readLine = require('readline');

// MongoDB connection settings
const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;

// Connect to MongoDB
const connect = async () => {
    try {
        await mongoose.connect(dbURI);
    } catch (err) {
        console.error('Mongoose connection error:', err);
    }
};

// Monitor database connection events
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Windows-specific listener
if (process.platform === 'win32') {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('SIGINT', () => {
        process.emit('SIGINT');
    });
}

// Graceful database shutdown
const gracefulShutdown = async (msg) => {
    try {
        await mongoose.connection.close();
        console.log(`Mongoose disconnected through ${msg}`);
    } catch (err) {
        console.error('Mongoose shutdown error:', err);
    }
};

// Handle application restart
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart').finally(() => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// Handle application termination
process.once('SIGINT', () => {
    gracefulShutdown('app termination').finally(() => {
        process.exit(0);
    });
});

// Handle application shutdown
process.once('SIGTERM', () => {
    gracefulShutdown('app shutdown').finally(() => {
        process.exit(0);
    });
});

// Connect to database
connect();

// Import Mongoose schema
require('./travlr');

module.exports = mongoose;