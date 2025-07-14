import React, { useState } from "react";
import { Form, Button, Typography, message } from "antd";
import PageContent from "../../components/PageContent";
import ProjectForm from "../../components/projectComponents/ProjectForm";

const { Title } = Typography;

const ProjectFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const onFinish = async (values: any) => {
    if (!location) {
      message.warning("กรุณาเลือกตำแหน่งที่ตั้งบนแผนที่");
      return;
    }
    const dataToSave = { ...values, location, status: "open" };
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        //message.success("บันทึกข้อมูลโครงการเรียบร้อยแล้ว!", 1.5);
        alert("บันทึกข้อมูลโครงการเรียบร้อยแล้ว!");
        form.resetFields();
        setLocation(null);
      } else {
        const errorData = await response.json();
        alert(`เกิดข้อผิดพลาด: ${errorData.message}`);
        message.error(`เกิดข้อผิดพลาด: ${errorData.message}`);
      }
    } catch (error) {
      message.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContent maxWidth={700}>
      <Title level={3}>ฟอร์มกรอกข้อมูลโครงการ</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: 24 }}
      >
        <ProjectForm
          form={form}
          location={location}
          setLocation={setLocation}
          readOnly={false}
        />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!location}
            loading={isSubmitting}
            block
          >
            บันทึกโครงการ
          </Button>
        </Form.Item>
      </Form>
    </PageContent>
  );
};

export default ProjectFormPage;
