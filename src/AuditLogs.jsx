import { useMemo, useState } from "react";
import {
  ClipboardList,
  Search,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  User,
  Shield,
  Settings,
  Database,
  LogIn,
} from "lucide-react";

const initialLogs = [
  {
    id: "LOG-1001",
    action: "User signed in",
    category: "Authentication",
    user: "Admin User",
    role: "Administrator",
    status: "Success",
    time: "2026-10-05 09:42",
    ip: "192.168.1.20",
    description: "Successful administrator login.",
  },
  {
    id: "LOG-1002",
    action: "Settings updated",
    category: "Settings",
    user: "Admin User",
    role: "Administrator",
    status: "Success",
    time: "2026-10-05 09:18",
    ip: "192.168.1.20",
    description: "Workspace preferences were updated.",
  },
  {
    id: "LOG-1003",
    action: "Customer data imported",
    category: "Data",
    user: "Data Analyst",
    role: "Analyst",
    status: "Success",
    time: "2026-10-05 08:51",
    ip: "192.168.1.31",
    description: "Customer dataset import completed.",
  },
  {
    id: "LOG-1004",
    action: "Failed login attempt",
    category: "Authentication",
    user: "Unknown User",
    role: "Unknown",
    status: "Failed",
    time: "2026-10-04 22:14",
    ip: "192.168.1.55",
    description: "Invalid credentials were provided.",
  },
  {
    id: "LOG-1005",
    action: "Security policy reviewed",
    category: "Security",
    user: "Admin User",
    role: "Administrator",
    status: "Success",
    time: "2026-10-04 17:26",
    ip: "192.168.1.20",
    description: "Security and access policy was reviewed.",
  },
  {
    id: "LOG-1006",
    action: "Report exported",
    category: "Reports",
    user: "Data Analyst",
    role: "Analyst",
    status: "Success",
    time: "2026-10-04 15:40",
    ip: "192.168.1.31",
    description: "Churn analytics report exported.",
  },
];

export default function AuditLogs() {
  const [logs, setLogs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = `${log.id} ${log.action} ${log.user} ${log.ip}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || log.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [logs, search, category]);

  const exportLogs = () => {
    const csv = [
      "ID,Action,Category,User,Role,Status,Time,IP",
      ...filtered.map(
        (l) =>
          `"${l.id}","${l.action}","${l.category}","${l.user}","${l.role}","${l.status}","${l.time}","${l.ip}"`
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "churniq-audit-logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const success = logs.filter((l) => l.status === "Success").length;
  const failed = logs.filter((l) => l.status === "Failed").length;

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        paddingBottom: "40px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "25px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              color: "#6366d9",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              marginBottom: "7px",
            }}
          >
            <ClipboardList size={15} />
            SECURITY MONITORING
          </div>

          <h1
            style={{
              margin: 0,
              color: "#19243e",
              fontSize: "28px",
            }}
          >
            Audit Logs
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#8790a4",
              fontSize: "13px",
            }}
          >
            Review recorded workspace activity and security events.
          </p>
        </div>

        <button
          onClick={exportLogs}
          style={{
            border: 0,
            background: "#6366d9",
            color: "#fff",
            borderRadius: "9px",
            padding: "10px 14px",
            display: "flex",
            gap: "7px",
            alignItems: "center",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Download size={14} />
          Export Logs
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        <AuditStat
          icon={ClipboardList}
          title="Total Events"
          value={logs.length}
        />

        <AuditStat
          icon={CheckCircle2}
          title="Successful"
          value={success}
        />

        <AuditStat
          icon={XCircle}
          title="Failed"
          value={failed}
        />

        <AuditStat
          icon={Shield}
          title="Security Status"
          value="Good"
        />
      </div>

      {/* Main */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e6e9f1",
          borderRadius: "15px",
          boxShadow: "0 5px 18px rgba(30,40,80,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            padding: "15px",
            borderBottom: "1px solid #edf0f5",
            display: "flex",
            gap: "10px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "38px",
              border: "1px solid #e1e5ed",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0 11px",
            }}
          >
            <Search size={15} color="#9aa2b3" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logs..."
              style={{
                border: 0,
                outline: 0,
                width: "100%",
                fontSize: "11px",
              }}
            />
          </div>

          <div
            style={{
              height: "38px",
              border: "1px solid #e1e5ed",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "0 10px",
            }}
          >
            <Filter size={14} color="#8f98aa" />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                border: 0,
                outline: 0,
                color: "#5e687d",
                fontSize: "11px",
              }}
            >
              <option>All</option>
              <option>Authentication</option>
              <option>Settings</option>
              <option>Data</option>
              <option>Security</option>
              <option>Reports</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "780px",
            }}
          >
            <thead>
              <tr style={{ background: "#f8f9fc" }}>
                {[
                  "EVENT",
                  "CATEGORY",
                  "USER",
                  "STATUS",
                  "TIME",
                  "IP ADDRESS",
                  "",
                ].map((item) => (
                  <th
                    key={item}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      color: "#929aaa",
                      fontSize: "9px",
                      fontWeight: 800,
                      letterSpacing: ".5px",
                    }}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td style={td}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <EventIcon category={log.category} />

                      <div>
                        <strong
                          style={{
                            display: "block",
                            color: "#354057",
                            fontSize: "11px",
                          }}
                        >
                          {log.action}
                        </strong>

                        <span
                          style={{
                            color: "#9aa2b2",
                            fontSize: "9px",
                          }}
                        >
                          {log.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td style={td}>
                    <span
                      style={{
                        background: "#f1f2fb",
                        color: "#6569bd",
                        borderRadius: "5px",
                        padding: "5px 8px",
                        fontSize: "9px",
                        fontWeight: 700,
                      }}
                    >
                      {log.category}
                    </span>
                  </td>

                  <td style={td}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                      }}
                    >
                      <div
                        style={{
                          width: "27px",
                          height: "27px",
                          borderRadius: "50%",
                          background: "#ecebff",
                          color: "#6266d4",
                          display: "grid",
                          placeItems: "center",
                          fontSize: "9px",
                          fontWeight: 800,
                        }}
                      >
                        {log.user
                          .split(" ")
                          .map((x) => x[0])
                          .join("")}
                      </div>

                      <div>
                        <strong
                          style={{
                            display: "block",
                            color: "#48536a",
                            fontSize: "10px",
                          }}
                        >
                          {log.user}
                        </strong>

                        <span
                          style={{
                            color: "#9aa2b2",
                            fontSize: "9px",
                          }}
                        >
                          {log.role}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td style={td}>
                    <Status status={log.status} />
                  </td>

                  <td style={{ ...td, color: "#778197" }}>
                    {log.time}
                  </td>

                  <td style={{ ...td, color: "#778197" }}>
                    {log.ip}
                  </td>

                  <td style={td}>
                    <button
                      onClick={() => setSelected(log)}
                      style={{
                        width: "30px",
                        height: "30px",
                        border: "1px solid #e5e8ef",
                        background: "#fff",
                        borderRadius: "7px",
                        color: "#747e93",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#929aaa",
              fontSize: "12px",
            }}
          >
            No audit events found.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,.35)",
            display: "grid",
            placeItems: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(500px,100%)",
              background: "#fff",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 25px 70px rgba(0,0,0,.2)",
            }}
          >
            <h2
              style={{
                margin: "0 0 6px",
                color: "#26324d",
                fontSize: "18px",
              }}
            >
              Event Details
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                color: "#8c95a8",
                fontSize: "11px",
              }}
            >
              {selected.id}
            </p>

            <Detail label="Action" value={selected.action} />
            <Detail label="Category" value={selected.category} />
            <Detail label="User" value={selected.user} />
            <Detail label="Role" value={selected.role} />
            <Detail label="Status" value={selected.status} />
            <Detail label="Time" value={selected.time} />
            <Detail label="IP Address" value={selected.ip} />
            <Detail label="Description" value={selected.description} />

            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: "18px",
                width: "100%",
                height: "38px",
                border: 0,
                background: "#6366d9",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AuditStat({ icon: Icon, title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e6e9f1",
        borderRadius: "13px",
        padding: "16px",
        boxShadow: "0 5px 18px rgba(30,40,80,.04)",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          background: "#f0efff",
          color: "#6366d9",
          display: "grid",
          placeItems: "center",
          marginBottom: "10px",
        }}
      >
        <Icon size={16} />
      </div>

      <span
        style={{
          display: "block",
          color: "#8c95a8",
          fontSize: "10px",
        }}
      >
        {title}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: "4px",
          color: "#27334e",
          fontSize: "20px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function EventIcon({ category }) {
  const Icon =
    category === "Authentication"
      ? LogIn
      : category === "Security"
        ? Shield
        : category === "Data"
          ? Database
          : category === "Settings"
            ? Settings
            : ClipboardList;

  return (
    <div
      style={{
        width: "31px",
        height: "31px",
        borderRadius: "8px",
        background: "#f1f2ff",
        color: "#6366d9",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Icon size={14} />
    </div>
  );
}

function Status({ status }) {
  const success = status === "Success";
  const failed = status === "Failed";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "5px 8px",
        borderRadius: "20px",
        background: success ? "#ecfaf4" : "#fff1f2",
        color: success ? "#21956c" : "#e05262",
        fontSize: "9px",
        fontWeight: 800,
      }}
    >
      {success ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
      {status}
    </span>
  );
}

function Detail({ label, value }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "110px 1fr",
        gap: "10px",
        padding: "9px 0",
        borderBottom: "1px solid #edf0f5",
      }}
    >
      <span
        style={{
          color: "#929aaa",
          fontSize: "10px",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: "#46516a",
          fontSize: "10px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

const td = {
  padding: "13px 14px",
  borderTop: "1px solid #eef0f4",
  fontSize: "10px",
  whiteSpace: "nowrap",
};