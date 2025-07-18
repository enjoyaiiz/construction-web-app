import React from "react";
import { Card } from "antd";
import { FileOutlined } from "@ant-design/icons";

interface Props {
  messageType: string;
  fileUrl?: string;      // <== เปลี่ยนจาก sourceFile เป็น fileUrl
  text?: string;
}

const LineMessageContent: React.FC<Props> = ({ messageType, fileUrl, text }) => {
  // แสดงรูป (เช่น LINE image)
  if (messageType === "image" && fileUrl) {
    return (
      <img
        src={fileUrl}
        alt="แนบไฟล์"
        style={{
          maxWidth: "100%",
          height: "auto",
          borderRadius: 4,
          display: "block",
          margin: "8px 0",
        }}
      />
    );
  }

  // แสดงลิงก์ดาวน์โหลดไฟล์ (LINE file)
  if (messageType === "file" && fileUrl) {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <Card
          size="small"
          hoverable
          bodyStyle={{
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
          }}
          style={{
            width: "40%",
            minWidth: 200,
            background: "#fafafa",
            border: "1px solid #eee",
            cursor: "pointer",
          }}
        >
          <FileOutlined style={{ fontSize: 20, marginRight: 8, color: "#1890ff" }} />
          <span
            style={{
              fontWeight: 500,
              color: "#333",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
            }}
          >
            ดาวน์โหลดไฟล์
          </span>
        </Card>
      </a>
    );
  }

  // ข้อความปกติ
  return <div>{text}</div>;
};

export default LineMessageContent;
