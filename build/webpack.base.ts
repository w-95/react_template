import { Configuration, DefinePlugin } from "webpack";
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * @error 找不到名称“require”。是否需要安装 Node.js 的类型定义? 请尝试运行 `npm i --save-dev @types/node`。
 * @description 这是由于typescript自身的机制，需要一份xx.d.ts声明文件，来说明模块对外公开的方法和属性的类型以及内容。
 * 对于内建模块，安装一个@types/node模块可以整体解决模块的声明文件问题。
 * @tips pnpm add @types/node -D
 */
const path = require("path");

/**
 * @TODO
 * 为什么能访问到node 的process属性 应为安装了ts-node @types/node
 * 区分是开发模式还是打包构建模式 process.env.NODE_ENV
 * 区分项目业务环境，开发/测试/预测/正式环境 process.env.BASE_ENV
 * cross-env：运行跨平台设置和使用环境变量的脚本，兼容各系统的设置环境变量的包 兼容windows macos平台
 * webpack.DefinePlugin：webpack内置的插件,可以为业务代码注入环境变量
 */
// console.log('NODE_ENV', process.env.NODE_ENV);
// console.log('BASE_ENV', process.env.BASE_ENV);

import * as dotenv from "dotenv";

// 加载配置文件
const envConfig = dotenv.config({
  path: path.resolve(__dirname, "../env/.env." + process.env.BASE_ENV),
});

const baseConfig: Configuration = {
  // 入口文件
  entry: path.join(__dirname, "../src/index.tsx"),
  // 打包出口文件
  output: {
    filename: "static/js/[name].js", // 每个输出js的名称
    path: path.join(__dirname, "../dist"), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
  },
  // loader 配置
  module: {
    rules: [
      {
        // 匹配.ts, tsx文件
        test: /.(ts|tsx)$/,
        // 如果是use："babel-loader"的话会自动引入babel.config.js的配置项 否则需要use: { loader: "babel-loader", options: {...所有的配置项}}
        use: "babel-loader",
      },
      {
        //匹配 css 文件
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".css"],
    // 别名需要配置两个地方，这里和 tsconfig.json 配合tsconfig的paths和baseUrl属性使用
    alias: {
      "@": path.join(__dirname, "../src"),
    },
    modules: ['../node_modules'], // 查找第三方模块只在本项目的node_modules中查找
  },
  // plugins 的配置
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack5-react-ts",
      filename: "index.html",
      // 复制 'index.html' 文件，并自动引入打包输出的所有资源（js/css）
      template: path.join(__dirname, "../public/index.html"),
      inject: true, // 自动注入静态资源
      hash: true,
      cache: false,
      // 压缩html资源
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true, //去空格
        removeComments: true, // 去注释
        minifyJS: true, // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyCSS: true, // 缩小CSS样式元素和样式属性
      },
      nodeModules: path.resolve(__dirname, "../node_modules"),
    }),
    // 注入到业务
    new DefinePlugin({
      // 'process.env': JSON.stringify(process.env)
      "process.env": JSON.stringify(envConfig.parsed),
      "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};

export default baseConfig;
