import React, { useState, useEffect } from 'react';
import { Input, Typography, Row, Col, Spin, message, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import PageContent from '../../components/PageContent';
import ProjectCard from '../../components/projectComponents/ProjectCard';

const { Title } = Typography;

interface Project {
  id: number;
  projectName: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  ownerLineId: string;
  description: string;
  status?: string;
}

const ProjectSearchPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'cancelled'>('open');


  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects/`);
        if (!res.ok) throw new Error('Error fetching projects');
        const data: Project[] = await res.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        message.error('เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  const statusOrder: Record<string, number> = {
    open: 1,
    "in-progress": 2,
    cancelled: 3,
  };

  const filteredProjects = projects.filter(project =>
    (statusFilter === 'all' || project.status === statusFilter) &&
    typeof project.projectName === 'string' &&
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const orderA = statusOrder[a.status || "open"] || 99;
    const orderB = statusOrder[b.status || "open"] || 99;
    return orderA - orderB;
  });

  return (
    <PageContent maxWidth={1200}>
      <Title level={3}>ค้นหาโครงการ</Title>
      <Input.Search
        placeholder="พิมพ์ชื่อโครงการที่ต้องการค้นหา"
        allowClear
        enterButton="ค้นหา"
        size="large"
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
        disabled={loading}
      />

      {/* Status Filter */}
      <Radio.Group
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
        style={{ marginBottom: 24 }}
        buttonStyle="solid"
      >
        <Radio.Button value="all">ทั้งหมด</Radio.Button>
        <Radio.Button value="open">Open</Radio.Button>
        <Radio.Button value="in-progress">In Progress</Radio.Button>
        <Radio.Button value="cancelled">Cancelled</Radio.Button>
      </Radio.Group>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>
          ไม่พบโครงการที่ตรงกับเงื่อนไข
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredProjects.map(project => (
            <Col xs={24} sm={12} md={12} lg={8} key={project.id}>
              <ProjectCard
                title={project.projectName}
                description={project.description || '-'}
                ownerName={`${project.ownerFirstName} ${project.ownerLastName}`}
                phone={project.ownerPhone || '-'}
                lineId={project.ownerLineId || '-'}
                status={project.status || 'open'}
                onClick={() => navigate('/project/detail', { state: { id: project.id } })}
                onCancel={async () => {
                  try {
                    const res = await fetch(`${API_BASE_URL}/api/projects/${project.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'cancelled' }),
                    });
                    if (res.ok) {
                      message.success('ยกเลิกโครงการเรียบร้อยแล้ว');
                      // Refresh list
                      setProjects(prev =>
                        prev.map(p =>
                          p.id === project.id ? { ...p, status: 'cancelled' } : p
                        )
                      );
                    } else {
                      message.error('เกิดข้อผิดพลาดในการยกเลิก');
                    }
                  } catch (error) {
                    message.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
                  }
                }}
              />
            </Col>
          ))}
        </Row>
      )}
    </PageContent>
  );
};

export default ProjectSearchPage;
