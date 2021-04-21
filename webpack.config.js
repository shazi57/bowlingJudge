const path = require('path');

const SRC_DIR = path.join(__dirname, '/src/index.jsx');
const DEST_DIR = path.join(__dirname, '/public');

module.exports = {
  entry: SRC_DIR,
  output: {
    path: DEST_DIR,
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['react-hot-loader/babel'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            import: true,
          },
        }],
      },
    ],
  },

  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },

  devServer: {
    contentBase: DEST_DIR,
  },
};
