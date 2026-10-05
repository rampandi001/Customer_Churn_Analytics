import { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Save,
  RotateCcw,
  CheckCircle2,
  Lock,
  Globe,
  Mail,
  Monitor,
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");

  const [form, setForm] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@churniq.com",
    role: "Administrator",
    timezone: "Asia/Kolkata",
    language: "English",
  });

  const [saved, setSaved] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaved(false);
  };

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const reset = () => {
    setForm({
      firstName: "Admin",
      lastName: "User",
      email: "admin@churniq.com",
      role: "Administrator",
      timezone: "Asia/Kolkata",
      language: "English",
    });
    setSaved(false);
  };

  const tabs = [
    { name: "Profile", icon: User },
    { name: "Notifications", icon: Bell },
    { name: "Security", icon: Shield },
    { name: "Appearance", icon: Palette },
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
            <SettingsIcon size={15} />
            SYSTEM PREFERENCES
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#19243e",
            }}
          >
            Settings
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#8790a4",
              fontSize: "13px",
            }}
          >
            Manage your workspace, account, and preferences.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={reset}
            style={secondaryButton}
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            onClick={save}
            style={primaryButton}
          >
            <Save size={14} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Saved message */}
      {saved && (
        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #ccefe0",
            color: "#16815d",
            padding: "11px 14px",
            borderRadius: "10px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={16} />
          Settings saved successfully.
        </div>
      )}

      {/* Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px minmax(0, 1fr)",
          gap: "18px",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e6e9f1",
            borderRadius: "15px",
            padding: "14px",
            height: "fit-content",
            boxShadow: "0 5px 18px rgba(30,40,80,0.04)",
          }}
        >
          {/* Profile */}
          <div
            style={{
              padding: "12px",
              borderBottom: "1px solid #edf0f5",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#4338ca)",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontSize: "15px",
                fontWeight: 800,
                marginBottom: "10px",
              }}
            >
              AU
            </div>

            <strong
              style={{
                display: "block",
                color: "#303a54",
                fontSize: "12px",
              }}
            >
              Admin User
            </strong>

            <span
              style={{
                color: "#949caf",
                fontSize: "10px",
              }}
            >
              Administrator
            </span>
          </div>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.name;

            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                style={{
                  width: "100%",
                  border: 0,
                  borderRadius: "8px",
                  padding: "11px 12px",
                  background: selected ? "#f0efff" : "transparent",
                  color: selected ? "#5b5fd1" : "#69748a",
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  fontSize: "11px",
                  fontWeight: selected ? 750 : 600,
                  cursor: "pointer",
                  marginBottom: "3px",
                  textAlign: "left",
                }}
              >
                <Icon size={15} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e6e9f1",
            borderRadius: "15px",
            padding: "25px",
            boxShadow: "0 5px 18px rgba(30,40,80,0.04)",
          }}
        >
          {activeTab === "Profile" && (
            <ProfileSettings form={form} update={update} />
          )}

          {activeTab === "Notifications" && <NotificationSettings />}

          {activeTab === "Security" && <SecuritySettings />}

          {activeTab === "Appearance" && <AppearanceSettings />}
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          color: "#a0a8b9",
          fontSize: "10px",
          marginTop: "18px",
        }}
      >
        ChurnIQ demo · Sample data for UI demonstration only.
      </div>
    </div>
  );
}

function ProfileSettings({ form, update }) {
  return (
    <>
      <SectionTitle
        icon={User}
        title="Profile Information"
        text="Update your personal account information."
      />

      <div
        style={{
          background: "#f8f9ff",
          border: "1px solid #ececff",
          borderRadius: "11px",
          padding: "15px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "23px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "#6366d9",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
          }}
        >
          AU
        </div>

        <div>
          <strong style={{ color: "#39435c", fontSize: "12px" }}>
            Profile Photo
          </strong>

          <p
            style={{
              margin: "4px 0 0",
              color: "#9199aa",
              fontSize: "10px",
            }}
          >
            Avatar preview for your account.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "17px",
        }}
      >
        <Input
          label="First Name"
          value={form.firstName}
          onChange={(v) => update("firstName", v)}
        />

        <Input
          label="Last Name"
          value={form.lastName}
          onChange={(v) => update("lastName", v)}
        />

        <Input
          label="Email Address"
          value={form.email}
          onChange={(v) => update("email", v)}
          full
        />

        <Select
          label="Role"
          value={form.role}
          options={["Administrator", "Analyst", "Viewer"]}
          onChange={(v) => update("role", v)}
        />

        <Select
          label="Timezone"
          value={form.timezone}
          options={["Asia/Kolkata", "UTC", "America/New_York"]}
          onChange={(v) => update("timezone", v)}
        />

        <Select
          label="Language"
          value={form.language}
          options={["English", "Tamil", "Hindi"]}
          onChange={(v) => update("language", v)}
        />
      </div>
    </>
  );
}

function NotificationSettings() {
  const [items, setItems] = useState({
    alerts: true,
    reports: true,
    security: true,
    email: false,
  });

  return (
    <>
      <SectionTitle
        icon={Bell}
        title="Notification Preferences"
        text="Choose which workspace events you want to receive."
      />

      <Toggle
        title="Risk Alerts"
        text="Receive alerts when customer churn risk changes."
        value={items.alerts}
        onChange={() => setItems({ ...items, alerts: !items.alerts })}
      />

      <Toggle
        title="Report Updates"
        text="Receive notifications when reports are ready."
        value={items.reports}
        onChange={() => setItems({ ...items, reports: !items.reports })}
      />

      <Toggle
        title="Security Notifications"
        text="Get notified about important account activity."
        value={items.security}
        onChange={() => setItems({ ...items, security: !items.security })}
      />

      <Toggle
        title="Email Notifications"
        text="Send important workspace updates to your email."
        value={items.email}
        onChange={() => setItems({ ...items, email: !items.email })}
      />
    </>
  );
}

function SecuritySettings() {
  return (
    <>
      <SectionTitle
        icon={Shield}
        title="Security"
        text="Manage account protection and access controls."
      />

      <div
        style={{
          background: "#eefaf5",
          border: "1px solid #d8f1e5",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "#d8f4e7",
            color: "#20936a",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Shield size={19} />
        </div>

        <div>
          <strong style={{ color: "#287153", fontSize: "12px" }}>
            Security Status
          </strong>

          <p
            style={{
              margin: "4px 0 0",
              color: "#709687",
              fontSize: "10px",
            }}
          >
            Your workspace security configuration looks good.
          </p>
        </div>

        <span
          style={{
            marginLeft: "auto",
            background: "#d9f4e7",
            color: "#21825e",
            borderRadius: "6px",
            padding: "5px 8px",
            fontSize: "9px",
            fontWeight: 800,
          }}
        >
          SECURE
        </span>
      </div>

      <SecurityRow
        icon={Lock}
        title="Password"
        text="Last changed 30 days ago"
        action="Change"
      />

      <SecurityRow
        icon={Shield}
        title="Two-Factor Authentication"
        text="Additional account verification"
        action="Enable"
      />

      <SecurityRow
        icon={Monitor}
        title="Active Sessions"
        text="2 devices currently signed in"
        action="Review"
      />
    </>
  );
}

function AppearanceSettings() {
  return (
    <>
      <SectionTitle
        icon={Palette}
        title="Appearance"
        text="Customize how ChurnIQ looks on your device."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "15px",
        }}
      >
        <ThemeCard title="Light" active />
        <ThemeCard title="System Default" />
      </div>

      <div
        style={{
          marginTop: "22px",
          padding: "15px",
          border: "1px solid #eceef4",
          borderRadius: "11px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#4d5870",
            fontWeight: 700,
            fontSize: "11px",
          }}
        >
          <Globe size={15} />
          Interface Language
        </div>

        <p
          style={{
            margin: "7px 0 0",
            color: "#929aab",
            fontSize: "10px",
          }}
        >
          English is currently selected as the application language.
        </p>
      </div>
    </>
  );
}

function SectionTitle({ icon: Icon, title, text }) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#6366d9",
          marginBottom: "6px",
        }}
      >
        <Icon size={17} />
        <h2
          style={{
            margin: 0,
            color: "#354057",
            fontSize: "18px",
          }}
        >
          {title}
        </h2>
      </div>

      <p
        style={{
          margin: 0,
          color: "#8b94a7",
          fontSize: "11px",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function Input({ label, value, onChange, full }) {
  return (
    <label style={{ gridColumn: full ? "1 / -1" : undefined }}>
      <span style={labelStyle}>{label}</span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "1px solid #e1e5ed",
          borderRadius: "8px",
          height: "40px",
          padding: "0 11px",
        }}
      >
        {label === "Email Address" && <Mail size={14} color="#9aa2b3" />}

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            border: 0,
            outline: 0,
            color: "#46516a",
            fontSize: "11px",
          }}
        />
      </div>
    </label>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label>
      <span style={labelStyle}>{label}</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: "40px",
          border: "1px solid #e1e5ed",
          borderRadius: "8px",
          padding: "0 10px",
          color: "#46516a",
          background: "#fff",
          outline: 0,
          fontSize: "11px",
        }}
      >
        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ title, text, value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 0",
        borderBottom: "1px solid #edf0f5",
      }}
    >
      <div>
        <strong style={{ color: "#3b455c", fontSize: "11px" }}>
          {title}
        </strong>

        <p
          style={{
            margin: "4px 0 0",
            color: "#929aaa",
            fontSize: "10px",
          }}
        >
          {text}
        </p>
      </div>

      <button
        onClick={onChange}
        style={{
          width: "38px",
          height: "21px",
          borderRadius: "20px",
          border: 0,
          background: value ? "#6366d9" : "#d9dde6",
          padding: "3px",
          cursor: "pointer",
          textAlign: value ? "right" : "left",
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

function SecurityRow({ icon: Icon, title, text, action }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "15px 0",
        borderBottom: "1px solid #edf0f5",
      }}
    >
      <div
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "9px",
          background: "#f2f3ff",
          color: "#6366d9",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Icon size={16} />
      </div>

      <div style={{ flex: 1 }}>
        <strong style={{ color: "#3b455c", fontSize: "11px" }}>
          {title}
        </strong>

        <p
          style={{
            margin: "4px 0 0",
            color: "#929aaa",
            fontSize: "10px",
          }}
        >
          {text}
        </p>
      </div>

      <button style={secondaryButton}>{action}</button>
    </div>
  );
}

function ThemeCard({ title, active }) {
  return (
    <div
      style={{
        border: active ? "2px solid #6366d9" : "1px solid #e4e7ef",
        borderRadius: "11px",
        padding: "15px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          height: "75px",
          borderRadius: "7px",
          background: "#f5f6fa",
          marginBottom: "10px",
        }}
      />

      <strong style={{ color: "#3e485e", fontSize: "11px" }}>
        {title}
      </strong>

      {active && (
        <span
          style={{
            float: "right",
            color: "#6366d9",
            fontSize: "9px",
            fontWeight: 800,
          }}
        >
          ACTIVE
        </span>
      )}
    </div>
  );
}

const labelStyle = {
  display: "block",
  color: "#59647b",
  fontSize: "10px",
  fontWeight: 700,
  marginBottom: "6px",
};

const primaryButton = {
  border: 0,
  background: "#6366d9",
  color: "#fff",
  borderRadius: "8px",
  padding: "9px 13px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "11px",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButton = {
  border: "1px solid #e1e5ed",
  background: "#fff",
  color: "#69748a",
  borderRadius: "8px",
  padding: "8px 11px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "10px",
  fontWeight: 700,
  cursor: "pointer",
};