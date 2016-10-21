var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');


serverSettings = {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
};

function handleRequest(err, result) {
  if (err)
    return console.log(err);

  console.log('Listening at http://localhost:3000/');
};

var server = new WebpackDevServer(webpack(config), serverSettings);
server.listen(3000, 'localhost', handleRequest);
