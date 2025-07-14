import React, { useState } from 'react';
import { Layout, Menu, Drawer, Button } from 'antd';
import {
  HomeOutlined,
  DashboardOutlined,
  FolderOpenOutlined,
  MenuOutlined,
  SearchOutlined,
  PlusOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;

const Navbar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // กำหนดเมนูหลักและ submenu
  const menuItems = [
    {
      label: 'หน้าแรก',
      key: '/',
      icon: <HomeOutlined />,
    },
    {
      label: 'Line Messages',
      key: '/line-messages',
      icon: <MessageOutlined />,
    },
    {
      label: 'Dashboard',
      key: '/dashboard',
      icon: <DashboardOutlined />,
    },
    {
      label: 'Project',
      key: 'project',
      icon: <FolderOpenOutlined />,
      children: [
        {
          label: 'ค้นหา Project',
          key: '/project/search',
          icon: <SearchOutlined />,
        },
        {
          label: 'Add Project',
          key: '/project/add',
          icon: <PlusOutlined />,
        },
      ],
    },
  ];

  const handleClick = ({ key }: { key: string }) => {
    navigate(key);
    setVisible(false); // ปิด Drawer เมื่อคลิกเมนูบนมือถือ
  };

  return (
    <>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fff',
          padding: '0 16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>🧱 MyConstruction</div>

        {/* Desktop Menu */}
        <div className="menu-desktop" style={{ flex: 1, justifyContent: 'flex-end',  display: 'none'}}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleClick}
          />
        </div>

        {/* Mobile Hamburger */}
        <div className="menu-mobile">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setVisible(true)}
          />
        </div>
      </Header>

      {/* Drawer for Mobile */}
      <Drawer
        title="เมนู"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleClick}
        />
      </Drawer>

      {/* Responsive CSS */}
      <style>
        {`
          @media (min-width: 768px) {
            .menu-desktop {
              display: flex !important;
            }
            .menu-mobile {
              display: none;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
