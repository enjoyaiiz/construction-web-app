import React from "react";
import { Card, Typography } from "antd";
import ProjectBoqTable, { BoqItem } from "./ProjectBoqTable";

const { Title } = Typography;

interface BoqSectionProps {
  title: string;
  boqList: BoqItem[];
  onChange: (newList: BoqItem[]) => void;
}

const BoqSection: React.FC<BoqSectionProps> = ({ title, boqList, onChange }) => {
  return (
    <Card style={{ marginBottom: 32 }}>
      <Title level={4} style={{ marginBottom: 12 }}>{title}</Title>
      <ProjectBoqTable
        mockData={boqList}
        onBoqListChange={onChange}
        hideExportPdf // ซ่อนปุ่ม PDF ในแต่ละ section
      />
    </Card>
  );
};

export default BoqSection;
