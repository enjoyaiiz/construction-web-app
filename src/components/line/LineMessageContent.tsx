import React from "react";
import { Card } from "antd";
import { FileOutlined } from "@ant-design/icons";

interface Props {
  messageType: string;
  sourceFile?: string;
  text?: string;
}

const LineMessageContent: React.FC<Props> = ({ messageType, sourceFile, text }) => {
  if (messageType === "image" && sourceFile) {
    return (
      <img
        src={`${process.env.REACT_APP_API_BASE_URL}/api/files/images/${sourceFile}`}
        alt="รูปจากลูกค้า"
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

  if (messageType === "file" && sourceFile) {
    return (
      <a
        href={`${process.env.REACT_APP_API_BASE_URL}/api/files/files/${sourceFile}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <Card
          size="small"
          hoverable
          bodyStyle={{
            display: "flex",          // ✅ flex container
            alignItems: "center",     // ✅ vertical align
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
            {sourceFile}
          </span>
        </Card>
      </a>
    );
  }

  return <div>{text}</div>;
};

export default LineMessageContent;
