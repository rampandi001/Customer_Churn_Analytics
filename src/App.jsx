import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  Activity,
  Users,
  LayoutDashboard,
  BrainCircuit,
  ChartNoAxesCombined,
  UserRound,
  Lightbulb,
  FileText,
  Upload,
  ShieldCheck,
  Bell,
  Settings as SettingsIcon,
  HelpCircle,
  ClipboardList,
  Search,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Eye,
  TrendingDown,
  DollarSign,
} from "lucide-react";

import "./App.css";

/* =========================================================
   LAZY PAGE IMPORTS
========================================================= */

const CustomersPage = lazy(() =>
  import("./Customers.jsx")
);

const AnalysisPage = lazy(() =>
  import("./Analysis.jsx")
);

const SegmentationPage = lazy(() =>
  import("./Segmentation.jsx")
);

const PredictionPage = lazy(() =>
  import("./Prediction.jsx")
);

const CustomerDetails = lazy(() =>
  import("./CustomerDetails.jsx")
);

const InsightsPage = lazy(() =>
  import("./Insights.jsx")
);

const HelpSupport = lazy(() =>
  import("./HelpSupport.jsx")
);

const Notifications = lazy(() =>
  import("./Notifications.jsx")
);

const Settings = lazy(() =>
  import("./Settings.jsx")
);

const UserManagement = lazy(() =>
  import("./UserManagement.jsx")
);

const DataImport = lazy(() =>
  import("./DataImport.jsx")
);

const Reports = lazy(() =>
  import("./Reports.jsx")
);

const AuditLogs = lazy(() =>
  import("./AuditLogs.jsx")
);

const SecurityAccess = lazy(() =>
  import("./SecurityAccess.jsx")
);

/* =========================================================
   API
========================================================= */

const API_BASE_URL =
  "https://churniq-backend-0c1x.onrender.com";

/* =========================================================
   SIDEBAR
========================================================= */

const navGroups = [
  {
    label: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Customers",
        icon: Users,
      },
      {
        name: "Churn Prediction",
        icon: BrainCircuit,
      },
      {
        name: "Churn Analysis",
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        name: "Segmentation",
        icon: UserRound,
      },
      {
        name: "Retention Insights",
        icon: Lightbulb,
      },
      {
        name: "Reports",
        icon: FileText,
      },
      {
        name: "Data Import",
        icon: Upload,
      },
      {
        name: "User Management",
        icon: Users,
      },
      {
        name: "Audit Logs",
        icon: ClipboardList,
      },
      {
        name: "Security & Access",
        icon: ShieldCheck,
      },
    ],
  },
  {
    label: "PREFERENCES",
    items: [
      {
        name: "Notifications",
        icon: Bell,
      },
      {
        name: "Settings",
        icon: SettingsIcon,
      },
      {
        name: "Help & Support",
        icon: HelpCircle,
      },
    ],
  },
];

/* =========================================================
   DESCRIPTIONS
========================================================= */

const descriptions = {
  Dashboard:
    "Monitor customer behavior and churn risk across your workspace.",

  Customers:
    "Explore, search, and manage your customer records.",

  "Churn Prediction":
    "Review customer risk scores and prediction insights.",

  "Churn Analysis":
    "Understand churn patterns, trends, and contributing factors.",

  Segmentation:
    "Group customers by behavior, value, subscription, and risk.",

  "Retention Insights":
    "Discover actionable insights to improve retention.",

  Reports:
    "Review analytics reports and export business performance data.",

  "Data Import":
    "Upload customer data and review imported records.",

  "User Management":
    "Manage workspace users, roles, and access.",

  "Audit Logs":
    "Review recorded workspace activity and events.",

  "Security & Access":
    "Review security settings, roles, and access controls.",

  Notifications:
    "Review alerts and workspace updates.",

  Settings:
    "Manage your workspace, account, and preferences.",

  "Help & Support":
    "Find answers, documentation, and support resources.",

  "Customer Details":
    "Review customer information and risk profile.",
};

/* =========================================================
   ERROR FALLBACK
========================================================= */

function PageError({ page }) {
  return (
    <section className="panel page-panel">
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            margin: "0 auto 18px",
            borderRadius: 16,
            display: "grid",
            placeItems: "center",
            background: "#fff1f2",
            color: "#e11d48",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          !
        </div>

        <h2>
          Unable to load {page}
        </h2>

        <p
          style={{
            marginTop: 8,
            color: "#64748b",
          }}
        >
          This page has a component error.
          The rest of ChurnIQ is still running.
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   ERROR BOUNDARY
========================================================= */

class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.page !== this.props.page &&
      this.state.hasError
    ) {
      this.setState({
        hasError: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <PageError
          page={this.props.page}
        />
      );
    }

    return this.props.children;
  }
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardPage({
  onSelectCustomer,
}) {
  const [analytics, setAnalytics] =
    useState(null);

  const [
    dashboardCustomers,
    setDashboardCustomers,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* -------------------------------------------------------
     FETCH LIVE DATA
  ------------------------------------------------------- */

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      /* ---------------------------------------------------
         FETCH ANALYTICS
      --------------------------------------------------- */

      const analyticsResponse =
        await fetch(
          `${API_BASE_URL}/api/analytics/summary`
        );

      /* ---------------------------------------------------
         FETCH CUSTOMERS
      --------------------------------------------------- */

      const customersResponse =
        await fetch(
          `${API_BASE_URL}/api/customers`
        );

      /* ---------------------------------------------------
         CHECK RESPONSE STATUS
      --------------------------------------------------- */

      if (!analyticsResponse.ok) {
        throw new Error(
          `Analytics API returned ${analyticsResponse.status}`
        );
      }

      if (!customersResponse.ok) {
        throw new Error(
          `Customers API returned ${customersResponse.status}`
        );
      }

      /* ---------------------------------------------------
         PARSE JSON
      --------------------------------------------------- */

      const analyticsResult =
        await analyticsResponse.json();

      const customersResult =
        await customersResponse.json();

      console.log(
        "Analytics API response:",
        analyticsResult
      );

      console.log(
        "Customers API response:",
        customersResult
      );

      /* ===================================================
         NORMALIZE ANALYTICS RESPONSE
         
         Supported formats:

         1. Direct:
            {
              totalCustomers: 1,
              highRisk: 0,
              ...
            }

         2. Wrapped:
            {
              data: {
                totalCustomers: 1,
                ...
              }
            }
      =================================================== */

      const analyticsData =
        analyticsResult?.data &&
        typeof analyticsResult.data === "object" &&
        !Array.isArray(
          analyticsResult.data
        )
          ? analyticsResult.data
          : analyticsResult;

      if (
        !analyticsData ||
        typeof analyticsData !== "object" ||
        Array.isArray(analyticsData)
      ) {
        throw new Error(
          "Analytics API returned invalid data"
        );
      }

      /* ===================================================
         NORMALIZE CUSTOMERS RESPONSE
         
         Supported formats:

         1. Direct array:
            [...]

         2. Wrapped:
            { data: [...] }

         3. Wrapped:
            { customers: [...] }
      =================================================== */

      let customers = [];

      if (
        Array.isArray(
          customersResult
        )
      ) {
        customers =
          customersResult;
      } else if (
        customersResult?.data &&
        Array.isArray(
          customersResult.data
        )
      ) {
        customers =
          customersResult.data;
      } else if (
        customersResult?.customers &&
        Array.isArray(
          customersResult.customers
        )
      ) {
        customers =
          customersResult.customers;
      }

      if (!Array.isArray(customers)) {
        throw new Error(
          "Customers API returned invalid data"
        );
      }

      /* ---------------------------------------------------
         SET ANALYTICS
      --------------------------------------------------- */

      setAnalytics(
        analyticsData
      );

      /* ---------------------------------------------------
         MAP CUSTOMER DATA
      --------------------------------------------------- */

      const mappedCustomers =
        customers.map(
          (customer) => ({
            id:
              customer.customerId ||
              customer._id ||
              "-",

            mongoId:
              customer._id ||
              null,

            name:
              customer.name ||
              "Unknown Customer",

            email:
              customer.email ||
              "-",

            plan:
              customer.subscription ||
              "Unknown",

            risk:
              customer.churnStatus ||
              "Low",

            score:
              Number(
                customer.churnRisk ||
                  0
              ),

            joined:
              customer.createdAt
                ? new Date(
                    customer.createdAt
                  ).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    }
                  )
                : "-",

            revenue:
              Number(
                customer.monthlySpend ||
                  0
              ),
          })
        );

      setDashboardCustomers(
        mappedCustomers
      );

      console.log(
        "✅ Dashboard connected to backend"
      );

      console.log(
        "✅ Customers loaded:",
        mappedCustomers.length
      );
    } catch (err) {
      console.error(
        "❌ Dashboard API error:",
        err
      );

      setError(
        err.message ||
          "Unable to load dashboard data."
      );

      setAnalytics(null);
      setDashboardCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* -------------------------------------------------------
     ANALYTICS
  ------------------------------------------------------- */

  const totalCustomers =
    Number(
      analytics?.totalCustomers || 0
    );

  const highRisk =
    Number(
      analytics?.highRisk || 0
    );

  const mediumRisk =
    Number(
      analytics?.mediumRisk || 0
    );

  const lowRisk =
    Number(
      analytics?.lowRisk || 0
    );

  const highRiskRate =
    totalCustomers > 0
      ? (highRisk / totalCustomers) *
        100
      : 0;

  const retentionRate =
    Math.max(
      0,
      100 - highRiskRate
    );

  /* -------------------------------------------------------
     REVENUE AT RISK
  ------------------------------------------------------- */

  const revenueAtRisk =
    dashboardCustomers
      .filter(
        (customer) =>
          customer.risk === "High"
      )
      .reduce(
        (total, customer) =>
          total +
          Number(
            customer.revenue || 0
          ),
        0
      );

  /* -------------------------------------------------------
     METRICS
  ------------------------------------------------------- */

  const metrics = [
    {
      title: "Total Customers",
      value:
        totalCustomers.toLocaleString(),
      change: "Live data",
      icon: Users,
      color: "blue",
    },

    {
      title: "Churn Rate",
      value: `${highRiskRate.toFixed(
        2
      )}%`,
      change:
        `${highRisk} high-risk customers`,
      icon: TrendingDown,
      color: "purple",
    },

    {
      title: "Revenue at Risk",
      value: `$${revenueAtRisk.toLocaleString()}`,
      change:
        "High-risk customer revenue",
      icon: DollarSign,
      color: "orange",
    },

    {
      title: "Retention Rate",
      value: `${retentionRate.toFixed(
        2
      )}%`,
      change:
        "Based on current risk",
      icon: Activity,
      color: "green",
    },
  ];

  /* -------------------------------------------------------
     HIGH RISK CUSTOMERS
  ------------------------------------------------------- */

  const highRiskCustomers =
    [...dashboardCustomers]
      .filter(
        (customer) =>
          customer.risk === "High"
      )
      .sort(
        (a, b) =>
          b.score - a.score
      )
      .slice(0, 4);

  /* -------------------------------------------------------
     LOADING
  ------------------------------------------------------- */

  if (loading) {
    return (
      <section className="panel page-panel">
        <div
          style={{
            textAlign: "center",
            padding: "70px 20px",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              margin:
                "0 auto 16px",
              border:
                "3px solid #e2e8f0",
              borderTopColor:
                "#6366f1",
              borderRadius: "50%",
              animation:
                "churnSpin 0.8s linear infinite",
            }}
          />

          <strong>
            Loading Dashboard...
          </strong>

          <p
            style={{
              color: "#64748b",
              marginTop: 8,
            }}
          >
            Fetching live customer
            analytics.
          </p>
        </div>
      </section>
    );
  }

  /* -------------------------------------------------------
     DASHBOARD UI
  ------------------------------------------------------- */

  return (
    <>
      {error && (
        <div
          style={{
            marginBottom: 18,
            padding: "14px 16px",
            borderRadius: 10,
            background: "#fff1f2",
            color: "#be123c",
            border:
              "1px solid #fecdd3",
            fontSize: 13,
          }}
        >
          <strong>
            Dashboard API Error
          </strong>

          <div
            style={{
              marginTop: 4,
            }}
          >
            {error}
          </div>

          <button
            type="button"
            onClick={
              fetchDashboardData
            }
            style={{
              marginTop: 10,
              border: "none",
              borderRadius: 7,
              padding:
                "7px 12px",
              cursor: "pointer",
              background:
                "#be123c",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* METRICS */}

      <section className="metric-grid">
        {metrics.map((item) => {
          const Icon = item.icon;

          return (
            <article
              className="metric-card"
              key={item.title}
            >
              <div className="metric-top">
                <span>
                  {item.title}
                </span>

                <div
                  className={`metric-icon ${item.color}`}
                >
                  <Icon size={19} />
                </div>
              </div>

              <h2>
                {item.value}
              </h2>

              <div className="metric-foot">
                <span className="positive">
                  {item.change}
                </span>

                <span>
                  live MongoDB data
                </span>
              </div>
            </article>
          );
        })}
      </section>

      {/* CHARTS */}

      <section className="analytics-grid">

        {/* CHURN OVERVIEW */}

        <article className="panel trend-panel">
          <div className="panel-heading">
            <div>
              <h3>
                Customer Churn Overview
              </h3>

              <p>
                Current churn risk based
                on customer records
              </p>
            </div>

            <span className="small-select">
              Live
            </span>
          </div>

          <div className="chart-legend">
            <span>
              <i className="legend-dot blue-dot" />
              High risk
            </span>

            <span>
              <i className="legend-dot gray-dot" />
              Other customers
            </span>
          </div>

          <div className="chart">
            <div className="y-labels">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            <div className="chart-area">
              {[100, 75, 50, 25, 0].map(
                (value) => (
                  <div
                    className="grid-line"
                    key={value}
                  />
                )
              )}

              <svg
                viewBox="0 0 600 220"
                preserveAspectRatio="none"
                role="img"
                aria-label="Customer churn overview"
              >
                <defs>
                  <linearGradient
                    id="churnAreaLive"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#6366f1"
                      stopOpacity=".22"
                    />

                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d={`M0 ${
                    220 -
                    highRiskRate * 1.5
                  }
                  L100 ${
                    205 -
                    highRiskRate * 1.1
                  }
                  L200 ${
                    190 -
                    highRiskRate * 1.3
                  }
                  L300 ${
                    175 -
                    highRiskRate
                  }
                  L400 ${
                    160 -
                    highRiskRate * 0.8
                  }
                  L500 ${
                    145 -
                    highRiskRate * 0.7
                  }
                  L600 ${
                    130 -
                    highRiskRate * 0.6
                  }
                  L600 220
                  L0 220 Z`}
                  fill="url(#churnAreaLive)"
                />

                <path
                  d={`M0 ${
                    220 -
                    highRiskRate * 1.5
                  }
                  L100 ${
                    205 -
                    highRiskRate * 1.1
                  }
                  L200 ${
                    190 -
                    highRiskRate * 1.3
                  }
                  L300 ${
                    175 -
                    highRiskRate
                  }
                  L400 ${
                    160 -
                    highRiskRate * 0.8
                  }
                  L500 ${
                    145 -
                    highRiskRate * 0.7
                  }
                  L600 ${
                    130 -
                    highRiskRate * 0.6
                  }`}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="x-labels">
                <span>Overview</span>
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Risk</span>
              </div>
            </div>
          </div>
        </article>

        {/* RISK DISTRIBUTION */}

        <article className="panel risk-panel">
          <div className="panel-heading">
            <div>
              <h3>
                Churn Risk Distribution
              </h3>

              <p>
                Live customer risk
                classification
              </p>
            </div>
          </div>

          <div className="donut-wrap">
            <div
              className="donut"
              style={{
                background:
                  totalCustomers === 0
                    ? "#e5e7eb"
                    : `conic-gradient(
                        #ef4444 0 ${
                          (highRisk /
                            totalCustomers) *
                          100
                        }%,
                        #f59e0b ${
                          (highRisk /
                            totalCustomers) *
                          100
                        }% ${
                          ((highRisk +
                            mediumRisk) /
                            totalCustomers) *
                          100
                        }%,
                        #10b981 ${
                          ((highRisk +
                            mediumRisk) /
                            totalCustomers) *
                          100
                        }% 100%
                      )`,
              }}
            >
              <div className="donut-center">
                <strong>
                  {totalCustomers >=
                  1000
                    ? `${(
                        totalCustomers /
                        1000
                      ).toFixed(1)}K`
                    : totalCustomers}
                </strong>

                <span>
                  Customers
                </span>
              </div>
            </div>
          </div>

          <div className="risk-legend">
            <div>
              <span>
                <i className="legend-dot red-dot" />
                High risk
              </span>

              <strong>
                {totalCustomers
                  ? (
                      (highRisk /
                        totalCustomers) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </strong>
            </div>

            <div>
              <span>
                <i className="legend-dot amber-dot" />
                Medium risk
              </span>

              <strong>
                {totalCustomers
                  ? (
                      (mediumRisk /
                        totalCustomers) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </strong>
            </div>

            <div>
              <span>
                <i className="legend-dot green-dot" />
                Low risk
              </span>

              <strong>
                {totalCustomers
                  ? (
                      (lowRisk /
                        totalCustomers) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </strong>
            </div>
          </div>
        </article>
      </section>

      {/* CUSTOMERS AT RISK */}

      <section className="panel customers-panel">
        <div className="panel-heading">
          <div>
            <h3>
              Customers at Risk
            </h3>

            <p>
              Live customers requiring
              attention
            </p>
          </div>

          <button
            className="text-button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            View all
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="table-wrap">
          {highRiskCustomers.length ===
          0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 40,
                color: "#64748b",
              }}
            >
              No high-risk customers
              found.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>PLAN</th>
                  <th>CHURN RISK</th>
                  <th>RISK SCORE</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {highRiskCustomers.map(
                  (customer) => (
                    <tr
                      key={
                        customer.mongoId ||
                        customer.id
                      }
                    >
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">
                            {customer.name
                              .split(" ")
                              .map(
                                (part) =>
                                  part[0]
                              )
                              .join("")
                              .slice(
                                0,
                                2
                              )}
                          </div>

                          <div>
                            <strong>
                              {
                                customer.name
                              }
                            </strong>

                            <small>
                              {
                                customer.email
                              }
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        {
                          customer.plan
                        }
                      </td>

                      <td>
                        <span
                          className={`risk-badge ${customer.risk.toLowerCase()}`}
                        >
                          {
                            customer.risk
                          }
                        </span>
                      </td>

                      <td>
                        <div className="score-cell">
                          <strong>
                            {
                              customer.score
                            }
                            %
                          </strong>

                          <div className="score-track">
                            <i
                              className={`score-fill ${customer.risk.toLowerCase()}`}
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    customer.score,
                                    0
                                  ),
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td>
                        <button
                          className="action-link"
                          onClick={() =>
                            onSelectCustomer(
                              customer
                            )
                          }
                        >
                          <Eye
                            size={14}
                          />
                          View
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [activePage, setActivePage] =
    useState("Dashboard");

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = useState(null);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  const navigate = (page) => {
    setActivePage(page);

    if (
      page !==
      "Customer Details"
    ) {
      setSelectedCustomer(null);
    }

    setSidebarOpen(false);
  };

  const selectCustomer = (
    customer
  ) => {
    setSelectedCustomer(customer);

    setActivePage(
      "Customer Details"
    );

    setSidebarOpen(false);
  };

  /* -------------------------------------------------------
     PAGE TITLE
  ------------------------------------------------------- */

  const pageTitle =
    activePage ===
    "Customer Details"
      ? "Customer Profile"
      : activePage ===
        "Dashboard"
        ? "Dashboard Overview"
        : activePage;

  /* -------------------------------------------------------
     ROUTING
  ------------------------------------------------------- */

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return (
          <DashboardPage
            onSelectCustomer={
              selectCustomer
            }
          />
        );

      case "Customers":
        return (
          <CustomersPage
            onSelectCustomer={
              selectCustomer
            }
          />
        );

      case "Churn Prediction":
        return <PredictionPage />;

      case "Churn Analysis":
        return <AnalysisPage />;

      case "Segmentation":
        return <SegmentationPage />;

      case "Retention Insights":
        return <InsightsPage />;

      case "Reports":
        return <Reports />;

      case "Data Import":
        return <DataImport />;

      case "User Management":
        return <UserManagement />;

      case "Audit Logs":
        return <AuditLogs />;

      case "Security & Access":
        return <SecurityAccess />;

      case "Notifications":
        return <Notifications />;

      case "Settings":
        return <Settings />;

      case "Help & Support":
        return <HelpSupport />;

      case "Customer Details":
        return (
          <CustomerDetails
            customer={
              selectedCustomer
            }
            onBack={() =>
              navigate(
                "Customers"
              )
            }
          />
        );

      default:
        return (
          <section className="panel page-panel">
            <h2>
              Page not found
            </h2>

            <button
              className="text-button"
              onClick={() =>
                navigate(
                  "Dashboard"
                )
              }
            >
              Back to Dashboard
            </button>
          </section>
        );
    }
  };

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */

  return (
    <div className="app-shell">

      {sidebarOpen && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >
        <div className="brand">
          <div className="brand-icon">
            <Activity size={23} />
          </div>

          <div className="brand-copy">
            <strong>
              ChurnIQ
            </strong>

            <span>
              ANALYTICS PLATFORM
            </span>
          </div>

          <button
            className="sidebar-close"
            aria-label="Close menu"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={19} />
          </button>
        </div>

        <button
          className="workspace"
          onClick={() =>
            navigate("Dashboard")
          }
        >
          <div className="workspace-avatar">
            C
          </div>

          <div className="workspace-text">
            <strong>
              Company Workspace
            </strong>

            <small>
              Enterprise Plan
            </small>
          </div>

          <ChevronDown
            size={15}
            className="workspace-chevron"
          />
        </button>

        <nav>
          {navGroups.map(
            (group) => (
              <section
                className="nav-group"
                key={group.label}
              >
                <p className="nav-label">
                  {group.label}
                </p>

                {group.items.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    const selected =
                      activePage ===
                        item.name ||
                      (activePage ===
                        "Customer Details" &&
                        item.name ===
                          "Customers");

                    return (
                      <button
                        className={`nav-item ${
                          selected
                            ? "active"
                            : ""
                        }`}
                        key={
                          item.name
                        }
                        onClick={() =>
                          navigate(
                            item.name
                          )
                        }
                      >
                        <Icon
                          size={18}
                        />

                        <span>
                          {
                            item.name
                          }
                        </span>
                      </button>
                    );
                  }
                )}
              </section>
            )
          )}
        </nav>

        <div className="sidebar-bottom">

          <div className="upgrade-card">
            <div className="upgrade-icon">
              <BrainCircuit
                size={20}
              />
            </div>

            <strong>
              Unlock AI Insights
            </strong>

            <p>
              Discover deeper customer
              behavior with AI-powered
              analytics.
            </p>

            <button
              onClick={() =>
                navigate(
                  "Retention Insights"
                )
              }
            >
              Explore features
              <ArrowUpRight
                size={13}
              />
            </button>
          </div>

          <div className="user-profile">
            <div className="user-avatar">
              RM
            </div>

            <div className="user-profile-info">
              <strong>
                Admin User
              </strong>

              <small>
                admin@company.com
              </small>
            </div>

            <button
              className="profile-menu"
              aria-label="Open settings"
              onClick={() =>
                navigate(
                  "Settings"
                )
              }
            >
              •••
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <main className="main-area">

        <header className="topbar">

          <div className="topbar-left">

            <button
              className="menu-button"
              aria-label="Open navigation"
              onClick={() =>
                setSidebarOpen(
                  true
                )
              }
            >
              <Menu size={20} />
            </button>

            <div className="breadcrumb">
              <span>
                ChurnIQ
              </span>

              <b>/</b>

              {pageTitle}
            </div>
          </div>

          <div className="top-actions">

            <label className="search-box top-search">
              <Search size={17} />

              <input
                placeholder="Search anything..."
                value={
                  searchText
                }
                onChange={(
                  event
                ) =>
                  setSearchText(
                    event.target
                      .value
                  )
                }
              />

              <span className="search-shortcut">
                ⌘ K
              </span>
            </label>

            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() =>
                navigate(
                  "Notifications"
                )
              }
            >
              <Bell size={19} />
              <i />
            </button>

            <button
              className="top-avatar"
              aria-label="Open user settings"
              onClick={() =>
                navigate(
                  "Settings"
                )
              }
            >
              RM
            </button>
          </div>
        </header>

        <div className="dashboard-content">

          {/* =================================================
              GLOBAL PAGE HEADER
              SHOW ONLY ON DASHBOARD
          ================================================= */}

          {activePage ===
            "Dashboard" && (
            <div className="welcome-row">

              <div>
                <p className="eyebrow">
                  CHURNIQ ANALYTICS
                  WORKSPACE
                </p>

                <h1>
                  Dashboard Overview
                </h1>

                <p className="subtitle">
                  Monitor customer behavior
                  and churn risk across your
                  workspace.
                </p>
              </div>

              <button
                className="date-button"
                type="button"
              >
                <span>
                  Last 30 days
                </span>

                <ChevronDown
                  size={13}
                />
              </button>

            </div>
          )}

          <Suspense
            fallback={
              <section className="panel page-panel">
                <div
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "60px 20px",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      margin:
                        "0 auto 16px",
                      border:
                        "3px solid #e2e8f0",
                      borderTopColor:
                        "#6366f1",
                      borderRadius:
                        "50%",
                      animation:
                        "churnSpin 0.8s linear infinite",
                    }}
                  />

                  <strong>
                    Loading{" "}
                    {pageTitle}...
                  </strong>
                </div>
              </section>
            }
          >
            <PageErrorBoundary
              page={activePage}
            >
              {renderPage()}
            </PageErrorBoundary>
          </Suspense>

          <p className="disclaimer">
            ChurnIQ · Live customer
            analytics powered by MongoDB
            Atlas.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;