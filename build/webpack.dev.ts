/**
 * @TODO 这个文件是本地启动时加载的文件及配置项
 * so 需要安装：pnpm add webpack-dev-server html-webpack-plugin webpack-merge -D
 */

import path from "path";
import { merge } from "webpack-merge";
import webpack, { Configuration as WebpackConfiguration } from "webpack";
import WebpackDevServer, {
  Configuration as WebpackDevServerConfiguration,
} from "webpack-dev-server";
import baseConfig from "./webpack.base";

// 运行命令的时候重启一次打开一个tab 页很烦，所以呢优化一下
// 参考：create-react-app 的启动方式
// https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/openChrome.applescript
// 记得关闭webpack-dev-server的配置中的自动打开 open: false 或者注释
const openBrowser = require("./util/openBrowser");

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devConfig: Configuration = merge(baseConfig, {
  mode: "development",
  /**
   * @TODO
   * 本地开发首次打包慢点，但是eval 缓存的原因，热更新会很快
   * 开发中，需要定位到行 加上 cheap
   * 能找到源代码的错误，而不是打包后的，所以需要加上 module
   */
  devtool: "eval-cheap-module-source-map",
});

const devServer = new WebpackDevServer(
  {
    host: HOST,
    port: PORT,
    open: false,
    compress: false, // gzip压缩,开发环境不开启，提升热更新速度
    hot: true, // 开启热更新
    historyApiFallback: true, // 解决history路由404问题
    setupExitSignals: true, // 允许在 SIGINT 和 SIGTERM 信号时关闭开发服务器和退出进程。
    static: {
      directory: path.join(__dirname, "../public"), // 托管静态资源public文件夹
    },
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  webpack(devConfig)
);

devServer.start().then(() => {
  // 启动界面
  openBrowser(`http://${HOST}:${PORT}`);
});

export default devConfig;
