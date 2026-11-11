var fs = require('fs');
var path = require('path');

var trips = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../data/trips.json'),
    'utf8'
  )
);

/* GET travel page. */
module.exports.travel = function(req, res) {
  res.render('travel', {
    title: 'Travel - Travlr Getaways',
    isTravel: true,
    trips: trips
  });
};