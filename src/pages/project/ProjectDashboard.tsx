import React from 'react';
import { Table, Tag, Typography, Layout } from 'antd';

const { Title } = Typography;
const { Content } = Layout;

// 🔧 ข้อมูลตัวอย่าง
const projectData = [
  {
    key: '1',
    name: 'โครงการสร้างสำนักงาน',
    location: 'กรุงเทพฯ',
    status: 'กำลังดำเนินการ',
  },
  {
    key: '2',
    name: 'โครงการบ้านจัดสรร',
    location: 'เชียงใหม่',
    status: 'รออนุมัติ',
  },
  {
    key: '3',
    name: 'โครงการอาคารพาณิชย์',
    location: 'ขอนแก่น',
    status: 'เสร็จสิ้น',
  },
  {
    key: '4',
    name: 'โครงการถนนคอนกรีต',
    location: 'อุบลราชธานี',
    status: 'ล่าช้า',
  },
];

// 🟡 Map สีของสถานะ
const statusColorMap: Record<string, string> = {
  'รออนุมัติ': 'gold',
  'กำลังดำเนินการ': 'blue',
  'เสร็จสิ้น': 'green',
  'ล่าช้า': 'red',
};

const ProjectDashboard: React.FC = () => {
  const columns = [
    {
      title: 'ชื่อโครงการ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'สถานที่',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'สถานะโครงการ',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColorMap[status] || 'default'}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <Layout style={{ padding: '24px' }}>
      <Content>
        <Title level={3}>สรุปสถานะโครงการทั้งหมด</Title>
        <Table columns={columns} dataSource={projectData} />
      </Content>
    </Layout>
  );
};

export default ProjectDashboard;
