const path = require("path");
// 引入html插件
const HTMLWebpackPlugin = require("html-webpack-plugin");
// 把整个目录copy过去
const CopyWebpackPlugin = require("copy-webpack-plugin");
// 引入clean插件
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const ESLintPlugin = require("eslint-webpack-plugin");
const { InjectManifest } = require("workbox-webpack-plugin");

// webpack中的所有的配置信息都应该写在module.exports中
module.exports = {
  mode: "development", // It's good practice to set the mode explicitly
  devServer: {
    port: "8088",
    // This helps with routing in single-page applications
    historyApiFallback: true,
  },
  // 指定入口文件
  entry: "./src/index.tsx",
  // 指定打包文件所在目录
  output: {
    // 指定打包文件的目录
    path: path.resolve(__dirname, "dist"),
    // 打包后文件的文件
    filename: "bundle.js",
    // This helps prevent issues with mixed content and ensures assets are loaded correctly.
    publicPath: "/",
    // 告诉webpack不使用箭头
    // 默认打包后是一个立即执行的箭头函数，在IE 11中也是无法执行的！
    // 加上下面的配置，可以在webpack打包时，最外层不再是箭头函数
    environment: {
      arrowFunction: false,
    },
  },
  // 指定webpack打包时要使用模块
  module: {
    // 指定要加载的规则
    rules: [
      {
        // test指定的是规则生效的文件
        test: /\.(ts|tsx|js|jsx)$/, // Process JS files as well
        // 要使用的loader
        // We only need babel-loader since it's configured to handle TypeScript and React
        use: [
          // 配置babel
          {
            // 指定加载器
            loader: "babel-loader",
            // 设置babel
            options: {
              // 设置预定义的环境
              presets: [
                [
                  // 指定环境的插件
                  "@babel/preset-env",
                  // 配置信息
                  {
                    // 要兼容的目标浏览器
                    targets: {
                      chrome: "58",
                      ie: "11",
                    },
                    // 指定corejs的版本
                    corejs: "3",
                    // 使用corejs的方式，"usage" 表示按需加载
                    useBuiltIns: "usage",
                  },
                ],
                "@babel/preset-typescript", // This preset allows Babel to understand TypeScript
                ["@babel/preset-react", { runtime: "automatic" }], // This preset handles JSX
              ],
            },
          },
        ],
        // 要排除的文件 (Corrected typo from node-modules to node_modules)
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i, // Handles .css files
        use: ["style-loader", "css-loader", "postcss-loader"], // Correct order: css-loader reads the file, style-loader injects it into the DOM
      },
      // Shaders
      {
        test: /\.(glsl|vs|fs)$/,
        loader: "ts-shader-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },

  // 配置Webpack插件
  plugins: [
    new CleanWebpackPlugin(), // It's safe to re-enable this
    new HTMLWebpackPlugin({
      template: "./src/index.html",
    }),
    // 把整个目录copy过去
    new CopyWebpackPlugin({
      // This copies all files from the 'static' directory to the root of the output directory ('dist').
      // This ensures that if you have a file at 'static/images/earth/light_column.png',
      // it will be accessible from the URL '/images/earth/light_column.png', fixing the 404 error.
      patterns: [{ from: path.resolve(__dirname, "./static"), to: "." }],
    }),
    new InjectManifest({
      swSrc: "./src/custom-sw.js",
      swDest: "service-worker.js",
    }),

    new ESLintPlugin({
      context: "./src", // 检查目录
      extensions: ["js", "jsx", "ts", "tsx"], // 文件扩展
    }),
  ],
  // 用来设置引用模块
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  // 包太大会提示你
  performance: {
    hints: false,
  },
};
