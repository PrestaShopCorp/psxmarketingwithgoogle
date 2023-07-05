const path = require('path');
const { DefinePlugin } = require('webpack');

module.exports = {
  mode: "production",
  devtool: !!process.env.GENERATE_SOURCEMAPS ? "source-map": false,
  entry: {
    main: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, '../../../views/js'),
    filename: "fetchWarningMessage.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new DefinePlugin({
      'process.env.VITE_BUILD_VERSION': JSON.stringify(process.env.VITE_BUILD_VERSION || 'dev')
    }),
  ],
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
};
