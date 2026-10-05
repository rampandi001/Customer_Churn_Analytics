import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingDown,
  TrendingUp,
  Users,
  UserCheck,
  AlertTriangle,
  CalendarDays,
  RefreshCw,
  DollarSign,
} from "lucide-react";

const API_URL =
  "http://localhost:5000/api/analytics/summary";

const COLORS = [
  "#6366f1",
  "#06b6d4",
  "#f59e0b",
  "#f97316",
  "#94a3b8",
];

const cardStyle = {
  background: "var(--card-bg, #fff)",
  border: "1px solid var(--border-color, #e5e7eb)",
  borderRadius: 16,
  padding: 20,
  minWidth: 0,
};

// =========================
// METRIC CARD
// =========================
function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
  color,
}) {
  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <p
            style={{
              color:
                "var(--muted-text, #64748b)",
              margin: 0,
              fontSize: 13,
            }}
          >
            {label}
          </p>

          <h2
            style={{
              margin: "10px 0",
              fontSize: 27,
              color:
                "var(--text-color, #111827)",
            }}
          >
            {value}
          </h2>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              color: positive
                ? "#16a34a"
                : "#dc2626",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {positive ? (
              <TrendingDown size={14} />
            ) : (
              <TrendingUp size={14} />
            )}

            {change}
          </span>
        </div>

        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: `${color}18`,
            color,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

// =========================
// CHART CARD
// =========================
function ChartCard({
  title,
  subtitle,
  children,
}) {
  return (
    <section style={cardStyle}>
      <div style={{ marginBottom: 18 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 16,
            color:
              "var(--text-color, #111827)",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: "6px 0 0",
            color:
              "var(--muted-text, #64748b)",
            fontSize: 12,
          }}
        >
          {subtitle}
        </p>
      </div>

      {children}
    </section>
  );
}

// =========================
// MAIN ANALYSIS
// =========================
export default function AnalysisPage() {
  const [period, setPeriod] =
    useState("Current");

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // FETCH ANALYTICS
  // =========================
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to fetch analytics"
        );
      }

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Analytics request failed"
        );
      }

      setAnalytics(result.data);
    } catch (err) {
      console.error(
        "Analytics error:",
        err
      );

      setError(
        "Unable to load analytics data. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // =========================
  // CALCULATED DATA
  // =========================
  const totalCustomers =
    analytics?.totalCustomers || 0;

  const highRisk =
    analytics?.highRisk || 0;

  const mediumRisk =
    analytics?.mediumRisk || 0;

  const lowRisk =
    analytics?.lowRisk || 0;

  const averageChurnScore =
    analytics?.averageChurnScore || 0;

  const totalRevenue =
    analytics?.totalRevenue || 0;

  const highRiskRate =
    totalCustomers > 0
      ? (highRisk / totalCustomers) * 100
      : 0;

  const retentionRate =
    Math.max(
      0,
      100 - highRiskRate
    );

  // =========================
  // RISK DATA
  // =========================
  const riskData = useMemo(
    () => [
      {
        name: "Low Risk",
        value: lowRisk,
      },
      {
        name: "Medium Risk",
        value: mediumRisk,
      },
      {
        name: "High Risk",
        value: highRisk,
      },
    ],
    [
      lowRisk,
      mediumRisk,
      highRisk,
    ]
  );

  // =========================
  // PLAN DATA
  // =========================
  const planData = useMemo(() => {
    const breakdown =
      analytics
        ?.subscriptionBreakdown || {};

    return Object.entries(
      breakdown
    ).map(([plan, customers]) => ({
      plan,
      customers,
    }));
  }, [analytics]);

  // =========================
  // RISK BAR DATA
  // =========================
  const riskBarData = [
    {
      category: "Low",
      customers: lowRisk,
    },
    {
      category: "Medium",
      customers: mediumRisk,
    },
    {
      category: "High",
      customers: highRisk,
    },
  ];

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#64748b",
          }}
        >
          <RefreshCw
            size={30}
            className="spin"
          />

          <p
            style={{
              marginTop: 12,
            }}
          >
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div
      style={{
        display: "grid",
        gap: 22,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 25,
              color:
                "var(--text-color, #111827)",
            }}
          >
            Churn Analysis
          </h1>

          <p
            style={{
              margin:
                "7px 0 0",
              color:
                "var(--muted-text, #64748b)",
              fontSize: 13,
            }}
          >
            Analyze customer risk,
            retention and subscription
            patterns.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* PERIOD */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              border:
                "1px solid var(--border-color, #e5e7eb)",
              background:
                "var(--card-bg, #fff)",
              borderRadius: 10,
              padding:
                "8px 11px",
            }}
          >
            <CalendarDays size={16} />

            <select
              value={period}
              onChange={(e) =>
                setPeriod(
                  e.target.value
                )
              }
              style={{
                border: 0,
                outline: 0,
                background:
                  "transparent",
                color:
                  "var(--text-color, #111827)",
                fontSize: 13,
              }}
            >
              <option>
                Current
              </option>

              <option>
                30 days
              </option>

              <option>
                3 months
              </option>

              <option>
                6 months
              </option>

              <option>
                12 months
              </option>
            </select>
          </div>

          {/* REFRESH */}
          <button
            className="secondary-btn"
            onClick={
              fetchAnalytics
            }
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div
          style={{
            padding:
              "13px 16px",
            borderRadius: 10,
            background:
              "#fff1f2",
            color: "#be123c",
          }}
        >
          {error}
        </div>
      )}

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 15,
        }}
      >
        <MetricCard
          icon={Users}
          label="Total Customers"
          value={totalCustomers.toLocaleString()}
          change="Live MongoDB data"
          positive={true}
          color="#6366f1"
        />

        <MetricCard
          icon={TrendingDown}
          label="High Risk Rate"
          value={`${highRiskRate.toFixed(
            1
          )}%`}
          change={`${highRisk} high-risk customers`}
          positive={
            highRiskRate < 20
          }
          color="#ef4444"
        />

        <MetricCard
          icon={UserCheck}
          label="Retention Rate"
          value={`${retentionRate.toFixed(
            1
          )}%`}
          change="Based on current risk"
          positive={true}
          color="#10b981"
        />

        <MetricCard
          icon={AlertTriangle}
          label="At-Risk Customers"
          value={highRisk.toLocaleString()}
          change={`${mediumRisk} medium risk`}
          positive={false}
          color="#f59e0b"
        />
      </div>

      {/* ADDITIONAL SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 15,
        }}
      >
        <MetricCard
          icon={TrendingUp}
          label="Average Churn Score"
          value={`${averageChurnScore}/100`}
          change="Across all customers"
          positive={
            averageChurnScore < 50
          }
          color="#8b5cf6"
        />

        <MetricCard
          icon={DollarSign}
          label="Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="Total customer spend"
          positive={true}
          color="#06b6d4"
        />
      </div>

      {/* CHARTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
          gap: 18,
        }}
      >
        {/* RISK DISTRIBUTION */}
        <ChartCard
          title="Customer Risk Distribution"
          subtitle="Current customer distribution by churn risk"
        >
          <div
            style={{
              width: "100%",
              height: 280,
            }}
          >
            {totalCustomers === 0 ? (
              <div
                style={{
                  height: "100%",
                  display: "grid",
                  placeItems:
                    "center",
                  color: "#94a3b8",
                }}
              >
                No customer data available.
              </div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={riskData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={58}
                    outerRadius={92}
                    paddingAngle={3}
                  >
                    {riskData.map(
                      (entry, index) => (
                        <Cell
                          key={
                            entry.name
                          }
                          fill={
                            COLORS[
                              index
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    formatter={(
                      value
                    ) => [
                      value,
                      "Customers",
                    ]}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={42}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        {/* PLAN DISTRIBUTION */}
        <ChartCard
          title="Customers by Subscription"
          subtitle="Current customer count across subscription plans"
        >
          <div
            style={{
              width: "100%",
              height: 280,
            }}
          >
            {planData.length ===
            0 ? (
              <div
                style={{
                  height: "100%",
                  display: "grid",
                  placeItems:
                    "center",
                  color: "#94a3b8",
                }}
              >
                No subscription data available.
              </div>
            ) : (
              <ResponsiveContainer>
                <BarChart
                  data={planData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="plan"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    formatter={(
                      value
                    ) => [
                      value,
                      "Customers",
                    ]}
                  />

                  <Bar
                    dataKey="customers"
                    fill="#06b6d4"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>

      {/* RISK LEVEL + RETENTION */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
          gap: 18,
        }}
      >
        {/* RISK LEVEL BAR */}
        <ChartCard
          title="Risk Level Overview"
          subtitle="Number of customers in each churn risk category"
        >
          <div
            style={{
              width: "100%",
              height: 280,
            }}
          >
            <ResponsiveContainer>
              <BarChart
                data={riskBarData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  formatter={(
                    value
                  ) => [
                    value,
                    "Customers",
                  ]}
                />

                <Bar
                  dataKey="customers"
                  fill="#6366f1"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                  maxBarSize={55}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* RETENTION SUMMARY */}
        <ChartCard
          title="Retention Performance"
          subtitle="Current retention estimate based on high-risk customers"
        >
          <div
            style={{
              height: 280,
              display: "grid",
              placeItems:
                "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 150,
                  height: 150,
                  borderRadius:
                    "50%",
                  background:
                    `conic-gradient(#10b981 ${retentionRate}%, #edf0f5 0)`,
                  display: "grid",
                  placeItems:
                    "center",
                }}
              >
                <div
                  style={{
                    width: 112,
                    height: 112,
                    borderRadius:
                      "50%",
                    background:
                      "var(--card-bg, #fff)",
                    display: "grid",
                    placeItems:
                      "center",
                  }}
                >
                  <div>
                    <strong
                      style={{
                        display:
                          "block",
                        fontSize: 28,
                        color:
                          "#1d2b46",
                      }}
                    >
                      {retentionRate.toFixed(
                        1
                      )}
                      %
                    </strong>

                    <span
                      style={{
                        color:
                          "#929caf",
                        fontSize: 10,
                      }}
                    >
                      Estimated retention
                    </span>
                  </div>
                </div>
              </div>

              <p
                style={{
                  marginTop: 16,
                  color:
                    "#64748b",
                  fontSize: 12,
                }}
              >
                Based on current
                high-risk customer
                percentage.
              </p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* KEY INSIGHT */}
      <section
        style={{
          ...cardStyle,
          borderLeft:
            "4px solid #6366f1",
        }}
      >
        <h3
          style={{
            margin:
              "0 0 8px",
            color:
              "var(--text-color, #111827)",
          }}
        >
          Key Insight
        </h3>

        {totalCustomers ===
        0 ? (
          <p
            style={{
              margin: 0,
              color:
                "var(--muted-text, #64748b)",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            Add customers to
            MongoDB to generate
            live churn insights.
          </p>
        ) : (
          <p
            style={{
              margin: 0,
              color:
                "var(--muted-text, #64748b)",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            ChurnIQ currently
            tracks{" "}
            <strong>
              {totalCustomers}
            </strong>{" "}
            customers.{" "}
            <strong>
              {highRisk}
            </strong>{" "}
            customers are classified
            as high risk and{" "}
            <strong>
              {mediumRisk}
            </strong>{" "}
            as medium risk. The
            current average churn
            score is{" "}
            <strong>
              {averageChurnScore}
            </strong>
            /100.
          </p>
        )}

        <p
          style={{
            margin:
              "10px 0 0",
            fontSize: 11,
            color:
              "var(--muted-text, #64748b)",
          }}
        >
          Data source: MongoDB Atlas
          via ChurnIQ Analytics API.
        </p>
      </section>
    </div>
  );
}