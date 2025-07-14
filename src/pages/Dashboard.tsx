import React from 'react';
import { Button, Typography, Layout } from 'antd';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const Dashboard: React.FC = () => {
  return (
    <Layout style={{ padding: '24px', minHeight: '100vh' }}>
      <Content>
        <Title level={2}>ระบบ IT สำหรับผู้รับเหมาก่อสร้าง</Title>
        <Paragraph>ยินดีต้อนรับสู่ระบบจัดการโครงการและเอกสารต่างๆ</Paragraph>
        <Button type="primary">เพิ่มโครงการใหม่</Button>
      </Content>
    </Layout>
  );
};

export default Dashboard;
