import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header, Content } = Layout;

const App = () => {
  return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">
            <Link to="/tab1">Tab 1</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/tab2">Tab 2</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/add-items">Товары</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default App;
