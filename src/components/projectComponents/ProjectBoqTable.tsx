import React, { useEffect, useState } from "react";
import { Table, Spin, message, Button, Input, InputNumber, Popconfirm } from "antd";

export interface BoqItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface ProjectBoqTableProps {
  projectId?: string;
  mockData?: BoqItem[];
  onBoqListChange?: (list: BoqItem[]) => void;
  hideExportPdf?: boolean;
}

const addRowKey = "__add__";

const ProjectBoqTable: React.FC<ProjectBoqTableProps> = ({
  projectId = "",
  mockData,
  onBoqListChange,
  hideExportPdf,
}) => {
  const [loading, setLoading] = useState(false);
  const [boqList, setBoqList] = useState<BoqItem[]>(mockData ?? []);
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState<Partial<BoqItem>>({});
  const [mode, setMode] = useState<"view" | "edit">("view");

  useEffect(() => {
    if (mockData) {
      setBoqList(mockData);
      setLoading(false);
      return;
    }
    // ...ถ้ามีการ fetch จาก api สามารถเติมตรงนี้
  }, [mockData, projectId]);

  // Export PDF (เลือกเปิด/ปิดปุ่มได้)
  const handlePrintPDF = () => {
    import("jspdf").then(jsPDFModule => {
      import("jspdf-autotable").then(autoTableModule => {
        const jsPDF = jsPDFModule.default;
        const autoTable = autoTableModule.default;
        const doc = new jsPDF();
        doc.text("BOQ โครงการ", 14, 18);
        const head = [
          ["ลำดับ", "รายการ", "จำนวน", "หน่วย", "ราคา/หน่วย", "ราคารวม"],
        ];
        const data = boqList.map((item, idx) => [
          idx + 1,
          item.description,
          item.quantity,
          item.unit,
          item.unitPrice?.toLocaleString(),
          item.totalPrice?.toLocaleString(),
        ]);
        autoTable(doc, {
          head,
          body: data,
          startY: 25,
          styles: { fontSize: 14 },
          headStyles: { fillColor: [22, 160, 133] },
          theme: "grid",
          columnStyles: {
            2: { halign: "right" },
            4: { halign: "right" },
            5: { halign: "right" },
          },
        });
        doc.save("project-boq.pdf");
      });
    });
  };

  const tableData =
    mode === "edit"
      ? [...boqList, { id: addRowKey } as BoqItem]
      : boqList;

  const handleDelete = (id: string) => {
    const newList = boqList.filter(item => item.id !== id);
    setBoqList(newList);
    onBoqListChange?.(newList);
    message.success("ลบรายการแล้ว");
  };

  function handleAddClick() {
    setAdding(true);
    setNewRow({});
  }

  function handleSave() {
    const { description, quantity, unit, unitPrice } = newRow;
    if (
      !description ||
      !unit ||
      typeof quantity !== "number" ||
      typeof unitPrice !== "number"
    ) {
      message.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    const totalPrice = quantity * unitPrice;
    const newList = [
      ...boqList,
      {
        id: (Math.random() * 100000).toFixed(0),
        description,
        quantity,
        unit,
        unitPrice,
        totalPrice,
      },
    ];
    setBoqList(newList);
    onBoqListChange?.(newList);
    setAdding(false);
    setNewRow({});
    message.success("เพิ่มรายการสำเร็จ");
  }

  function handleCancel() {
    setAdding(false);
    setNewRow({});
  }

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (_: any, record: BoqItem, idx: number) =>
        record.id === addRowKey ? null : idx + 1,
    },
    {
      title: "รายการ",
      dataIndex: "description",
      key: "description",
      width: 220,
      render: (val: any, record: BoqItem) =>
        mode === "edit" && record.id === addRowKey && adding ? (
          <Input
            value={newRow.description}
            onChange={(e) =>
              setNewRow((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="กรอกชื่อรายการ"
            autoFocus
          />
        ) : record.id === addRowKey ? null : val,
    },
    {
      title: "จำนวน",
      dataIndex: "quantity",
      key: "quantity",
      width: 90,
      align: "right" as const,
      render: (val: any, record: BoqItem) =>
        mode === "edit" && record.id === addRowKey && adding ? (
          <InputNumber
            value={newRow.quantity}
            min={1}
            style={{ width: "100%" }}
            onChange={(v) =>
              setNewRow((prev) => ({ ...prev, quantity: v as number }))
            }
            placeholder="จำนวน"
          />
        ) : record.id === addRowKey ? null : val,
    },
    {
      title: "หน่วย",
      dataIndex: "unit",
      key: "unit",
      width: 80,
      render: (val: any, record: BoqItem) =>
        mode === "edit" && record.id === addRowKey && adding ? (
          <Input
            value={newRow.unit}
            onChange={(e) =>
              setNewRow((prev) => ({ ...prev, unit: e.target.value }))
            }
            placeholder="หน่วย"
          />
        ) : record.id === addRowKey ? null : val,
    },
    {
      title: "ราคา/หน่วย",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 100,
      align: "right" as const,
      render: (val: any, record: BoqItem) =>
        mode === "edit" && record.id === addRowKey && adding ? (
          <InputNumber
            value={newRow.unitPrice}
            min={0}
            style={{ width: "100%" }}
            onChange={(v) =>
              setNewRow((prev) => ({ ...prev, unitPrice: v as number }))
            }
            placeholder="ราคาต่อหน่วย"
          />
        ) : record.id === addRowKey ? null : val?.toLocaleString(),
    },
    {
      title: "ราคารวม",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 110,
      align: "right" as const,
      render: (_: any, record: BoqItem) =>
        mode === "edit" && record.id === addRowKey && adding
          ? typeof newRow.quantity === "number" &&
            typeof newRow.unitPrice === "number"
            ? (newRow.quantity * newRow.unitPrice).toLocaleString()
            : "-"
          : record.id === addRowKey
          ? null
          : _.toLocaleString(),
    },
    {
      title: "",
      key: "actions",
      align: "center" as const,
      width: 110,
      render: (_: any, record: BoqItem) =>
        mode === "edit"
          ? record.id === addRowKey && adding ? (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                <Button type="primary" size="small" onClick={handleSave}>
                  บันทึก
                </Button>
                <Button size="small" onClick={handleCancel}>
                  ยกเลิก
                </Button>
              </div>
            ) : record.id === addRowKey ? (
              <Button type="dashed" onClick={handleAddClick} block>
                + เพิ่มรายการ BOQ
              </Button>
            ) : (
              <Popconfirm
                title="ยืนยันการลบรายการนี้?"
                onConfirm={() => handleDelete(record.id)}
                okText="ลบ"
                cancelText="ยกเลิก"
              >
                <Button danger size="small">
                  ลบ
                </Button>
              </Popconfirm>
            )
          : null,
    },
  ];

  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 8,
          margin: "18px 0",
        }}
      >
        {!hideExportPdf && (
          <Button onClick={handlePrintPDF}>Export PDF</Button>
        )}
        <Button
          type={mode === "edit" ? "primary" : "default"}
          onClick={() => setMode(mode === "edit" ? "view" : "edit")}
        >
          {mode === "edit" ? "โหมดดูข้อมูล" : "โหมดแก้ไข"}
        </Button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: "ไม่มีข้อมูล",
          }}
          scroll={{ x: "max-content" }}
        />
      )}
    </div>
  );
};

export default ProjectBoqTable;
