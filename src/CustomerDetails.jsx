import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Mail,
  MapPin,
  User,
  Calendar,
  DollarSign,
  ShieldAlert,
  Save,
  X,
  RefreshCw,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/customers";

export default function CustomerDetails({
  customer: customerProp,
  onBack,
}) {
  const [customer, setCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // =====================================================
  // GET MONGODB ID
  // =====================================================

  const getMongoId = () => {
    return (
      customer?._id ||
      customer?.mongoId ||
      customerProp?._id ||
      customerProp?.mongoId ||
      null
    );
  };

  // =====================================================
  // LOAD CUSTOMER
  // =====================================================

  const loadCustomer = async () => {
    const mongoId =
      customerProp?._id ||
      customerProp?.mongoId;

    if (!mongoId) {
      setError("MongoDB customer ID not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log(
        "🔎 Loading customer with MongoDB ID:",
        mongoId
      );

      const response = await fetch(
        `${API_URL}/${mongoId}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load customer"
        );
      }

      console.log(
        "✅ Customer loaded:",
        result.data
      );

      setCustomer(result.data);
      setFormData(result.data);
    } catch (err) {
      console.error(
        "❌ Customer details error:",
        err
      );

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [customerProp]);

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = () => {
    setFormData({
      ...customer,
    });

    setIsEditing(true);
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SAVE CUSTOMER
  // =====================================================

  const handleSave = async () => {
    const mongoId = getMongoId();

    console.log(
      "🆔 MongoDB ID used for update:",
      mongoId
    );

    if (!mongoId) {
      alert(
        "MongoDB ID not found. Please go back and open the customer again."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updateData = {
        name: formData.name,
        email: formData.email,

        age:
          formData.age !== "" &&
          formData.age !== undefined
            ? Number(formData.age)
            : undefined,

        gender: formData.gender,

        location: formData.location,

        subscription:
          formData.subscription,

        monthlySpend:
          formData.monthlySpend !== "" &&
          formData.monthlySpend !== undefined
            ? Number(formData.monthlySpend)
            : undefined,

        tenure:
          formData.tenure !== "" &&
          formData.tenure !== undefined
            ? Number(formData.tenure)
            : undefined,

        churnRisk:
          formData.churnRisk !== "" &&
          formData.churnRisk !== undefined
            ? Number(formData.churnRisk)
            : 0,

        churnStatus:
          formData.churnStatus || "Low",
      };

      console.log(
        "📤 Sending update:",
        updateData
      );

      const response = await fetch(
        `${API_URL}/${mongoId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(updateData),
        }
      );

      const result =
        await response.json();

      console.log(
        "📥 Update response:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update customer"
        );
      }

      // Update local customer state
      setCustomer(result.data);

      setFormData(result.data);

      setIsEditing(false);

      setError("");

      alert(
        "Customer updated successfully!"
      );
    } catch (err) {
      console.error(
        "❌ Update customer error:",
        err
      );

      setError(err.message);

      alert(
        `Failed to update customer: ${err.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="page-content">
        <div
          style={{
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <RefreshCw
            size={28}
            className="spin"
          />

          <p>
            Loading customer details...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !customer) {
    return (
      <div className="page-content">
        <button
          className="btn btn-secondary"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div
          style={{
            marginTop: "30px",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #ef4444",
          }}
        >
          <h3>
            Unable to load customer
          </h3>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="page-content">
        <button
          className="btn btn-secondary"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <p style={{ marginTop: "30px" }}>
          Customer not found.
        </p>
      </div>
    );
  }

  // =====================================================
  // HELPERS
  // =====================================================

  const riskClass =
    customer.churnStatus === "High"
      ? "high"
      : customer.churnStatus === "Medium"
      ? "medium"
      : "low";

  const joinedDate = customer.createdAt
    ? new Date(
        customer.createdAt
      ).toLocaleDateString()
    : "-";

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="page-content">

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Back to Customers
        </button>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          {!isEditing ? (
            <button
              className="btn btn-primary"
              onClick={handleEdit}
            >
              <Edit3 size={16} />
              Edit Customer
            </button>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    ...customer,
                  });
                }}
                disabled={saving}
              >
                <X size={16} />
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                <Save size={16} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "10px",
            background:
              "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      )}

      {/* CUSTOMER HEADER */}

      <div
        className="card"
        style={{
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "rgba(99, 102, 241, 0.15)",
              color: "#6366f1",
              fontSize: "22px",
              fontWeight: "700",
            }}
          >
            {customer.name
              ?.charAt(0)
              ?.toUpperCase() || "?"}
          </div>

          <div>
            <h2 style={{ margin: 0 }}>
              {customer.name}
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                opacity: 0.7,
              }}
            >
              {customer.customerId}
            </p>
          </div>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <span
              className={`status-badge ${riskClass}`}
            >
              {customer.churnStatus ||
                "Low"}{" "}
              Risk
            </span>

            <strong>
              {Number(
                customer.churnRisk || 0
              )}
              %
            </strong>
          </div>
        </div>
      </div>

      {/* DETAILS GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >

        {/* PERSONAL */}

        <div className="card">
          <h3>
            <User size={18} />
            Personal Information
          </h3>

          <div
            style={{
              display: "grid",
              gap: "16px",
              marginTop: "18px",
            }}
          >
            <DetailItem
              icon={<User size={16} />}
              label="Full Name"
              value={
                isEditing ? (
                  <input
                    name="name"
                    value={
                      formData.name || ""
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  customer.name
                )
              }
            />

            <DetailItem
              icon={<Mail size={16} />}
              label="Email"
              value={
                isEditing ? (
                  <input
                    name="email"
                    type="email"
                    value={
                      formData.email || ""
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  customer.email
                )
              }
            />

            <DetailItem
              icon={<User size={16} />}
              label="Gender"
              value={
                isEditing ? (
                  <select
                    name="gender"
                    value={
                      formData.gender || ""
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="">
                      Select
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
                ) : (
                  customer.gender || "-"
                )
              }
            />

            <DetailItem
              icon={<User size={16} />}
              label="Age"
              value={
                isEditing ? (
                  <input
                    name="age"
                    type="number"
                    value={
                      formData.age ?? ""
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  customer.age ?? "-"
                )
              }
            />

            <DetailItem
              icon={<MapPin size={16} />}
              label="Location"
              value={
                isEditing ? (
                  <input
                    name="location"
                    value={
                      formData.location || ""
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  customer.location || "-"
                )
              }
            />
          </div>
        </div>

        {/* SUBSCRIPTION */}

        <div className="card">
          <h3>
            <DollarSign size={18} />
            Subscription
          </h3>

          <div
            style={{
              display: "grid",
              gap: "16px",
              marginTop: "18px",
            }}
          >
            <DetailItem
              label="Plan"
              value={
                isEditing ? (
                  <select
                    name="subscription"
                    value={
                      formData.subscription || ""
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
                ) : (
                  customer.subscription ||
                  "-"
                )
              }
            />

            <DetailItem
              label="Monthly Spend"
              value={
                isEditing ? (
                  <input
                    name="monthlySpend"
                    type="number"
                    value={
                      formData.monthlySpend ??
                      ""
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  `$${Number(
                    customer.monthlySpend || 0
                  ).toFixed(2)}`
                )
              }
            />

            <DetailItem
              label="Tenure"
              value={
                isEditing ? (
                  <input
                    name="tenure"
                    type="number"
                    value={
                      formData.tenure ?? ""
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  `${
                    customer.tenure ?? 0
                  } months`
                )
              }
            />

            <DetailItem
              icon={
                <Calendar size={16} />
              }
              label="Joined"
              value={joinedDate}
            />
          </div>
        </div>

        {/* CHURN RISK */}

        <div className="card">
          <h3>
            <ShieldAlert size={18} />
            Churn Risk
          </h3>

          <div
            style={{
              display: "grid",
              gap: "16px",
              marginTop: "18px",
            }}
          >
            <DetailItem
              label="Risk Score"
              value={
                isEditing ? (
                  <input
                    name="churnRisk"
                    type="number"
                    min="0"
                    max="100"
                    value={
                      formData.churnRisk ?? 0
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  `${
                    customer.churnRisk ?? 0
                  }%`
                )
              }
            />

            <DetailItem
              label="Risk Status"
              value={
                isEditing ? (
                  <select
                    name="churnStatus"
                    value={
                      formData.churnStatus ||
                      "Low"
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
                ) : (
                  customer.churnStatus ||
                  "Low"
                )
              }
            />

            <DetailItem
              label="Customer ID"
              value={
                customer.customerId
              }
            />

            <DetailItem
              label="Database ID"
              value={
                customer._id || "-"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// DETAIL ITEM
// =====================================================

function DetailItem({
  icon,
  label,
  value,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          opacity: 0.7,
          minWidth: "130px",
        }}
      >
        {icon}
        <span>{label}</span>
      </div>

      <div
        style={{
          flex: 1,
          textAlign: "right",
          fontWeight: "500",
        }}
      >
        {value}
      </div>
    </div>
  );
}