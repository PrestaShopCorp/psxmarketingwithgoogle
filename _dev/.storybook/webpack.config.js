const path = require('path');

module.exports = ({ config }) => {
    config.module.rules.push({
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../'),
      }, {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
        {
            loader: require.resolve("babel-loader"),
            options: {
            presets: [
                require("@babel/preset-typescript").default,
                require("@babel/preset-react").default,
                require("@babel/preset-env").default
            ]}
        },
        ]
    });

    config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, '../src/'),
    };

    config.resolve.extensions.push(".ts", ".tsx");

    config.module.rules.push({
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true
            },
          }
        ],
    });

    return config;
};