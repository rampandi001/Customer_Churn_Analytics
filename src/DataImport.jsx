import { useMemo, useRef, useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  Database,
  Users,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

const demoRows = [
  {
    id: "CUS-1001",
    name: "Olivia Martin",
    email: "olivia@example.com",
    plan: "Premium",
    status: "Active",
    risk: "High",
  },
  {
    id: "CUS-1002",
    name: "Jackson Lee",
    email: "jackson@example.com",
    plan: "Standard",
    status: "Active",
    risk: "Medium",
  },
  {
    id: "CUS-1003",
    name: "Isabella Chen",
    email: "isabella@example.com",
    plan: "Basic",
    status: "Active",
    risk: "Low",
  },
  {
    id: "CUS-1004",
    name: "William Kim",
    email: "william@example.com",
    plan: "Premium",
    status: "At Risk",
    risk: "High",
  },
];

export default function DataImport() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");

  const totalRows = rows.length || 24580;

  const previewRows = useMemo(() => {
    return rows.length ? rows.slice(0, 8) : demoRows;
  }, [rows]);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const validExtension =
      /\.(csv|xlsx|xls)$/i.test(selectedFile.name);

    if (!validExtension && !validTypes.includes(selectedFile.type)) {
      setMessage("Please upload a CSV, XLSX or XLS file.");
      return;
    }

    setFile(selectedFile);
    setMessage(
      `${selectedFile.name} selected successfully.`
    );

    if (
      selectedFile.type === "text/csv" ||
      /\.csv$/i.test(selectedFile.name)
    ) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = String(event.target.result || "");

        const lines = text
          .split(/\r?\n/)
          .filter((line) => line.trim());

        if (lines.length < 2) {
          setRows([]);
          return;
        }

        const headers = lines[0]
          .split(",")
          .map((header) =>
            header.trim().replace(/^"|"$/g, "")
          );

        const parsed = lines.slice(1).map((line, index) => {
          const values = line
            .split(",")
            .map((value) =>
              value.trim().replace(/^"|"$/g, "")
            );

          const row = {
            id: `ROW-${index + 1}`,
            name: "",
            email: "",
            plan: "",
            status: "",
            risk: "",
          };

          headers.forEach((header, headerIndex) => {
            const key = header.toLowerCase();

            if (
              key.includes("name") &&
              !key.includes("username")
            ) {
              row.name = values[headerIndex] || "";
            } else if (key.includes("email")) {
              row.email = values[headerIndex] || "";
            } else if (key.includes("plan")) {
              row.plan = values[headerIndex] || "";
            } else if (key.includes("status")) {
              row.status = values[headerIndex] || "";
            } else if (key.includes("risk")) {
              row.risk = values[headerIndex] || "";
            } else if (
              key === "id" ||
              key.includes("customer id")
            ) {
              row.id = values[headerIndex] || row.id;
            }
          });

          return row;
        });

        setRows(parsed);
      };

      reader.readAsText(selectedFile);
    } else {
      setRows([]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setRows([]);
    setMessage("");
  };

  const processImport = () => {
    if (!file) {
      setMessage("Select a file before importing.");
      return;
    }

    setMessage(
      `${file.name} imported successfully. ${rows.length || "Demo"} records are ready for analysis.`
    );
  };

  const downloadTemplate = () => {
    const csv = [
      "id,name,email,plan,status,risk",
      "CUS-1001,Olivia Martin,olivia@example.com,Premium,Active,High",
      "CUS-1002,Jackson Lee,jackson@example.com,Standard,Active,Medium",
      "CUS-1003,Isabella Chen,isabella@example.com,Basic,Active,Low",
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "churniq-customer-template.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-shell">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <Database size={14} />
            DATA MANAGEMENT
          </div>

          <h1>Data Import</h1>

          <p>
            Upload customer data and prepare it for churn
            analysis.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="secondary-btn"
            onClick={downloadTemplate}
          >
            <Download size={14} />
            Download Template
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={17} />
          </div>

          <span>Current Customers</span>
          <strong>24,580</strong>
          <small className="positive">
            Dataset available
          </small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileSpreadsheet size={17} />
          </div>

          <span>Supported Formats</span>
          <strong>CSV / XLSX</strong>
          <small>Excel files supported</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={17} />
          </div>

          <span>Last Import</span>
          <strong>Today</strong>
          <small className="positive">
            Successful
          </small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <RefreshCw size={17} />
          </div>

          <span>Records Ready</span>
          <strong>{totalRows.toLocaleString()}</strong>
          <small>Available for analysis</small>
        </div>
      </div>

      {/* UPLOAD CARD */}
      <div className="content-card">
        <div className="card-header">
          <div>
            <h2>Upload Customer Dataset</h2>

            <p>
              Import a CSV or Excel file containing your
              customer records.
            </p>
          </div>
        </div>

        <div
          className={`import-dropzone ${
            dragging ? "dragging" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);

            const droppedFile =
              e.dataTransfer.files?.[0];

            handleFile(droppedFile);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            hidden
            onChange={(e) =>
              handleFile(e.target.files?.[0])
            }
          />

          <div className="upload-icon">
            <Upload size={25} />
          </div>

          <h3>Drop your file here</h3>

          <p>
            or click to browse from your computer
          </p>

          <span>
            CSV, XLSX or XLS · Maximum recommended size
            25MB
          </span>
        </div>

        {file && (
          <div className="selected-file">
            <div className="selected-file-icon">
              <FileSpreadsheet size={19} />
            </div>

            <div style={{ flex: 1 }}>
              <strong>{file.name}</strong>

              <span>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>

            <button
              className="icon-btn"
              onClick={removeFile}
              title="Remove file"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}

        {message && (
          <div
            className={`import-message ${
              message.includes("successfully")
                ? "success"
                : "warning"
            }`}
          >
            {message.includes("successfully") ? (
              <CheckCircle2 size={15} />
            ) : (
              <AlertCircle size={15} />
            )}

            <span>{message}</span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 15,
          }}
        >
          <button
            className="primary-btn"
            disabled={!file}
            onClick={processImport}
          >
            <Upload size={14} />
            Import Data
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* REQUIREMENTS */}
      <div className="report-grid">
        <div className="content-card">
          <div className="card-header">
            <div>
              <h2>Required Columns</h2>
              <p>
                Recommended fields for churn analysis.
              </p>
            </div>
          </div>

          <div className="import-fields">
            <FieldItem name="Customer ID" required />
            <FieldItem name="Name" required />
            <FieldItem name="Email" required />
            <FieldItem name="Plan" />
            <FieldItem name="Status" />
            <FieldItem name="Risk" />
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <div>
              <h2>Import Process</h2>
              <p>How your data moves into ChurnIQ.</p>
            </div>
          </div>

          <div className="import-steps">
            <Step
              number="01"
              title="Upload"
              text="Choose your customer dataset."
            />

            <Step
              number="02"
              title="Validate"
              text="Check columns and records."
            />

            <Step
              number="03"
              title="Analyze"
              text="Use the data for churn analytics."
            />
          </div>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="content-card">
        <div className="card-header">
          <div>
            <h2>Data Preview</h2>
            <p>
              {rows.length
                ? `Showing ${previewRows.length} imported records.`
                : "Sample preview before importing your dataset."}
            </p>
          </div>

          <span className="soft-badge">
            {rows.length
              ? `${rows.length} records`
              : "Demo Data"}
          </span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CUSTOMER ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>PLAN</th>
                <th>STATUS</th>
                <th>RISK</th>
              </tr>
            </thead>

            <tbody>
              {previewRows.map((row, index) => (
                <tr key={`${row.id}-${index}`}>
                  <td>
                    <strong>{row.id}</strong>
                  </td>

                  <td>{row.name || "—"}</td>

                  <td>{row.email || "—"}</td>

                  <td>{row.plan || "—"}</td>

                  <td>
                    {row.status ? (
                      <span className="status-pill success">
                        {row.status}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>
                    {row.risk ? (
                      <span
                        className={`risk-badge ${row.risk.toLowerCase()}`}
                      >
                        {row.risk}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FieldItem({ name, required }) {
  return (
    <div className="import-field-item">
      <CheckCircle2 size={15} />

      <span>{name}</span>

      {required && (
        <small>Required</small>
      )}
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="import-step">
      <div className="step-number">{number}</div>

      <div>
        <strong>{title}</strong>

        <p>{text}</p>
      </div>
    </div>
  );
}