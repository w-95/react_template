// import scssStyle from './app.less';
import React from "react";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import { Layout, ConfigProvider, theme } from "antd";
import appStyle from "./app.scss";
import LeftSider from "@/components/leftSider/index";
import  { usePlayerSelection } from "foxglove-studio/packages/studio-base/src/context/PlayerSelectionContext"

const { Header, Content, Footer } = Layout;

const App = () => {
  const a = usePlayerSelection();
  const colorBgContainer = "red";
  return (
    
    <Layout className={ appStyle['app-root-layout']}>

      <ConfigProvider  theme={{
        token: {
          colorPrimary: '#00b96b',
        },
      }}>
        {/* 侧边栏 */}
        <LeftSider></LeftSider>
        <Layout>
          <Header />

          <Content style={{ margin: "24px 16px 0" }}></Content>

          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2023 Created by Ant UED
          </Footer>
        </Layout>
      </ConfigProvider>
    </Layout>
  );
};

export default App;
