import React, { useEffect, useState } from "react";

const API_URL =
  "https://churniq-backend-0c1x.onrender.com/api/customers";

function CustomerDetails({
  customer: customerProp,
  onBack,
}) {
  const [customer, setCustomer] =
    useState(customerProp || null);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [editMode, setEditMode] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      age: "",
      gender: "",
      location: "",
      subscription: "",
      monthlySpend: "",
      tenure: "",
      churnRisk: "",
      churnStatus: "Low",
    });

  const getMongoId = () => {
    return (
      customer?._id ||
      customer?.mongoId ||
      customerProp?._id ||
      customerProp?.mongoId ||
      null
    );
  };

  useEffect(() => {
    setCustomer(customerProp || null);
  }, [customerProp]);

  useEffect(() => {
    if (!customer) {
      return;
    }

    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      age: customer.age ?? "",
      gender: customer.gender || "",
      location: customer.location || "",
      subscription:
        customer.subscription ||
        customer.plan ||
        "",
      monthlySpend:
        customer.monthlySpend ??
        customer.revenue ??
        "",
      tenure: customer.tenure ?? "",
      churnRisk:
        customer.churnRisk ??
        customer.score ??
        "",
      churnStatus:
        customer.churnStatus ||
        customer.risk ||
        "Low",
    });
  }, [customer]);

  useEffect(() => {
    const mongoId = getMongoId();

    if (!mongoId) {
      return;
    }

    const loadCustomer = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/${mongoId}`
        );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to load customer"
          );
        }

        setCustomer(result.data);
      } catch (err) {
        console.error(
          "❌ Customer details error:",
          err
        );

        setError(
          err.message ||
            "Failed to load customer."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, []);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const mongoId = getMongoId();

    if (!mongoId) {
      setError(
        "MongoDB customer ID not found."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: formData.name,
        email: formData.email,

        age: formData.age
          ? Number(formData.age)
          : undefined,

        gender: formData.gender,

        location:
          formData.location,

        subscription:
          formData.subscription,

        monthlySpend:
          formData.monthlySpend
            ? Number(
                formData.monthlySpend
              )
            : undefined,

        tenure:
          formData.tenure
            ? Number(formData.tenure)
            : undefined,

        churnRisk:
          formData.churnRisk
            ? Number(
                formData.churnRisk
              )
            : 0,

        churnStatus:
          formData.churnStatus,
      };

      const response =
        await fetch(
          `${API_URL}/${mongoId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to update customer"
        );
      }

      setCustomer(result.data);

      setEditMode(false);

      alert(
        "Customer updated successfully!"
      );
    } catch (err) {
      console.error(
        "❌ Update customer error:",
        err
      );

      setError(
        err.message ||
          "Failed to update customer."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!customer && loading) {
    return (
      <section className="panel page-panel">
        <div
          style={{
            textAlign: "center",
            padding: 60,
          }}
        >
          Loading customer...
        </div>
      </section>
    );
  }

  if (!customer) {
    return (
      <section className="panel page-panel">
        <div
          style={{
            textAlign: "center",
            padding: 60,
          }}
        >
          <h2>
            Customer not found
          </h2>

          <button
            type="button"
            className="text-button"
            onClick={onBack}
            style={{
              marginTop: 16,
            }}
          >
            Back to Customers
          </button>
        </div>
      </section>
    );
  }

  const customerId =
    customer.customerId ||
    customer.id ||
    "-";

  const risk =
    customer.churnStatus ||
    customer.risk ||
    "Low";

  const score = Number(
    customer.churnRisk ??
      customer.score ??
      0
  );

  const initials =
    (customer.name || "Customer")
      .split(" ")
      .map(
        (part) => part[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {/* HEADER */}

      <section className="panel">
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                display: "grid",
                placeItems:
                  "center",
                background:
                  "#eef2ff",
                color: "#4f46e5",
                fontWeight: 800,
                fontSize: 20,
              }}
            >
              {initials}
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                }}
              >
                {customer.name}
              </h2>

              <p
                style={{
                  margin:
                    "5px 0 0",
                  color:
                    "#64748b",
                }}
              >
                {customer.email}
              </p>

              <small
                style={{
                  color:
                    "#94a3b8",
                }}
              >
                Customer ID:{" "}
                {customerId}
              </small>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <button
              type="button"
              className="text-button"
              onClick={onBack}
            >
              Back
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                setEditMode(
                  !editMode
                )
              }
            >
              {editMode
                ? "Cancel Edit"
                : "Edit Customer"}
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div
          style={{
            padding: "13px 16px",
            borderRadius: 10,
            background:
              "#fff1f2",
            color: "#be123c",
            border:
              "1px solid #fecdd3",
          }}
        >
          {error}
        </div>
      )}

      {/* EDIT FORM */}

      {editMode ? (
        <form
          className="panel"
          onSubmit={handleSave}
        >
          <div className="panel-heading">
            <div>
              <h3>
                Edit Customer
              </h3>

              <p>
                Update customer
                information.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 18,
            }}
          >
            <label>
              Full Name
              <input
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                required
              />
            </label>

            <label>
              Age
              <input
                type="number"
                name="age"
                value={
                  formData.age
                }
                onChange={
                  handleChange
                }
              />
            </label>

            <label>
              Gender
              <select
                name="gender"
                value={
                  formData.gender
                }
                onChange={
                  handleChange
                }
              >
                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </label>

            <label>
              Location
              <input
                name="location"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
              />
            </label>

            <label>
              Subscription
              <select
                name="subscription"
                value={
                  formData.subscription
                }
                onChange={
                  handleChange
                }
              >
                <option value="">
                  Select Plan
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
            </label>

            <label>
              Monthly Spend
              <input
                type="number"
                name="monthlySpend"
                value={
                  formData.monthlySpend
                }
                onChange={
                  handleChange
                }
              />
            </label>

            <label>
              Tenure
              <input
                type="number"
                name="tenure"
                value={
                  formData.tenure
                }
                onChange={
                  handleChange
                }
              />
            </label>

            <label>
              Churn Risk Score
              <input
                type="number"
                name="churnRisk"
                min="0"
                max="100"
                value={
                  formData.churnRisk
                }
                onChange={
                  handleChange
                }
              />
            </label>

            <label>
              Churn Status
              <select
                name="churnStatus"
                value={
                  formData.churnStatus
                }
                onChange={
                  handleChange
                }
              >
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
            </label>
          </div>

          <div
            style={{
              marginTop: 22,
              display: "flex",
              justifyContent:
                "flex-end",
              gap: 10,
            }}
          >
            <button
              type="button"
              className="text-button"
              onClick={() =>
                setEditMode(false)
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* RISK SUMMARY */}

          <section className="metric-grid">
            <article className="metric-card">
              <div className="metric-top">
                <span>
                  Churn Risk
                </span>
              </div>

              <h2>
                {risk}
              </h2>

              <div className="metric-foot">
                <span>
                  Current status
                </span>
              </div>
            </article>

            <article className="metric-card">
              <div className="metric-top">
                <span>
                  Risk Score
                </span>
              </div>

              <h2>
                {score}%
              </h2>

              <div className="metric-foot">
                <span>
                  Customer score
                </span>
              </div>
            </article>

            <article className="metric-card">
              <div className="metric-top">
                <span>
                  Monthly Spend
                </span>
              </div>

              <h2>
                $
                {Number(
                  customer.monthlySpend ||
                    0
                ).toLocaleString()}
              </h2>

              <div className="metric-foot">
                <span>
                  Current plan spend
                </span>
              </div>
            </article>

            <article className="metric-card">
              <div className="metric-top">
                <span>
                  Tenure
                </span>
              </div>

              <h2>
                {customer.tenure ??
                  0}
              </h2>

              <div className="metric-foot">
                <span>
                  Months
                </span>
              </div>
            </article>
          </section>

          {/* CUSTOMER INFORMATION */}

          <section className="panel">
            <div className="panel-heading">
              <div>
                <h3>
                  Customer Information
                </h3>

                <p>
                  Profile information
                  stored in MongoDB.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 20,
              }}
            >
              <div>
                <small>
                  Full Name
                </small>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop: 5,
                  }}
                >
                  {customer.name ||
                    "-"}
                </strong>
              </div>

              <div>
                <small>
                  Email
                </small>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop: 5,
                  }}
                >
                  {customer.email ||
                    "-"}
                </strong>
              </div>

              <div>
                <small>
                  Age
                </small>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop: 5,
                  }}
                >
                  {customer.age ??
                    "-"}
                </strong>
              </div>

              <div>
                <small>
                  Gender
                </small>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop: 5,
                  }}
                >
                  {customer.gender ||
                    "-"}
                </strong>
              </div>

              <div>
                <small>
                  Location
                </small>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop: 5,
                  }}
                >
                  {customer.location ||
                    "-"}
                </strong>
              </div>

              <div>
                <small>
                  Subscription
                </small>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop: 5,
                  }}
                >
                  {customer.subscription ||
                    "-"}
                </strong>
              </div>

              <div>
                <small>
                  Tenure
                </small>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop: 5,
                  }}
                >
                  {customer.tenure ??
                    "-"}{" "}
                  months
                </strong>
              </div>

              <div>
                <small>
                  Created
                </small>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop: 5,
                  }}
                >
                  {customer.createdAt
                    ? new Date(
                        customer.createdAt
                      ).toLocaleDateString()
                    : "-"}
                </strong>
              </div>
            </div>
          </section>

          {/* RISK PROFILE */}

          <section className="panel">
            <div className="panel-heading">
              <div>
                <h3>
                  Churn Risk Profile
                </h3>

                <p>
                  Current customer risk
                  assessment.
                </p>
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginBottom: 8,
                }}
              >
                <span>
                  Risk Score
                </span>

                <strong>
                  {score}%
                </strong>
              </div>

              <div
                style={{
                  height: 12,
                  borderRadius: 20,
                  background:
                    "#e2e8f0",
                  overflow:
                    "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      Math.max(
                        score,
                        0
                      ),
                      100
                    )}%`,
                    height: "100%",
                    background:
                      risk ===
                      "High"
                        ? "#ef4444"
                        : risk ===
                          "Medium"
                        ? "#f59e0b"
                        : "#10b981",
                    borderRadius:
                      20,
                  }}
                />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default CustomerDetails;