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
// 构建进度插件
import WebpackBar from "webpackbar";

// 在开发环境我们希望css嵌入在style标签里面，方便样式热替换，但打包时我们希望把css单独抽离出来,方便配置缓存策略。而插件mini-css-extract-plugin就是来帮我们做这件事的
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development' // 是否是开发模式

const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;
const lessRegex = /\.less$/;
const stylRegex = /\.styl$/;

// 加载配置文件
const envConfig = dotenv.config({
  path: path.resolve(__dirname, "../env/.env." + process.env.BASE_ENV),
});

const styleLoadersArray = [
  isDev ? "style-loader" : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
  {
    loader: "css-loader",
    options: {
      modules: {
        // localIdentName：配置生成的css类名组成（path路径，name文件名，local原来的css类名, hash: base64:5拼接生成hash值5位
        localIdentName: "[path][name]__[local]--[hash:5]",
      },
    },
  },
];

const baseConfig: Configuration = {
  // 入口文件
  entry: path.join(__dirname, "../src/index.tsx"),
  // 打包出口文件
  output: {
    filename: "static/js/[name].js", // 每个输出js的名称
    path: path.join(__dirname, "../dist"), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
    // 处理图片 webpack4使用file-loader和url-loader来处理的，但webpack5不使用这两个loader了,而是采用自带的 asset-module 来处理
    assetModuleFilename: "images/[hash][ext][query]",
  },
  // loader 配置
  module: {
    rules: [
      {
        // 匹配.ts, tsx文件
        test: /.(ts|tsx)$/,
        exclude: /node_modules/,
        // 如果是use："babel-loader"的话会自动引入babel.config.js的配置项 否则需要use: { loader: "babel-loader", options: {...所有的配置项}}
        use: ['thread-loader', 'babel-loader']
      },
      {
        //匹配 css 文件
        test: cssRegex,
        use: styleLoadersArray,
      },
      {
        test: lessRegex,
        use: [
          ...styleLoadersArray,
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                importLoaders: 2,
                // 如果要在less中写类型js的语法，需要加这一个配置
                javascriptEnabled: true,
                // 可以加入modules: true，这样就不需要在less文件名加module了
                modules: true,
              },
            },
          },
        ],
      },
      {
        test: sassRegex,
        use: [...styleLoadersArray, "sass-loader"],
      },
      {
        test: stylRegex,
        use: [...styleLoadersArray, "stylus-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // 匹配图片文件
        /**
         * asset/resource	发送一个单独的文件，并导出 URL，替代 file-loader，相当于file-loader, 将文件转化成Webpack能识别的资源，其他不做处理。
         * asset/inline	导出一个资源的 data URI，以前使用 url-loader 实现。
         * asset/source	导出资源的源代码 ，以前是使用 raw-loader 实现。
         * asset	相当于自动选择 asset/resource 或 asset/inline，替换 url-loader 中的 limit，相当于url-loader将文件转化成Webpack能识别的资源，同时小于某个大小的资源会处理成data URI形式。
         */
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024, // 小于10kb转base64
          },
        },
        generator: {
          filename: "static/images/[hash][ext][query]", // 文件输出目录和命名
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64
          },
        },
        generator: {
          filename: "static/fonts/[hash][ext][query]", // 文件输出目录和命名
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64
          },
        },
        generator: {
          filename: "static/media/[hash][ext][query]", // 文件输出目录和命名
        },
      },
      {
        // 匹配json文件
        test: /\.json$/,
        type: "asset/resource", // 将json文件视为文件类型
        generator: {
          // 这里专门针对json文件的处理
          filename: "static/json/[name].[hash][ext][query]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".css"],
    // 别名需要配置两个地方，这里和 tsconfig.json 配合tsconfig的paths和baseUrl属性使用
    alias: {
      "@": path.join(__dirname, "../src"),
    },
    modules: ["../node_modules"], // 查找第三方模块只在本项目的node_modules中查找
  },
  cache: {
    type: 'filesystem', // 使用文件缓存
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
    new WebpackBar({
      color: "#85d", // 默认green，进度条颜色支持HEX
      basic: false, // 默认true，启用一个简单的日志报告器
      profile: false, // 默认false，启用探查器。
      // reporters: {
        // 注册一个自定义记者数组
        // start(context) {
        //   // 在（重新）编译开始时调用
        //   const { start, progress, message, details, request, hasErrors } =
        //     context;
        // },
        // change(context) {
        //   // 在 watch 模式下文件更改时调用
        // },
        // update(context) {
        //   // 在每次进度更新后调用
        // },
        // done(context) {
        //   // 编译完成时调用
        // },
        // progress(context) {
        //   // 构建进度更新时调用
        // },
        // allDone(context) {
        //   // 当编译完成时调用
        // },
        // beforeAllDone(context) {
        //   // 当编译完成前调用
        // },
        // afterAllDone(context) {
        //   // 当编译完成后调用
        // },
      // },
    }),
  ],
};

export default baseConfig;
