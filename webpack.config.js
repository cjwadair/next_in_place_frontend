const path = require('path');
module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: __dirname + '/dist',
    filename: "bundle.js",
    library: "nextInPlace",
    libraryTarget: 'umd'
  },
  devtool: false, //'eval-cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  module: {
   rules: [
     {
       test: /\.js$/,
       exclude: /node_modules/,
       use: "babel-loader"
      }
    ]
  },
  mode: "development"
}
