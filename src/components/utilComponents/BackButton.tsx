import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  label?: string; // ถ้าอยากเปลี่ยนข้อความปุ่มได้
  to?: string;    // ถ้าอยากระบุ path เอง
}

const BackButton: React.FC<BackButtonProps> = ({ label = '← ย้อนกลับ', to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // กลับหน้าก่อนหน้า
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        marginBottom: 16,
        padding: '6px 12px',
        fontSize: '14px',
        cursor: 'pointer',
        borderRadius: 4,
        border: '1px solid #d9d9d9',
        background: '#fff'
      }}
    >
      {label}
    </button>
  );
};

export default BackButton;
