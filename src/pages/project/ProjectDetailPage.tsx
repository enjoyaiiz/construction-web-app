import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Spin, Typography, message, Menu, Button, Input, Modal } from "antd";
import PageContent from "../../components/PageContent";
import ProjectForm from "../../components/projectComponents/ProjectForm";
import BackButton from '../../components/utilComponents/BackButton';
import BoqSection from "../../components/projectComponents/BoqSection";
import { BoqItem } from "../../components/projectComponents/ProjectBoqTable";

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

// section state
type BoqSectionState = {
  id: string;
  title: string;
  items: BoqItem[];
};

const ProjectDetailPage: React.FC = () => {
  const projectId = "abc123";
  const location = useLocation();
  const navigate = useNavigate();

  // dynamic section state
  const [sections, setSections] = useState<BoqSectionState[]>([
    {
      id: "1",
      title: "งานหลังคา",
      items: [
        { id: "1", description: "กระเบื้องมุงหลังคา", quantity: 100, unit: "แผ่น", unitPrice: 25, totalPrice: 2500 }
      ]
    },
    {
      id: "2",
      title: "งานโครงสร้าง",
      items: [
        { id: "2", description: "เหล็กโครงสร้าง", quantity: 50, unit: "กก.", unitPrice: 35, totalPrice: 1750 }
      ]
    }
  ]);

  // สำหรับ Modal เพิ่ม section ใหม่
  const [addModal, setAddModal] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");

  // รับ id จาก state (ที่ส่งมาจาก navigate)
  const id = location.state?.id;

  const [form] = Form.useForm();
  const [locationValue, setLocationValue] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("detail");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // ถ้าไม่มี id ให้ redirect
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

  // เพิ่ม section ใหม่
  const handleAddSection = () => {
    if (!sectionTitle.trim()) {
      message.error("กรุณากรอกชื่อหมวดงาน");
      return;
    }
    setSections(sections => [
      ...sections,
      {
        id: (Math.random() * 100000).toFixed(0),
        title: sectionTitle.trim(),
        items: []
      }
    ]);
    setAddModal(false);
    setSectionTitle("");
  };

  // อัปเดตข้อมูลแต่ละ section (เวลาลบ/เพิ่ม/แก้ไข)
  const handleSectionChange = (sectionId: string, newItems: BoqItem[]) => {
    setSections(sections =>
      sections.map(s =>
        s.id === sectionId ? { ...s, items: newItems } : s
      )
    );
  };

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

      {activeTab === "boq" && (
        <div style={{ width: "100%", margin: "auto" }}>
          {sections.map(section => (
            <BoqSection
              key={section.id}
              title={section.title}
              boqList={section.items}
              onChange={items => handleSectionChange(section.id, items)}
            />
          ))}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Button type="dashed" onClick={() => setAddModal(true)}>
              + เพิ่มหมวดงาน
            </Button>
          </div>
          <Modal
            open={addModal}
            title="เพิ่มหมวดงานใหม่"
            onOk={handleAddSection}
            onCancel={() => setAddModal(false)}
            okText="เพิ่ม"
            cancelText="ยกเลิก"
          >
            <Input
              value={sectionTitle}
              onChange={e => setSectionTitle(e.target.value)}
              placeholder="ระบุชื่อหมวดงาน เช่น งานระบบไฟฟ้า"
            />
          </Modal>
        </div>
      )}

      {activeTab === "contract" && <div>เนื้อหาสัญญาแจ้ง</div>}
      {activeTab === "documents" && <div>เนื้อหาเอกสารอื่นๆ</div>}
    </PageContent>
  );
};

export default ProjectDetailPage;
