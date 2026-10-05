import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Users,
  KeyRound,
  Smartphone,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Plus,
  MoreHorizontal,
} from "lucide-react";

export default function SecurityAccess() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionControl, setSessionControl] = useState(true);

  const users = [
    {
      name: "Admin User",
      email: "admin@churniq.com",
      role: "Administrator",
      status: "Active",
    },
    {
      name: "Data Analyst",
      email: "analyst@churniq.com",
      role: "Analyst",
      status: "Active",
    },
    {
      name: "Product Viewer",
      email: "viewer@churniq.com",
      role: "Viewer",
      status: "Active",
    },
  ];

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
          marginBottom: "25px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#6366d9",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              marginBottom: "7px",
            }}
          >
            <ShieldCheck size={15} />
            SECURITY CENTER
          </div>

          <h1
            style={{
              margin: 0,
              color: "#19243e",
              fontSize: "28px",
            }}
          >
            Security & Access
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#8790a4",
              fontSize: "13px",
            }}
          >
            Manage authentication, permissions, sessions, and workspace access.
          </p>
        </div>

        <button
          style={{
            border: 0,
            background: "#6366d9",
            color: "#fff",
            borderRadius: "9px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Plus size={14} />
          Add User
        </button>
      </div>

      {/* Security banner */}
      <div
        style={{
          background: "#eefaf5",
          border: "1px solid #d7f1e5",
          borderRadius: "14px",
          padding: "17px",
          display: "flex",
          alignItems: "center",
          gap: "13px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            background: "#d8f4e7",
            color: "#208e67",
            display: "grid",
            placeItems: "center",
          }}
        >
          <ShieldCheck size={20} />
        </div>

        <div style={{ flex: 1 }}>
          <strong
            style={{
              display: "block",
              color: "#2d7255",
              fontSize: "12px",
            }}
          >
            Workspace Security: Good
          </strong>

          <span
            style={{
              display: "block",
              color: "#79988a",
              fontSize: "10px",
              marginTop: "4px",
            }}
          >
            No critical security issues detected in the current demo
            configuration.
          </span>
        </div>

        <span
          style={{
            background: "#d9f4e7",
            color: "#21825e",
            padding: "6px 9px",
            borderRadius: "6px",
            fontSize: "9px",
            fontWeight: 800,
          }}
        >
          SECURE
        </span>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        <Stat icon={Users} title="Active Users" value="3" />
        <Stat icon={KeyRound} title="Roles" value="3" />
        <Stat icon={Smartphone} title="Active Sessions" value="2" />
        <Stat icon={Globe} title="Locations" value="2" />
      </div>

      {/* Security controls */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.25fr .75fr",
          gap: "18px",
          marginBottom: "20px",
        }}
      >
        <div style={card}>
          <CardHeader
            icon={Lock}
            title="Authentication & Security"
            text="Configure account protection policies."
          />

          <SecurityToggle
            title="Two-Factor Authentication"
            text="Require an additional verification step when users sign in."
            value={twoFactor}
            onChange={() => setTwoFactor(!twoFactor)}
          />

          <SecurityToggle
            title="Session Control"
            text="Automatically monitor and manage active user sessions."
            value={sessionControl}
            onChange={() => setSessionControl(!sessionControl)}
          />

          <SecurityToggle
            title="Login Monitoring"
            text="Record successful and failed authentication events."
            value={true}
            disabled
          />
        </div>

        <div style={card}>
          <CardHeader
            icon={AlertTriangle}
            title="Security Checks"
            text="Current workspace security overview."
          />

          <Check title="Strong authentication" />
          <Check title="Audit logging enabled" />
          <Check title="Session monitoring active" />
          <Check title="Role-based access enabled" />
        </div>
      </div>

      {/* Users */}
      <div style={card}>
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #edf0f5",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <CardHeader
            icon={Users}
            title="Workspace Access"
            text="Users and their assigned access roles."
          />

          <button
            style={{
              width: "32px",
              height: "32px",
              border: "1px solid #e4e7ee",
              borderRadius: "7px",
              background: "#fff",
              color: "#727d92",
            }}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "650px",
            }}
          >
            <thead>
              <tr style={{ background: "#f8f9fc" }}>
                {["USER", "ROLE", "STATUS", "ACCESS", ""].map((x) => (
                  <th
                    key={x}
                    style={{
                      padding: "12px 18px",
                      textAlign: "left",
                      color: "#929aaa",
                      fontSize: "9px",
                    }}
                  >
                    {x}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td style={td}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "#eeedff",
                          color: "#6366d9",
                          display: "grid",
                          placeItems: "center",
                          fontSize: "9px",
                          fontWeight: 800,
                        }}
                      >
                        {user.name
                          .split(" ")
                          .map((x) => x[0])
                          .join("")}
                      </div>

                      <div>
                        <strong
                          style={{
                            display: "block",
                            color: "#3b455d",
                            fontSize: "10px",
                          }}
                        >
                          {user.name}
                        </strong>

                        <span
                          style={{
                            color: "#9aa2b2",
                            fontSize: "9px",
                          }}
                        >
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td style={td}>
                    <span
                      style={{
                        background: "#f1f2fb",
                        color: "#6569bd",
                        padding: "5px 8px",
                        borderRadius: "5px",
                        fontSize: "9px",
                        fontWeight: 700,
                      }}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td style={td}>
                    <span
                      style={{
                        color: "#218c67",
                        background: "#ecfaf4",
                        borderRadius: "20px",
                        padding: "5px 8px",
                        fontSize: "9px",
                        fontWeight: 800,
                      }}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td style={td}>
                    <span style={{ color: "#6f7a90", fontSize: "10px" }}>
                      Full workspace
                    </span>
                  </td>

                  <td style={td}>
                    <button
                      style={{
                        border: "1px solid #e3e6ed",
                        background: "#fff",
                        borderRadius: "7px",
                        padding: "7px 10px",
                        color: "#687389",
                        fontSize: "9px",
                      }}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, title, value }) {
  return (
    <div style={card}>
      <div
        style={{
          padding: "16px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "#f0efff",
            color: "#6366d9",
            display: "grid",
            placeItems: "center",
            marginBottom: "9px",
          }}
        >
          <Icon size={15} />
        </div>

        <span
          style={{
            color: "#8d96a9",
            fontSize: "10px",
          }}
        >
          {title}
        </span>

        <strong
          style={{
            display: "block",
            color: "#293550",
            fontSize: "19px",
            marginTop: "3px",
          }}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}

function CardHeader({ icon: Icon, title, text }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#6366d9",
          marginBottom: "5px",
        }}
      >
        <Icon size={16} />

        <h2
          style={{
            margin: 0,
            color: "#36415a",
            fontSize: "14px",
          }}
        >
          {title}
        </h2>
      </div>

      <p
        style={{
          margin: 0,
          color: "#929aaa",
          fontSize: "10px",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function SecurityToggle({ title, text, value, onChange, disabled }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "15px",
        alignItems: "center",
        padding: "15px 0",
        borderBottom: "1px solid #edf0f5",
      }}
    >
      <div>
        <strong
          style={{
            display: "block",
            color: "#3c465e",
            fontSize: "11px",
          }}
        >
          {title}
        </strong>

        <span
          style={{
            display: "block",
            color: "#939bac",
            fontSize: "10px",
            marginTop: "4px",
            lineHeight: 1.5,
          }}
        >
          {text}
        </span>
      </div>

      <button
        disabled={disabled}
        onClick={onChange}
        style={{
          width: "38px",
          height: "21px",
          border: 0,
          borderRadius: "20px",
          background: value ? "#6366d9" : "#d8dce5",
          padding: "3px",
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.7 : 1,
          textAlign: value ? "right" : "left",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "15px",
            height: "15px",
            borderRadius: "50%",
            background: "#fff",
          }}
        />
      </button>
    </div>
  );
}

function Check({ title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "11px 0",
        borderBottom: "1px solid #edf0f5",
      }}
    >
      <CheckCircle2 size={15} color="#22a275" />
      <span style={{ color: "#687389", fontSize: "10px" }}>{title}</span>
    </div>
  );
}

const card = {
  background: "#fff",
  border: "1px solid #e6e9f1",
  borderRadius: "15px",
  padding: "20px",
  boxShadow: "0 5px 18px rgba(30,40,80,.04)",
};

const td = {
  padding: "13px 18px",
  borderTop: "1px solid #edf0f5",
};