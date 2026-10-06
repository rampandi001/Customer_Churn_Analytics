import React, { useEffect, useMemo, useState } from "react";

const API_URL =
  "https://churniq-backend-0c1x.onrender.com/api/analytics/summary";

function Analysis() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Analytics API returned ${response.status}`
        );
      }

      const result = await response.json();

      console.log("Analysis API response:", result);

      /*
        Backend may return either:

        1. Direct analytics object:
        {
          totalCustomers: 1,
          highRisk: 0,
          mediumRisk: 1,
          lowRisk: 0,
          totalRevenue: 10000,
          averageChurnScore: 72,
          subscriptionBreakdown: {
            Premium: 1
          }
        }

        OR:

        2. Wrapped response:
        {
          success: true,
          data: {
            ...
          }
        }
      */

      const analyticsData =
        result?.data &&
        typeof result.data === "object" &&
        !Array.isArray(result.data)
          ? result.data
          : result;

      if (
        !analyticsData ||
        typeof analyticsData !== "object" ||
        Array.isArray(analyticsData)
      ) {
        throw new Error(
          "Analytics API returned invalid data"
        );
      }

      setAnalytics(analyticsData);
    } catch (err) {
      console.error("Analytics error:", err);

      setError(
        err.message ||
          "Unable to load analytics data."
      );

      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalCustomers = Number(
    analytics?.totalCustomers || 0
  );

  const highRisk = Number(
    analytics?.highRisk || 0
  );

  const mediumRisk = Number(
    analytics?.mediumRisk || 0
  );

  const lowRisk = Number(
    analytics?.lowRisk || 0
  );

  const averageChurnScore = Number(
    analytics?.averageChurnScore || 0
  );

  const totalRevenue = Number(
    analytics?.totalRevenue || 0
  );

  const highRiskRate =
    totalCustomers > 0
      ? (highRisk / totalCustomers) * 100
      : 0;

  const mediumRiskRate =
    totalCustomers > 0
      ? (mediumRisk / totalCustomers) * 100
      : 0;

  const lowRiskRate =
    totalCustomers > 0
      ? (lowRisk / totalCustomers) * 100
      : 0;

  const retentionRate = Math.max(
    0,
    100 - highRiskRate
  );

  const subscriptionBreakdown =
    analytics?.subscriptionBreakdown || {};

  const subscriptionData = useMemo(() => {
    return Object.entries(
      subscriptionBreakdown
    ).map(([name, count]) => ({
      name,
      count: Number(count || 0),
    }));
  }, [subscriptionBreakdown]);

  const maxSubscriptionCount = Math.max(
    ...subscriptionData.map(
      (item) => item.count
    ),
    1
  );

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
              margin: "0 auto 16px",
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
            Loading Churn Analysis...
          </strong>

          <p
            style={{
              marginTop: 8,
              color: "#64748b",
            }}
          >
            Fetching live analytics
            from MongoDB.
          </p>
        </div>
      </section>
    );
  }

  if (error) {
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
            Unable to load Churn Analysis
          </h2>

          <p
            style={{
              marginTop: 8,
              color: "#64748b",
            }}
          >
            {error}
          </p>

          <button
            type="button"
            onClick={fetchAnalytics}
            style={{
              marginTop: 18,
              border: "none",
              borderRadius: 8,
              padding: "9px 16px",
              cursor: "pointer",
              background: "#6366f1",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {/* TOP METRICS */}

      <section className="metric-grid">
        <article className="metric-card">
          <div className="metric-top">
            <span>Total Customers</span>

            <div className="metric-icon blue">
              👥
            </div>
          </div>

          <h2>
            {totalCustomers.toLocaleString()}
          </h2>

          <div className="metric-foot">
            <span className="positive">
              Live data
            </span>

            <span>MongoDB</span>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-top">
            <span>High Risk</span>

            <div className="metric-icon purple">
              ⚠
            </div>
          </div>

          <h2>
            {highRisk.toLocaleString()}
          </h2>

          <div className="metric-foot">
            <span className="positive">
              {highRiskRate.toFixed(2)}%
            </span>

            <span>of customers</span>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-top">
            <span>
              Average Churn Score
            </span>

            <div className="metric-icon orange">
              📊
            </div>
          </div>

          <h2>
            {averageChurnScore.toFixed(2)}%
          </h2>

          <div className="metric-foot">
            <span className="positive">
              Live score
            </span>

            <span>customer risk</span>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-top">
            <span>Revenue</span>

            <div className="metric-icon green">
              $
            </div>
          </div>

          <h2>
            ${totalRevenue.toLocaleString()}
          </h2>

          <div className="metric-foot">
            <span className="positive">
              Monthly spend
            </span>

            <span>live data</span>
          </div>
        </article>
      </section>

      {/* RISK ANALYSIS */}

      <section className="analytics-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h3>
                Churn Risk Distribution
              </h3>

              <p>
                Current customer risk
                classification
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAnalytics}
              className="text-button"
            >
              Refresh
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(180px, 240px) 1fr",
              gap: 30,
              alignItems: "center",
              padding: "30px 10px",
            }}
          >
            <div
              style={{
                width: 190,
                height: 190,
                margin: "auto",
                borderRadius: "50%",
                background:
                  totalCustomers === 0
                    ? "#e5e7eb"
                    : `conic-gradient(
                        #ef4444 0 ${highRiskRate}%,
                        #f59e0b ${highRiskRate}% ${
                          highRiskRate +
                          mediumRiskRate
                        }%,
                        #10b981 ${
                          highRiskRate +
                          mediumRiskRate
                        }% 100%
                      )`,
                display: "grid",
                placeItems: "center",
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <strong
                  style={{
                    fontSize: 28,
                  }}
                >
                  {totalCustomers}
                </strong>

                <span
                  style={{
                    color: "#64748b",
                    fontSize: 13,
                  }}
                >
                  Customers
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              {/* HIGH RISK */}

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom: 7,
                  }}
                >
                  <span>
                    🔴 High Risk
                  </span>

                  <strong>
                    {highRisk} (
                    {highRiskRate.toFixed(1)}
                    %)
                  </strong>
                </div>

                <div
                  style={{
                    height: 8,
                    borderRadius: 20,
                    background: "#fee2e2",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${highRiskRate}%`,
                      height: "100%",
                      background: "#ef4444",
                    }}
                  />
                </div>
              </div>

              {/* MEDIUM RISK */}

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom: 7,
                  }}
                >
                  <span>
                    🟠 Medium Risk
                  </span>

                  <strong>
                    {mediumRisk} (
                    {mediumRiskRate.toFixed(
                      1
                    )}
                    %)
                  </strong>
                </div>

                <div
                  style={{
                    height: 8,
                    borderRadius: 20,
                    background: "#fef3c7",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${mediumRiskRate}%`,
                      height: "100%",
                      background: "#f59e0b",
                    }}
                  />
                </div>
              </div>

              {/* LOW RISK */}

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom: 7,
                  }}
                >
                  <span>
                    🟢 Low Risk
                  </span>

                  <strong>
                    {lowRisk} (
                    {lowRiskRate.toFixed(1)}
                    %)
                  </strong>
                </div>

                <div
                  style={{
                    height: 8,
                    borderRadius: 20,
                    background: "#dcfce7",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${lowRiskRate}%`,
                      height: "100%",
                      background: "#10b981",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* RETENTION */}

        <article className="panel">
          <div className="panel-heading">
            <div>
              <h3>
                Retention Overview
              </h3>

              <p>
                Based on current churn
                risk
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "30px 20px",
            }}
          >
            <div
              style={{
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: `conic-gradient(
                  #10b981 0 ${retentionRate}%,
                  #e5e7eb ${retentionRate}% 100%
                )`,
                display: "grid",
                placeItems: "center",
              }}
            >
              <div
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <strong
                  style={{
                    fontSize: 27,
                  }}
                >
                  {retentionRate.toFixed(1)}%
                </strong>

                <span
                  style={{
                    color: "#64748b",
                    fontSize: 13,
                  }}
                >
                  Retention
                </span>
              </div>
            </div>

            <p
              style={{
                marginTop: 20,
                color: "#64748b",
                textAlign: "center",
                maxWidth: 280,
              }}
            >
              Current retention estimate
              based on high-risk customer
              classification.
            </p>
          </div>
        </article>
      </section>

      {/* SUBSCRIPTION ANALYSIS */}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>
              Subscription Distribution
            </h3>

            <p>
              Customers grouped by
              subscription plan
            </p>
          </div>
        </div>

        {subscriptionData.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No subscription data
            available.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              padding: "10px 4px 20px",
            }}
          >
            {subscriptionData.map(
              (item) => {
                const percentage =
                  (item.count /
                    maxSubscriptionCount) *
                  100;

                return (
                  <div
                    key={item.name}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        marginBottom: 7,
                      }}
                    >
                      <span>
                        {item.name}
                      </span>

                      <strong>
                        {item.count}
                      </strong>
                    </div>

                    <div
                      style={{
                        height: 10,
                        borderRadius: 20,
                        background: "#e2e8f0",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: "#6366f1",
                          borderRadius: 20,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>

      {/* INSIGHTS */}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>
              Live Analytics Insight
            </h3>

            <p>
              Automatically generated
              from current MongoDB data
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 14,
          }}
        >
          {/* RISK */}

          <div
            style={{
              padding: 18,
              borderRadius: 12,
              background: "#f8fafc",
            }}
          >
            <strong>Risk</strong>

            <p
              style={{
                marginTop: 8,
                color: "#64748b",
              }}
            >
              {highRiskRate.toFixed(1)}%
              of customers are currently
              classified as high risk.
            </p>
          </div>

          {/* RETENTION */}

          <div
            style={{
              padding: 18,
              borderRadius: 12,
              background: "#f8fafc",
            }}
          >
            <strong>
              Retention
            </strong>

            <p
              style={{
                marginTop: 8,
                color: "#64748b",
              }}
            >
              Estimated retention is{" "}
              {retentionRate.toFixed(1)}%
              based on current risk
              classification.
            </p>
          </div>

          {/* CHURN SCORE */}

          <div
            style={{
              padding: 18,
              borderRadius: 12,
              background: "#f8fafc",
            }}
          >
            <strong>
              Churn Score
            </strong>

            <p
              style={{
                marginTop: 8,
                color: "#64748b",
              }}
            >
              Average customer churn
              score is{" "}
              {averageChurnScore.toFixed(2)}
              %.
            </p>
          </div>

          {/* REVENUE */}

          <div
            style={{
              padding: 18,
              borderRadius: 12,
              background: "#f8fafc",
            }}
          >
            <strong>
              Revenue
            </strong>

            <p
              style={{
                marginTop: 8,
                color: "#64748b",
              }}
            >
              Current customer monthly
              spend totals $
              {totalRevenue.toLocaleString()}.
            </p>
          </div>
        </div>
      </section>

      {/* SOURCE */}

      <div
        style={{
          textAlign: "right",
          color: "#64748b",
          fontSize: 12,
        }}
      >
        Source: ChurnIQ Analytics API ·
        MongoDB Atlas
      </div>
    </div>
  );
}

export default Analysis;