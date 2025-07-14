import React, { useEffect, useState } from "react";
import { List, Typography, Layout, Spin, message, Card, Radio } from "antd";
import PageContent from "../components/PageContent";
import LineMessageContent from "../components/line/LineMessageContent";
const { Title } = Typography;
const { Sider, Content } = Layout;

interface LineMessage {
  _id: string;
  userId: string;
  displayName: string;
  pictureUrl?: string;
  messages: {
    text?: string;
    timestamp: string;
    isRead: boolean;
    messageType: string;      // ✅ เพิ่ม
    sourceFile?: string;      // ✅ เพิ่ม
  }[];
}


const LineMessagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [lineMessages, setLineMessages] = useState<LineMessage[]>([]);
  const [selectedUser, setSelectedUser] = useState<LineMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<"unread" | "read">("unread");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/line-messages`);
        const data: LineMessage[] = await res.json();
        console.log(data)
        setLineMessages(data);
      } catch (err) {
        message.error("โหลดข้อมูลล้มเหลว");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  return (
    <PageContent maxWidth={1200}>
      <Title level={3}>ข้อความจาก LINE</Title>

      {/* Filter */}
      <Radio.Group
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        buttonStyle="solid"
        style={{ marginBottom: 16 }}
      >
        <Radio.Button value="unread">ยังไม่ได้อ่าน</Radio.Button>
        <Radio.Button value="read">อ่านแล้ว</Radio.Button>
      </Radio.Group>

      {loading ? (
        <Spin />
      ) : (
        <Layout
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {/* Sidebar */}
          <Sider
            width={250}
            style={{
              background: "#fafafa",
              borderRight: "1px solid #eee",
              padding: "16px 0",
            }}
          >
            <List
              dataSource={lineMessages.filter((msg) => {
                const hasUnread = msg.messages.some((m) => !m.isRead);
                return statusFilter === "unread" ? hasUnread : !hasUnread;
              })}
              renderItem={(item) => {
                const hasUnread = item.messages.some((m) => !m.isRead);
                return (
                  <List.Item
                    style={{
                      cursor: "pointer",
                      padding: "12px 16px",
                      background:
                        selectedUser?._id === item._id ? "#e6f7ff" : undefined,
                    }}
                    onClick={async () => {
                      try {
                        // Mark as read
                        await fetch(`${API_BASE_URL}/api/line-messages/${item._id}/read`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                        });

                        // Update selected user state
                        const updatedUser = {
                          ...item,
                          messages: item.messages.map((m) => ({
                            ...m,
                            isRead: m.isRead,
                          })),
                        };
                        setSelectedUser(updatedUser);

                        // Update all messages state
                        setLineMessages((prev) =>
                          prev.map((msg) =>
                            msg._id === item._id
                              ? updatedUser
                              : msg
                          )
                        );
                      } catch (err) {
                        message.error("อัปเดตสถานะไม่สำเร็จ");
                      }
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <img
                          src={item.pictureUrl}
                          alt="avatar"
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      }
                      title={
                        <span style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>
                            {item.displayName}
                            {hasUnread && selectedUser?._id !== item._id && (
                            <span style={{ color: "red", marginLeft: 8 }}>●</span>
                            )}
                          </span>
                          {/* ✅ แสดงจำนวนเฉพาะเมื่อมี unread */}
                            {hasUnread && (
                                <span style={{ fontWeight: 400, fontSize: 12, color: "#999" }}>
                                ({item.messages.filter((m) => !m.isRead).length} ข้อความ)
                                </span>
                            )}

                        </span>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Sider>

          {/* Message Box */}
          <Content
            style={{
              padding: 16,
              minHeight: 400,
            }}
          >
            {selectedUser ? (
              <>
                <Title level={4}>การสนทนากับ {selectedUser.displayName}</Title>

                {(statusFilter === "unread"
                  ? selectedUser.messages.filter((m) => !m.isRead)
                  : selectedUser.messages
                ).length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#999",
                      marginTop: 50,
                    }}
                  >
                    ไม่มีข้อความที่ยังไม่ได้อ่าน
                  </div>
                ) : (
                  (statusFilter === "unread"
                    ? selectedUser.messages.filter((m) => !m.isRead)
                    : selectedUser.messages
                  ).map((msg, idx) => (
                        
                    <Card
                      key={idx}
                      style={{ marginBottom: 8, background: "#f5f5f5" }}
                    >
                      <LineMessageContent
                        messageType={msg.messageType}
                        text={msg.text}
                        sourceFile={msg.sourceFile}
                      />
                      <div
                        style={{
                          fontSize: 12,
                          color: "#999",
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleString()}
                      </div>
                    </Card>


                  ))
                )}
                                        {selectedUser && (
                        <div style={{ marginTop: 24 }}>
                            <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const input = form.elements.namedItem("reply") as HTMLInputElement;
                                const replyText = input.value.trim();
                                if (!replyText) return;

                                try {
                                await fetch(`${API_BASE_URL}/api/line-messages/${selectedUser._id}/reply`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ text: replyText }),
                                });
                                message.success("ส่งข้อความเรียบร้อยแล้ว");

                                // ล้างกล่อง
                                input.value = "";
                                } catch (err) {
                                message.error("ส่งข้อความไม่สำเร็จ");
                                }
                            }}
                            >
                            <input
                                name="reply"
                                placeholder="พิมพ์ข้อความตอบกลับ..."
                                style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: "1px solid #ddd",
                                borderRadius: 4,
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                marginTop: 8,
                                padding: "6px 12px",
                                background: "#1890ff",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                                }}
                            >
                                ส่งข้อความ
                            </button>
                            </form>
                        </div>
                        )}
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#999",
                  marginTop: 100,
                }}
              >
                เลือกผู้ติดต่อทางด้านซ้าย
              </div>
            )}
          </Content>
        </Layout>
      )}
    </PageContent>
  );
};

export default LineMessagePage;
