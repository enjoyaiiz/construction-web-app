import React from 'react';
import { Card, Tag, Button } from 'antd';
import './css/ProjectCard.css';
interface ProjectCardProps {
  title: string;
  description: string;
  ownerName: string;
  phone: string;
  lineId: string;
  status?: string;
  onClick?: () => void;
  onCancel?: () => void; // ✅ เพิ่ม prop สำหรับยกเลิก
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  ownerName,
  phone,
  lineId,
  status,
  onClick,
  onCancel,
}) => (
  <Card
    hoverable
    onClick={onClick}
    style={{ height: '100%' }}
    title={
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
          title={title}
        >
          {title}
        </div>
        {status && (
          <Tag
            color={
              status === 'open'
                ? 'green'
                : status === 'cancelled'
                ? 'red'
                : 'orange'
            }
          >
            {status.toUpperCase()}
          </Tag>
        )}
      </div>
    }
    actions={[
      <Button
        danger
        type="link"
        className="cancel-button"
        onClick={(e) => {
          // ป้องกันไม่ให้ Card ถูกคลิก
          e.stopPropagation();
          if (window.confirm('คุณต้องการยกเลิกโครงการนี้ใช่หรือไม่?')) {
            onCancel?.();
          }
        }}
      >
        ยกเลิกโครงการ
      </Button>,
    ]}
  >
    <p>
      <strong>รายละเอียด:</strong> {description}
    </p>
    <p>
      <strong>เจ้าของ:</strong> {ownerName}
    </p>
    <p>
      <strong>เบอร์โทร:</strong> {phone}
    </p>
    <p>
      <strong>LINE ID:</strong> {lineId}
    </p>
  </Card>
);

export default ProjectCard;
