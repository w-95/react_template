import { createRoot } from "react-dom/client";

import App from './App';
import "./app.less";
import appStyle from "./app.scss";

const root = document.querySelector('#root');


if(root) {
    root.className = appStyle["app-root"];
    createRoot(root).render(<App />)
};

// 在业务中使用环境变量
// console.log('NODE_ENV', process.env.NODE_ENV)
// console.log('BASE_ENV', process.env.BASE_ENV)
// console.log("process.env", process.env);
