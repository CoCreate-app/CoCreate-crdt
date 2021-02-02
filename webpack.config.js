const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let isProduction = process.env.NODE_ENV === 'production';


module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'CoCreate-crdt': './src/crdt.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name].min.js' : '[name].js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: ['CoCreate', 'crdt'],
    globalObject: "this",
  },
  // Default mode for Webpack is production.
  // Depending on mode Webpack will apply different things
  // on final bundle. For now we don't need production's JavaScript
  // minifying and other thing so let's set mode to development
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ["@babel/plugin-transform-regenerator"]
          }
        }
      },
    ]
  },

  // add source map
  ...(isProduction ? {} : { devtool: 'eval-source-map' }),

  // add uglifyJs
  optimization: {
    minimizer: [new UglifyJsPlugin({
      uglifyOptions: {
        // get options: https://github.com/mishoo/UglifyJS
        drop_console: isProduction
      },
    })],
  },
}
