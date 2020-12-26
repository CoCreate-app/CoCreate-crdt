const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'CoCreate-crdt': './src/CoCreate-crdt.js',
    'CoCreate-crdt.index': './src/CoCreate-crdt.index.js',
  },
  output: {
    globalObject: 'self',
    path: path.resolve(__dirname, './dist/'),
    filename: '[name].js',
    publicPath: './dist/'
  },
  devServer: {
    contentBase: path.join(__dirname),
    compress: true,
    publicPath: '/dist/'
  }
}
