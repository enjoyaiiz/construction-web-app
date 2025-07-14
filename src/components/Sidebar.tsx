// src/components/Sidebar.tsx
import React from 'react';
import { Menu } from 'antd';
import {
  HomeOutlined,
  DashboardOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: MenuItem[];
  selectedKey?: string;
  onSelect?: (key: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  home: <HomeOutlined />,
  dashboard: <DashboardOutlined />,
  project: <FolderOpenOutlined />,
};

const Sidebar: React.FC<SidebarProps> = ({ items, selectedKey, onSelect }) => {
  return (
    <Menu
      mode="inline"
      selectedKeys={selectedKey ? [selectedKey] : []}
      onClick={(e) => onSelect && onSelect(e.key)}
      style={{ height: '100vh' }}
      items={items.map(item => ({
        key: item.key,
        icon: item.icon || iconMap[item.key],
        label: item.label,
      }))}
    />
  );
};

export default Sidebar;
