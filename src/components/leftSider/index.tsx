import React, { useState } from "react";
import { Layout, Menu, theme, MenuProps } from "antd";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  PieChartOutlined,
  DesktopOutlined,
  TeamOutlined,
  FileOutlined
} from "@ant-design/icons";
import { CollapseType } from "antd/es/layout/Sider";

type MenuItem = Required<MenuProps>['items'][number];
const { Sider } = Layout;

const getItem = ( label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[] ): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
};

const items: MenuItem[] = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

const LeftSider = () => {

  // 是否展开
  const [collapsed, setCollapsed] = useState(false);
  
  // 触发响应式布局断点时的回调
  const onBreakpoint = (broken: boolean) => {};

  // 展开-收起时的回调函数，有点击 trigger 以及响应式反馈两种方式可以触发
  const onCollapse = (collapsed: boolean, type: CollapseType) => {
    setCollapsed(collapsed);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      onBreakpoint={onBreakpoint}
      onCollapse={onCollapse}
    >
      <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items}
      />
    </Sider>
  );
};

export default LeftSider;
