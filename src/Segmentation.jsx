import { useMemo, useState } from "react";
import {
  Layers3,
  Users,
  Search,
  Plus,
  Target,
  TrendingUp,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";

const segmentData = [
  {
    name: "High Risk Customers",
    description: "Customers showing strong churn signals.",
    customers: 1284,
    percentage: 5.2,
    churn: 18.6,
    revenue: "$284K",
    type: "Risk",
    tone: "danger",
  },
  {
    name: "Loyal Customers",
    description: "Long-term customers with strong engagement.",
    customers: 8642,
    percentage: 35.2,
    churn: 2.1,
    revenue: "$1.84M",
    type: "Engagement",
    tone: "success",
  },
  {
    name: "Price Sensitive",
    description: "Customers strongly affected by pricing.",
    customers: 4218,
    percentage: 17.2,
    churn: 9.8,
    revenue: "$612K",
    type: "Behavior",
    tone: "warning",
  },
  {
    name: "New Customers",
    description: "Customers within their first 90 days.",
    customers: 3684,
    percentage: 15.0,
    churn: 6.4,
    revenue: "$428K",
    type: "Lifecycle",
    tone: "purple",
  },
  {
    name: "Low Engagement",
    description: "Customers with reduced product activity.",
    customers: 2916,
    percentage: 11.9,
    churn: 12.7,
    revenue: "$391K",
    type: "Behavior",
    tone: "orange",
  },
  {
    name: "Premium Users",
    description: "High-value premium subscribers.",
    customers: 1896,
    percentage: 7.7,
    churn: 3.4,
    revenue: "$924K",
    type: "Value",
    tone: "blue",
  },
];

export default function Segmentation() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const filtered = useMemo(() => {
    return segmentData.filter((segment) => {
      const textMatch =
        segment.name.toLowerCase().includes(search.toLowerCase()) ||
        segment.description.toLowerCase().includes(search.toLowerCase());

      const typeMatch =
        type === "All" || segment.type === type;

      return textMatch && typeMatch;
    });
  }, [search, type]);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <Layers3 size={14} />
            CUSTOMER SEGMENTATION
          </div>

          <h1>Segmentation</h1>

          <p>
            Group customers by behavior, value, lifecycle and churn risk.
          </p>
        </div>

        <div className="header-actions">
          <button className="primary-btn">
            <Plus size={14} />
            Create Segment
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Layers3 size={17} />
          </div>
          <span>Active Segments</span>
          <strong>12</strong>
          <small className="positive">+3 this month</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={17} />
          </div>
          <span>Segmented Customers</span>
          <strong>24,580</strong>
          <small className="positive">100% coverage</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target size={17} />
          </div>
          <span>High Risk Customers</span>
          <strong>1,284</strong>
          <small className="negative">5.2% of customers</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={17} />
          </div>
          <span>Average Churn</span>
          <strong>8.4%</strong>
          <small className="positive">-1.2% improved</small>
        </div>
      </div>

      <div className="audit-toolbar">
        <div className="audit-search">
          <Search size={15} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search segments..."
          />
        </div>

        <select
          className="audit-filter"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Risk">Risk</option>
          <option value="Engagement">Engagement</option>
          <option value="Behavior">Behavior</option>
          <option value="Lifecycle">Lifecycle</option>
          <option value="Value">Value</option>
        </select>
      </div>

      <div className="card-grid">
        {filtered.map((segment) => (
          <article className="card" key={segment.name}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className={`segment-icon ${segment.tone}`}>
                <Users size={18} />
              </div>

              <button className="icon-btn">
                <MoreHorizontal size={16} />
              </button>
            </div>

            <h3
              style={{
                margin: "15px 0 6px",
                color: "#263550",
                fontSize: 13,
              }}
            >
              {segment.name}
            </h3>

            <p
              style={{
                margin: 0,
                color: "#8994a8",
                fontSize: 9,
                lineHeight: 1.55,
              }}
            >
              {segment.description}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginTop: 18,
                paddingTop: 15,
                borderTop: "1px solid #edf0f4",
              }}
            >
              <div>
                <span className="mini-label">CUSTOMERS</span>
                <strong className="mini-value">
                  {segment.customers.toLocaleString()}
                </strong>
              </div>

              <div>
                <span className="mini-label">CHURN RATE</span>
                <strong
                  className="mini-value"
                  style={{
                    color:
                      segment.churn >= 10
                        ? "#df5c68"
                        : "#263550",
                  }}
                >
                  {segment.churn}%
                </strong>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span className="mini-label">
                  SEGMENT SIZE
                </span>

                <strong
                  style={{
                    color: "#657188",
                    fontSize: 8,
                  }}
                >
                  {segment.percentage}%
                </strong>
              </div>

              <div className="progress-track">
                <span
                  style={{
                    width: `${Math.min(
                      segment.percentage * 2.2,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              <span className="soft-badge">
                {segment.type}
              </span>

              <button className="action-link">
                View
                <ArrowUpRight size={12} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="content-card">
          <div className="empty-state">
            No segments found.
          </div>
        </div>
      )}
    </div>
  );
}