import { useState } from "react";
import { UserPlus, X, Save } from "lucide-react";

const API_URL = "http://localhost:5000/api/customers";

export default function AddCustomer({ onClose, onCustomerAdded }) {
  const [formData, setFormData] = useState({
    customerId: "",
    name: "",
    email: "",
    age: "",
    gender: "",
    location: "",
    subscription: "Basic",
    monthlySpend: "",
    tenure: "",
    churnRisk: 0,
    churnStatus: "Low",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: formData.customerId,
          name: formData.name,
          email: formData.email,
          age: formData.age
            ? Number(formData.age)
            : undefined,
          gender: formData.gender,
          location: formData.location,
          subscription: formData.subscription,
          monthlySpend: formData.monthlySpend
            ? Number(formData.monthlySpend)
            : undefined,
          tenure: formData.tenure
            ? Number(formData.tenure)
            : undefined,
          churnRisk: Number(formData.churnRisk),
          churnStatus: formData.churnStatus,
        }),
      });

      // Read response safely
      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();

        console.error(
          "Server returned non-JSON response:",
          text
        );

        throw new Error(
          `Backend returned an invalid response (${response.status}). Make sure the backend is running on port 5000.`
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to create customer"
        );
      }

      alert("Customer added successfully!");

      onCustomerAdded?.(result.data);
      onClose?.();
    } catch (err) {
      console.error("Add Customer Error:", err);

      setError(
        err.message ||
          "Unable to add customer. Please check the backend."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 650,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: 16,
          padding: 24,
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                fontWeight: 700,
                color: "#667085",
              }}
            >
              <UserPlus size={16} />
              CUSTOMER MANAGEMENT
            </div>

            <h2
              style={{
                margin: "7px 0 4px",
                fontSize: 24,
              }}
            >
              Add Customer
            </h2>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: 13,
              }}
            >
              Add a new customer to your churn
              analytics database.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="icon-btn"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 12px",
              marginBottom: 16,
              borderRadius: 8,
              background: "#fff1f2",
              color: "#be123c",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label>Customer ID</label>
              <input
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                placeholder="CUS-1009"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="28"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">
                  Female
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label>Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Chennai"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Subscription</label>
              <select
                name="subscription"
                value={formData.subscription}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Basic">Basic</option>
                <option value="Standard">
                  Standard
                </option>
                <option value="Premium">
                  Premium
                </option>
              </select>
            </div>

            <div>
              <label>Monthly Spend</label>
              <input
                type="number"
                name="monthlySpend"
                value={formData.monthlySpend}
                onChange={handleChange}
                placeholder="99"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Tenure (Months)</label>
              <input
                type="number"
                name="tenure"
                value={formData.tenure}
                onChange={handleChange}
                placeholder="12"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Churn Risk Score</label>
              <input
                type="number"
                min="0"
                max="100"
                name="churnRisk"
                value={formData.churnRisk}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Churn Status</label>
              <select
                name="churnStatus"
                value={formData.churnStatus}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 24,
              paddingTop: 18,
              borderTop:
                "1px solid #edf0f4",
            }}
          >
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              <Save size={14} />
              {saving
                ? "Saving..."
                : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  marginTop: 6,
  padding: "10px 12px",
  border: "1px solid #dfe3e8",
  borderRadius: 8,
  outline: "none",
  fontSize: 13,
  background: "#fff",
};