import React from "react";

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
        style={{ maxWidth: "100%", borderRadius: 4 }}
      />
    );
  }

  if (messageType === "file" && sourceFile) {
    return (
      <a
        href={`${process.env.REACT_APP_API_BASE_URL}/api/files/files/${sourceFile}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        📎 ดาวน์โหลดไฟล์
      </a>
    );
  }

  return <div>{text}</div>;
};

export default LineMessageContent;
