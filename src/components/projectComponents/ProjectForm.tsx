import React from "react";
import { Form, Input, DatePicker, Row, Col, Button } from "antd";
import MapPicker from "../utilComponents/MapPicker";

interface ProjectFormProps {
  form: any;
  location: { lat: number; lng: number } | null;
  setLocation?: (loc: { lat: number; lng: number } | null) => void;
  readOnly?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  form,
  location,
  setLocation,
  readOnly = false,
}) => {
  return (
    <>
      <Form.Item
        label="ชื่อโครงการ"
        name="projectName"
        rules={[{ required: true }]}
      >
        <Input placeholder="เช่น ก่อสร้างอาคารสำนักงาน" disabled={readOnly} />
      </Form.Item>

      <Form.Item 
        required
        label={
          readOnly
            ? "ตำแหน่งที่ตั้ง"
            : "ตำแหน่งที่ตั้ง (เลือกตำแหน่งบนแผนที่)"
        }
      >
        <MapPicker
          location={location}
          onChange={setLocation ? setLocation : () => {}}
          disabled={readOnly}
        />
        {readOnly && location && (
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <Button
              type="primary"
              href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
              target="_blank"
            >
              เปิดแผนที่ Google Maps
            </Button>
          </div>
        )}
      </Form.Item>

      <Form.Item label="งบประมาณ" name="budget">
        <Input placeholder="เช่น 2,000,000 บาท" disabled={readOnly} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="วันที่เริ่มโครงการ" name="startDate">
            <DatePicker style={{ width: "100%" }} disabled={readOnly} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="วันที่สิ้นสุดโครงการ" name="endDate">
            <DatePicker style={{ width: "100%" }} disabled={readOnly} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="ชื่อ"
            name="ownerFirstName"
            rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
          >
            <Input placeholder="ชื่อจริง" disabled={readOnly} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="สกุล"
            name="ownerLastName"
            rules={[{ required: true, message: "กรุณากรอกสกุล" }]}
          >
            <Input placeholder="นามสกุล" disabled={readOnly} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="เบอร์โทรศัพท์"
        name="ownerPhone"
        rules={[
          { required: true, message: "กรุณากรอกเบอร์โทร" },
          { pattern: /^0[0-9]{9}$/, message: "รูปแบบเบอร์ไม่ถูกต้อง (เช่น 0812345678)" },
        ]}
      >
        <Input placeholder="เช่น 0812345678" disabled={readOnly} />
      </Form.Item>

      <Form.Item
        label="LINE ID"
        name="ownerLineId"
        rules={[
          { pattern: /^[a-zA-Z0-9._-]{3,20}$/, message: "กรุณากรอก LINE ID ให้ถูกต้อง" },
        ]}
      >
        <Input placeholder="เช่น your_line_id" disabled={readOnly} />
      </Form.Item>
    </>
  );
};

export default ProjectForm;
