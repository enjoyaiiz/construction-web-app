import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Spin, Typography, message, Menu } from "antd";
import PageContent from "../../components/PageContent";
import ProjectForm from "../../components/projectComponents/ProjectForm";
import BackButton from '../../components/utilComponents/BackButton';
import ProjectBoqPage from "./ProjectBoqPage"; // <--- import มาใช้งาน

const { Title } = Typography;

interface ProjectData {
  id: string;
  projectName: string;
  budget?: string;
  startDate?: string;
  endDate?: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  ownerLineId?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

const ProjectDetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;
  const [form] = Form.useForm();
  const [locationValue, setLocationValue] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("detail");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!id) {
      message.warning("ไม่พบข้อมูลโครงการ");
      navigate('/projects');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects/getById`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลได้");
        const data: ProjectData = await res.json();

        form.setFieldsValue({
          projectName: data.projectName,
          budget: data.budget,
          startDate: data.startDate,
          endDate: data.endDate,
          ownerFirstName: data.ownerFirstName,
          ownerLastName: data.ownerLastName,
          ownerPhone: data.ownerPhone,
          ownerLineId: data.ownerLineId,
        });

        if (data.location) {
          setLocationValue(data.location);
        }
      } catch (error) {
        console.error(error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูลโครงการ");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, API_BASE_URL, form]);

  if (loading) {
    return (
      <PageContent maxWidth={700}>
        <Spin />
      </PageContent>
    );
  }

  return (
    <PageContent maxWidth={700}>
      <div style={{ position: "relative", marginBottom: 16, minHeight: 40 }}>
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          <BackButton />
        </div>
        <Title level={3} style={{ textAlign: "center", margin: 0 }}>
          {form.getFieldValue("projectName") || "รายละเอียดโครงการ"}
        </Title>
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[activeTab]}
        onClick={(e) => setActiveTab(e.key)}
        style={{ marginBottom: 24 }}
        items={[
          { key: "detail", label: "รายละเอียด" },
          { key: "boq", label: "BOQ" },
          { key: "contract", label: "สัญญาแจ้ง" },
          { key: "documents", label: "เอกสารอื่นๆ" },
        ]}
      />
      {activeTab === "detail" && (
        <Form form={form} layout="vertical">
          <ProjectForm
            form={form}
            location={locationValue}
            setLocation={setLocationValue}
            readOnly={true}
          />
        </Form>
      )}
      {activeTab === "boq" && <ProjectBoqPage />} {/* <-- ใช้ component ที่แยกออก */}
      {activeTab === "contract" && <div>เนื้อหาสัญญาแจ้ง</div>}
      {activeTab === "documents" && <div>เนื้อหาเอกสารอื่นๆ</div>}
    </PageContent>
  );
};

export default ProjectDetailPage;
