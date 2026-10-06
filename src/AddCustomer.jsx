import React, { useState } from "react";

const API_URL =
  "https://churniq-backend-0c1x.onrender.com/api/customers";

function AddCustomer({
  onCustomerAdded,
  onClose,
}) {
  const [formData, setFormData] = useState({
    customerId: "",
    name: "",
    email: "",
    age: "",
    gender: "",
    location: "",
    subscription: "",
    monthlySpend: "",
    tenure: "",
    churnRisk: "0",
    churnStatus: "Low",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !formData.customerId ||
      !formData.name ||
      !formData.email
    ) {
      setError(
        "Customer ID, name, and email are required."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerId:
          formData.customerId,

        name:
          formData.name,

        email:
          formData.email,

        age: formData.age
          ? Number(formData.age)
          : undefined,

        gender:
          formData.gender,

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
          Number(
            formData.churnRisk || 0
          ),

        churnStatus:
          formData.churnStatus,
      };

      const response =
        await fetch(API_URL, {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        });

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to add customer"
        );
      }

      alert(
        "Customer added successfully!"
      );

      onCustomerAdded?.(
        result.data
      );

      onClose?.();
    } catch (err) {
      console.error(
        "❌ Add customer error:",
        err
      );

      setError(
        err.message ||
          "Failed to add customer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel page-panel">
      <div className="panel-heading">
        <div>
          <h3>
            Add Customer
          </h3>

          <p>
            Add a new customer to
            ChurnIQ.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            className="text-button"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            marginBottom: 18,
            padding: "12px 14px",
            borderRadius: 8,
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

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 18,
        }}
      >
        <label>
          Customer ID
          <input
            name="customerId"
            value={
              formData.customerId
            }
            onChange={
              handleChange
            }
            placeholder="CUS-1011"
            required
          />
        </label>

        <label>
          Full Name
          <input
            name="name"
            value={formData.name}
            onChange={
              handleChange
            }
            placeholder="Customer name"
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
            placeholder="customer@email.com"
            required
          />
        </label>

        <label>
          Age
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={
              handleChange
            }
            placeholder="25"
            min="1"
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
            placeholder="Chennai"
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
            placeholder="10000"
            min="0"
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
            placeholder="12"
            min="0"
          />
        </label>

        <label>
          Churn Risk Score
          <input
            type="number"
            name="churnRisk"
            value={
              formData.churnRisk
            }
            onChange={
              handleChange
            }
            placeholder="72"
            min="0"
            max="100"
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

        <div
          style={{
            gridColumn:
              "1 / -1",
            display: "flex",
            gap: 10,
            marginTop: 8,
          }}
        >
          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : "Add Customer"}
          </button>

          {onClose && (
            <button
              type="button"
              className="text-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default AddCustomer;