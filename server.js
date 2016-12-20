var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');
var _ = require('lodash');
var reservations_file = 'data/reservations.json';


function updateReservation(reservationSrc, reservationDst){
  if(reservationDst.carrier == reservationSrc.carrier){
    return reservationSrc;
  }
  return reservationDst;
}

function changeReservation(reservation){
  var reservations = jsonfile.readFileSync(reservations_file).data;

  reservations = reservations.map(_.partial(updateReservation, reservation));

  jsonfile.writeFileSync(reservations_file, {data: reservations}); 
}

serverSettings = {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  setup: function(app) {
    app.use(bodyParser.json());
    
    app.post('/change_reservation', function(req, res) {
      changeReservation(req.body);
      res.json({ reservation: {status: 'SUCCESS'} });
    });
  },
};


var port = 3003;
var server = new WebpackDevServer(webpack(config), serverSettings);

function handleRequest(err, result) {
  if (err)
    return console.log('Error: ' + err);

  console.log('Listening at http://localhost:'+port);
};

server.listen(port, '0.0.0.0', handleRequest);
