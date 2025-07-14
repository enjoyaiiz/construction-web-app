// src/pages/Project.tsx
import React, { useState } from 'react';
import { Tabs, Input, Button, List, Form, message } from 'antd';
import Sidebar from '../components/Sidebar';
import {
  FolderAddOutlined,
  SearchOutlined
} from '@ant-design/icons';
const { TabPane } = Tabs;

const Project: React.FC = () => {
  const [projects, setProjects] = useState<string[]>(['Project A', 'Project B']);
  const [searchTerm, setSearchTerm] = useState('');
  const [form] = Form.useForm();

  const filteredProjects = projects.filter((p) =>
    p.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onAddProject = (values: { name: string }) => {
    if (projects.includes(values.name)) {
      message.error('Project นี้มีอยู่แล้ว');
      return;
    }
    setProjects([...projects, values.name]);
    message.success('เพิ่ม Project เรียบร้อย');
    form.resetFields();
  };
  const menuItems = [
    { key: '/', icon: <SearchOutlined />, label: 'ค้นหาโครงการ' },
    { key: '/', icon: <FolderAddOutlined />, label: 'เพิ่มข้อมูลโครงการ' }
  ];
  return (
    <Sidebar items={menuItems} />
  );
};

export default Project;
