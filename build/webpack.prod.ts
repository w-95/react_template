import path from "path";
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import baseConfig from "./webpack.base";
/**
 * @TODO public下的一些静态资源不需要webpack打包，只需要打包的时候将public下的内容复制到构建出口文件夹中即可
 * pnpm add copy-webpack-plugin -D
 */
import CopyPlugin from "copy-webpack-plugin";
// 样式压缩
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

// js 压缩
import TerserPlugin from 'terser-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

// 样式抽离
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * @TODO none(就是不配置devtool选项了，不是配置devtool: 'none')
 * none话调试只能看到编译后的代码，也不会泄露源代码，打包速度也会比较快。
 * 只是不方便线上排查问题, 但一般都可以根据报错信息在本地环境很快找出问题所在
 */
const prodConfig: Configuration = merge(baseConfig, {
  mode: "production", // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),         // 复制public下文件
          to: path.resolve(__dirname, "../dist"),             // 复制到dist目录中
          filter: (source) => !source.includes("index.html"), // 忽略index.html
        },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css' // 抽离css的输出目录和名称
    }),

    // 打包时生成gzip文件
    new CompressionPlugin({
      test: /\.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8 // 压缩率,默认值是 0.8
    })
  ],
  optimization: {
    runtimeChunk: {
      name: 'mainifels'
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'] // 删除console.log
          }
        }
      })
    ],
  },
  performance: {
    hints: false,
    maxAssetSize: 4000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 5000000 // 整数类型（以字节为单位）
  }
});

export default prodConfig;
