import { useState } from "react";
import {
  FileText,
  Download,
  TrendingDown,
  Users,
  DollarSign,
  AlertTriangle,
  Calendar,
  BarChart3,
} from "lucide-react";

const monthlyData = [
  { month: "Jan", churn: 8.4 },
  { month: "Feb", churn: 7.8 },
  { month: "Mar", churn: 7.1 },
  { month: "Apr", churn: 6.8 },
  { month: "May", churn: 6.4 },
  { month: "Jun", churn: 5.9 },
  { month: "Jul", churn: 5.6 },
  { month: "Aug", churn: 5.2 },
  { month: "Sep", churn: 4.9 },
  { month: "Oct", churn: 4.7 },
  { month: "Nov", churn: 4.5 },
  { month: "Dec", churn: 4.2 },
];

const contracts = [
  ["Monthly", 8.2],
  ["Quarterly", 5.9],
  ["Annual", 3.1],
];

const reasons = [
  ["Price", 32],
  ["Low Usage", 24],
  ["Support", 18],
  ["Competition", 15],
  ["Other", 11],
];

export default function Reports() {
  const [period, setPeriod] = useState("12 Months");

  const data =
    period === "3 Months"
      ? monthlyData.slice(-3)
      : period === "6 Months"
        ? monthlyData.slice(-6)
        : monthlyData;

  const exportCSV = () => {
    const csv = [
      "Month,Churn Rate",
      ...data.map((x) => `${x.month},${x.churn}%`),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "churn-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

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
          marginBottom: "24px",
        }}
      >
        <div>
          <div style={eyebrow}>
            <FileText size={15} />
            ANALYTICS REPORTING
          </div>

          <h1 style={title}>Reports</h1>

          <p style={subtitle}>
            Analyze churn performance, retention trends and customer risk.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <div style={selectBox}>
            <Calendar size={14} color="#858fa3" />

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={select}
            >
              <option>3 Months</option>
              <option>6 Months</option>
              <option>12 Months</option>
            </select>
          </div>

          <button onClick={exportCSV} style={primaryButton}>
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={statsGrid}>
        <Stat icon={TrendingDown} title="Current Churn Rate" value="4.2%" change="-1.4%" />
        <Stat icon={Users} title="Retained Customers" value="9,842" change="+8.6%" />
        <Stat icon={DollarSign} title="Revenue at Risk" value="$184.2K" change="-6.2%" />
        <Stat icon={AlertTriangle} title="High Risk Customers" value="428" change="-12.8%" />
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr .8fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <div style={card}>
          <Header
            title="Churn Trend"
            text="Monthly customer churn percentage."
            badge={period}
          />

          <div
            style={{
              height: "270px",
              display: "flex",
              alignItems: "flex-end",
              gap: "12px",
              padding: "25px 10px 25px",
              borderBottom: "1px solid #eef0f5",
            }}
          >
            {data.map((item) => {
              const height = (item.churn / 10) * 190;

              return (
                <div
                  key={item.month}
                  style={{
                    flex: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      color: "#727c91",
                      fontSize: "9px",
                    }}
                  >
                    {item.churn}%
                  </span>

                  <div
                    style={{
                      width: "100%",
                      maxWidth: "34px",
                      height: `${height}px`,
                      minHeight: "10px",
                      background:
                        "linear-gradient(180deg,#6c6ee8,#aaa9f5)",
                      borderRadius: "7px 7px 3px 3px",
                    }}
                  />

                  <span
                    style={{
                      color: "#9aa2b2",
                      fontSize: "9px",
                    }}
                  >
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={card}>
          <Header
            title="Churn by Contract"
            text="Compare customer retention by contract."
          />

          <div style={{ marginTop: "25px" }}>
            {contracts.map(([name, value]) => (
              <div key={name} style={{ marginBottom: "22px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "7px",
                  }}
                >
                  <span style={smallText}>{name}</span>
                  <strong style={{ fontSize: "10px", color: "#48536a" }}>
                    {value}%
                  </strong>
                </div>

                <div
                  style={{
                    height: "8px",
                    background: "#edf0f5",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${value * 10}%`,
                      background: "#6366d9",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <div style={card}>
          <Header
            title="Churn Reasons"
            text="Primary reasons behind customer churn."
            icon={BarChart3}
          />

          {reasons.map(([name, value]) => (
            <div key={name} style={{ marginBottom: "17px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <span style={smallText}>{name}</span>
                <strong style={{ fontSize: "10px", color: "#4b566c" }}>
                  {value}%
                </strong>
              </div>

              <div
                style={{
                  height: "7px",
                  background: "#edf0f5",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${value}%`,
                    background: "#6366d9",
                    borderRadius: "10px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={card}>
          <Header
            title="Report Library"
            text="Available analytics reports."
          />

          <ReportItem
            title="Executive Churn Summary"
            text="High-level churn and retention overview."
            onClick={exportCSV}
          />

          <ReportItem
            title="Customer Risk Report"
            text="Customers grouped by churn risk."
            onClick={exportCSV}
          />

          <ReportItem
            title="Retention Performance"
            text="Monthly retention performance."
            onClick={exportCSV}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, title, value, change }) {
  return (
    <div style={card}>
      <div style={{ padding: "16px" }}>
        <div style={statIcon}>
          <Icon size={16} />
        </div>

        <span style={smallText}>{title}</span>

        <strong
          style={{
            display: "block",
            color: "#26324c",
            fontSize: "21px",
            marginTop: "4px",
          }}
        >
          {value}
        </strong>

        <small
          style={{
            color: "#20a277",
            fontSize: "9px",
            fontWeight: 700,
          }}
        >
          {change} vs previous period
        </small>
      </div>
    </div>
  );
}

function Header({ title, text, badge, icon: Icon }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "16px",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          {Icon && <Icon size={15} color="#6366d9" />}

          <h2
            style={{
              margin: 0,
              color: "#354057",
              fontSize: "14px",
            }}
          >
            {title}
          </h2>
        </div>

        <p
          style={{
            margin: "5px 0 0",
            color: "#929aaa",
            fontSize: "10px",
          }}
        >
          {text}
        </p>
      </div>

      {badge && (
        <span
          style={{
            background: "#f1f2fb",
            color: "#6569bd",
            borderRadius: "6px",
            padding: "6px 9px",
            fontSize: "9px",
            fontWeight: 700,
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function ReportItem({ title, text, onClick }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "14px 0",
        borderBottom: "1px solid #edf0f5",
      }}
    >
      <div style={fileIcon}>
        <FileText size={15} />
      </div>

      <div style={{ flex: 1 }}>
        <strong
          style={{
            display: "block",
            color: "#3d475e",
            fontSize: "10px",
          }}
        >
          {title}
        </strong>

        <span
          style={{
            color: "#959dad",
            fontSize: "9px",
          }}
        >
          {text}
        </span>
      </div>

      <button
        onClick={onClick}
        style={{
          width: "30px",
          height: "30px",
          border: "1px solid #e4e7ee",
          background: "#fff",
          borderRadius: "7px",
          color: "#6366d9",
          cursor: "pointer",
        }}
      >
        <Download size={13} />
      </button>
    </div>
  );
}

const card = {
  background: "#fff",
  border: "1px solid #e6e9f1",
  borderRadius: "15px",
  boxShadow: "0 5px 18px rgba(30,40,80,.04)",
};

const eyebrow = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
  color: "#6366d9",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "1px",
};

const title = {
  margin: "6px 0 0",
  color: "#19243e",
  fontSize: "28px",
};

const subtitle = {
  margin: "7px 0 0",
  color: "#8790a4",
  fontSize: "13px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "14px",
  marginBottom: "18px",
};

const statIcon = {
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  background: "#f0efff",
  color: "#6366d9",
  display: "grid",
  placeItems: "center",
  marginBottom: "9px",
};

const smallText = {
  color: "#8c95a8",
  fontSize: "10px",
};

const primaryButton = {
  border: 0,
  background: "#6366d9",
  color: "#fff",
  borderRadius: "8px",
  padding: "10px 13px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "10px",
  fontWeight: 700,
  cursor: "pointer",
};

const selectBox = {
  height: "35px",
  border: "1px solid #e1e5ed",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "0 9px",
  background: "#fff",
};

const select = {
  border: 0,
  outline: 0,
  color: "#687389",
  fontSize: "10px",
  background: "#fff",
};

const fileIcon = {
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  background: "#f0efff",
  color: "#6366d9",
  display: "grid",
  placeItems: "center",
};