import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';

const { Content } = Layout;

const App = () => {
  return (
    <Layout>
      <div className="footer-menu">
        <Menu theme="dark" mode="horizontal">
          {/* Home page link */}
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="1" icon={<AppstoreOutlined />}>
            <Link to="/tab1">Tab 1</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreOutlined />}>
            <Link to="/tab2">Tab 2</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
            <Link to="/add-items">Товары</Link>
          </Menu.Item>
        </Menu>
      </div>
      <Content style={{ padding: '20px' }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default App;
