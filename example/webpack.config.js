var path = require('path');

module.exports = {
  entry: "./entry.js",
  output: {
    path: "./dist",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /.json$/,
        loader: "json"
      }
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules', 'pies']
  },
  resolveLoader: {
    alias: {
      "generate-controllers-loader": path.join("..", "index")
    }
  },
  pieControllers: {
    "pie-one" : "./test-controller.js"
  }
};