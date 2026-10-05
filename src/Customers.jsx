import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Download,
  UserPlus,
  Users,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import AddCustomer from "./AddCustomer";

const API_URL = "http://localhost:5000/api/customers";

export default function Customers({ onSelectCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // FETCH CUSTOMERS
  // =========================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const result = await response.json();

      const formattedCustomers = (result.data || []).map(
        (customer) => ({
          id: customer.customerId,
          mongoId: customer._id,

          name: customer.name || "Unknown",
          email: customer.email || "-",

          plan: customer.subscription || "Basic",

          status:
            customer.churnStatus === "High"
              ? "At Risk"
              : "Active",

          risk: customer.churnStatus || "Low",

          score: customer.churnRisk ?? 0,

          joined: customer.createdAt
            ? new Date(
                customer.createdAt
              ).toLocaleDateString()
            : "-",

          revenue:
            customer.monthlySpend !== undefined
              ? `$${Number(
                  customer.monthlySpend
                ).toLocaleString()}`
              : "$0",

          age: customer.age,
          gender: customer.gender,
          location: customer.location,
          monthlySpend: customer.monthlySpend,
          tenure: customer.tenure,
        })
      );

      setCustomers(formattedCustomers);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load customers. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =========================
  // DELETE CUSTOMER
  // =========================

  const handleDelete = async (customer) => {
    if (!customer.mongoId) {
      alert("MongoDB customer ID not found.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer.name} (${customer.id})?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(customer.mongoId);
      setError("");

      const response = await fetch(
        `${API_URL}/${customer.mongoId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete customer"
        );
      }

      // Remove deleted customer immediately
      setCustomers((prev) =>
        prev.filter(
          (item) =>
            item.mongoId !== customer.mongoId
        )
      );

      alert(
        "Customer deleted successfully!"
      );
    } catch (err) {
      console.error(
        "❌ Delete customer error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete customer"
      );

      alert(
        `Failed to delete customer: ${err.message}`
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // FILTER CUSTOMERS
  // =========================

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        customer.name
          .toLowerCase()
          .includes(search) ||
        customer.email
          .toLowerCase()
          .includes(search) ||
        customer.id
          .toLowerCase()
          .includes(search);

      const matchesRisk =
        riskFilter === "All" ||
        customer.risk === riskFilter;

      const matchesPlan =
        planFilter === "All" ||
        customer.plan === planFilter;

      return (
        matchesSearch &&
        matchesRisk &&
        matchesPlan
      );
    });
  }, [
    customers,
    searchTerm,
    riskFilter,
    planFilter,
  ]);

  // =========================
  // STATS
  // =========================

  const totalCustomers = customers.length;

  const atRiskCustomers = customers.filter(
    (customer) =>
      customer.risk === "High"
  ).length;

  const mediumRiskCustomers = customers.filter(
    (customer) =>
      customer.risk === "Medium"
  ).length;

  const totalRevenue = customers.reduce(
    (total, customer) =>
      total +
      Number(customer.monthlySpend || 0),
    0
  );

  // =========================
  // EXPORT CSV
  // =========================

  const handleExport = () => {
    if (!filteredCustomers.length) {
      alert(
        "No customers available to export."
      );
      return;
    }

    const headers = [
      "Customer ID",
      "Name",
      "Email",
      "Plan",
      "Status",
      "Risk",
      "Risk Score",
      "Monthly Spend",
      "Joined",
    ];

    const rows = filteredCustomers.map(
      (customer) => [
        customer.id,
        customer.name,
        customer.email,
        customer.plan,
        customer.status,
        customer.risk,
        customer.score,
        customer.monthlySpend || 0,
        customer.joined,
      ]
    );

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value ?? "").replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "churniq-customers.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <RefreshCw
          size={28}
          className="spin"
        />

        <p style={{ marginTop: 12 }}>
          Loading customers...
        </p>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="customers-page">

      {/* HEADER */}

      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1>Customers</h1>

          <p>
            Manage customers and monitor
            their churn risk.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            className="secondary-btn"
            onClick={fetchCustomers}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            className="secondary-btn"
            onClick={handleExport}
          >
            <Download size={16} />
            Export
          </button>

          <button
            className="primary-btn"
            onClick={() =>
              setShowAddCustomer(true)
            }
          >
            <UserPlus size={16} />
            Add Customer
          </button>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            padding: "14px 18px",
            marginBottom: "20px",
            borderRadius: "10px",
            background: "#fff1f2",
            color: "#be123c",
          }}
        >
          {error}
        </div>
      )}

      {/* STATS */}

      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Total Customers</span>
            <h2>{totalCustomers}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>High Risk</span>
            <h2>{atRiskCustomers}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={20} />
          </div>

          <div>
            <span>Medium Risk</span>
            <h2>{mediumRiskCustomers}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={20} />
          </div>

          <div>
            <span>Monthly Revenue</span>
            <h2>
              $
              {totalRevenue.toLocaleString()}
            </h2>
          </div>
        </div>

      </div>

      {/* FILTER BAR */}

      <div
        className="customers-toolbar"
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >

        {/* SEARCH */}

        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: "240px",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform:
                "translateY(-50%)",
            }}
          />

          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding:
                "11px 12px 11px 40px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              outline: "none",
            }}
          />
        </div>

        {/* RISK FILTER */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Filter size={16} />

          <select
            value={riskFilter}
            onChange={(e) =>
              setRiskFilter(
                e.target.value
              )
            }
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border:
                "1px solid #ddd",
            }}
          >
            <option value="All">
              All Risk
            </option>

            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>
          </select>
        </div>

        {/* PLAN FILTER */}

        <select
          value={planFilter}
          onChange={(e) =>
            setPlanFilter(
              e.target.value
            )
          }
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            border:
              "1px solid #ddd",
          }}
        >
          <option value="All">
            All Plans
          </option>

          <option value="Basic">
            Basic
          </option>

          <option value="Standard">
            Standard
          </option>

          <option value="Premium">
            Premium
          </option>

          <option value="Enterprise">
            Enterprise
          </option>
        </select>

      </div>

      {/* CUSTOMER TABLE */}

      <div className="table-card">

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            className="customers-table"
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >

            <thead>
              <tr>
                <th>Customer</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Risk</th>
                <th>Risk Score</th>
                <th>Revenue</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredCustomers.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(
                  (customer) => (
                    <tr
                      key={
                        customer.mongoId ||
                        customer.id
                      }
                    >

                      {/* CUSTOMER */}

                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius:
                                "50%",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              background:
                                "#eef2ff",
                              fontWeight:
                                "600",
                            }}
                          >
                            {customer.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {customer.name}
                            </strong>

                            <div
                              style={{
                                fontSize:
                                  "12px",
                                opacity:
                                  0.65,
                              }}
                            >
                              {customer.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* PLAN */}

                      <td>
                        {customer.plan}
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={
                            customer.status ===
                            "At Risk"
                              ? "status-badge danger"
                              : "status-badge success"
                          }
                        >
                          {customer.status}
                        </span>
                      </td>

                      {/* RISK */}

                      <td>
                        <span
                          className={`risk-badge ${customer.risk.toLowerCase()}`}
                        >
                          {customer.risk}
                        </span>
                      </td>

                      {/* SCORE */}

                      <td>
                        <strong>
                          {customer.score}%
                        </strong>
                      </td>

                      {/* REVENUE */}

                      <td>
                        {customer.revenue}
                      </td>

                      {/* JOINED */}

                      <td>
                        {customer.joined}
                      </td>

                      {/* ACTION */}

                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            alignItems:
                              "center",
                          }}
                        >

                          {/* VIEW */}

                          <button
                            className="icon-btn"
                            title="View customer"
                            onClick={() =>
                              onSelectCustomer &&
                              onSelectCustomer(
                                customer
                              )
                            }
                          >
                            <Eye size={15} />
                          </button>

                          {/* DELETE */}

                          <button
                            className="icon-btn"
                            title="Delete customer"
                            onClick={() =>
                              handleDelete(
                                customer
                              )
                            }
                            disabled={
                              deletingId ===
                              customer.mongoId
                            }
                            style={{
                              color:
                                "#ef4444",
                              opacity:
                                deletingId ===
                                customer.mongoId
                                  ? 0.5
                                  : 1,
                              cursor:
                                deletingId ===
                                customer.mongoId
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            {deletingId ===
                            customer.mongoId ? (
                              <RefreshCw
                                size={15}
                                className="spin"
                              />
                            ) : (
                              <Trash2
                                size={15}
                              />
                            )}
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}

        <div
          style={{
            padding: "16px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            borderTop:
              "1px solid #eee",
          }}
        >
          <span>
            Showing{" "}
            <strong>
              {filteredCustomers.length}
            </strong>{" "}
            of{" "}
            <strong>
              {customers.length}
            </strong>{" "}
            customers
          </span>
        </div>

      </div>

      {/* ADD CUSTOMER MODAL */}

      {showAddCustomer && (
        <AddCustomer
          onClose={() =>
            setShowAddCustomer(false)
          }
          onCustomerAdded={() => {
            setShowAddCustomer(false);
            fetchCustomers();
          }}
        />
      )}

    </div>
  );
}