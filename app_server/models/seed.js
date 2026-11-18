// Bring in the DB connection and Trip schema
const mongoose = require('./db');
const Trip = require('./travlr');

// Read seed data from JSON file
const fs = require('fs');
const trips = JSON.parse(
    fs.readFileSync('./data/trips.json', 'utf8')
);

// Delete existing records and insert seed data
const seedDB = async () => {
    await Trip.deleteMany({});
    await Trip.insertMany(trips);
};

// Close the MongoDB connection
seedDB()
    .then(async () => {
        console.log(`Successfully seeded ${trips.length} trips`);
        await mongoose.connection.close();
        process.exit(0);
    })
    .catch(async (err) => {
        console.error('Database seeding error:', err);
        await mongoose.connection.close();
        process.exit(1);
    });