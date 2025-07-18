import React, { useState } from "react";
import { Segmented, Typography } from "antd";
import ProjectBoqTable, { BoqItem } from "../components/projectComponents/ProjectBoqTable";

const { Title } = Typography;

// ตัวอย่าง mock data
const mockBoq: BoqItem[] = [
  {
    id: "1",
    description: "งานฐานราก",
    quantity: 5,
    unit: "ต้น",
    unitPrice: 8000,
    totalPrice: 40000,
  },
  {
    id: "2",
    description: "งานเสา",
    quantity: 15,
    unit: "ต้น",
    unitPrice: 2500,
    totalPrice: 37500,
  },
];

const ProjectBoqPage: React.FC = () => {
  // state สำหรับโหมด
  const [mode, setMode] = useState<"view" | "edit">("view");
  const projectId = "abc123";

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "24px 0 16px 0",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          BOQ โครงการ
        </Title>
        <Segmented
          options={[
            { label: "ดูข้อมูล", value: "view" },
            { label: "แก้ไข", value: "edit" },
          ]}
          value={mode}
          onChange={(val) => setMode(val as "view" | "edit")}
          style={{ background: "#f5f5f5" }}
        />
      </div>
    </div>
  );
};

export default ProjectBoqPage;
