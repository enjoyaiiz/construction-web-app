import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Row, Col } from 'antd';
import {
  ProjectOutlined,
  FileTextOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';

import InfoCard from '../components/projectComponents/ProjectCard';

const { Content } = Layout;


const HomePage: React.FC = () => {
    const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: '100vh', padding: '40px' }}>
      <Content>
        <Row gutter={[24, 24]}>
        </Row>
      </Content>
    </Layout>
  );
};

export default HomePage;
