import { useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  AlertTriangle,
  TrendingDown,
  Users,
  ShieldAlert,
  FileText,
  Settings,
  Filter,
  Search,
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    type: "risk",
    title: "High churn risk detected",
    message:
      "128 customers have moved into the high-risk segment.",
    time: "12 minutes ago",
    unread: true,
  },
  {
    id: 2,
    type: "analysis",
    title: "Churn analysis completed",
    message:
      "The latest customer churn analysis has been completed successfully.",
    time: "38 minutes ago",
    unread: true,
  },
  {
    id: 3,
    type: "customer",
    title: "New customers imported",
    message:
      "684 new customer records were added to the workspace.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 4,
    type: "security",
    title: "New login detected",
    message:
      "A new administrator session was detected on your workspace.",
    time: "4 hours ago",
    unread: false,
  },
  {
    id: 5,
    type: "report",
    title: "Monthly report is ready",
    message:
      "Your September churn performance report is ready to review.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 6,
    type: "system",
    title: "System maintenance scheduled",
    message:
      "Scheduled maintenance will take place this Sunday at 02:00 AM.",
    time: "Yesterday",
    unread: false,
  },
];

const notificationConfig = {
  risk: {
    icon: ShieldAlert,
    className: "danger",
  },
  analysis: {
    icon: TrendingDown,
    className: "purple",
  },
  customer: {
    icon: Users,
    className: "blue",
  },
  security: {
    icon: AlertTriangle,
    className: "warning",
  },
  report: {
    icon: FileText,
    className: "green",
  },
  system: {
    icon: Settings,
    className: "gray",
  },
};

export default function Notifications() {
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Unread" && item.unread) ||
        (filter === "Read" && !item.unread);

      const matchesSearch =
        item.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.message
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [notifications, filter, search]);

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, unread: false }
          : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="page-shell">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <Bell size={14} />
            WORKSPACE ALERTS
          </div>

          <h1>Notifications</h1>

          <p>
            Stay updated with churn alerts, customer activity
            and workspace events.
          </p>
        </div>

        <div className="header-actions">
          {unreadCount > 0 && (
            <button
              className="secondary-btn"
              onClick={markAllAsRead}
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          )}

          <button
            className="secondary-btn"
            onClick={clearAll}
            disabled={!notifications.length}
          >
            <Trash2 size={14} />
            Clear all
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Bell size={17} />
          </div>

          <span>Total Notifications</span>

          <strong>{notifications.length}</strong>

          <small>
            Workspace activity
          </small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={17} />
          </div>

          <span>Unread</span>

          <strong>{unreadCount}</strong>

          <small className="negative">
            Requires attention
          </small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <ShieldAlert size={17} />
          </div>

          <span>Risk Alerts</span>

          <strong>
            {
              notifications.filter(
                (item) => item.type === "risk"
              ).length
            }
          </strong>

          <small className="negative">
            Churn related
          </small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Check size={17} />
          </div>

          <span>Read</span>

          <strong>
            {notifications.length - unreadCount}
          </strong>

          <small className="positive">
            Reviewed
          </small>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="audit-toolbar">
        <div className="audit-search">
          <Search size={15} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications..."
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <Filter size={14} color="#8b96a9" />

          <select
            className="audit-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Notifications</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
          </select>
        </div>
      </div>

      {/* NOTIFICATION LIST */}
      <div className="content-card">
        <div className="card-header">
          <div>
            <h2>Recent Notifications</h2>

            <p>
              {filteredNotifications.length} notifications
              available.
            </p>
          </div>

          {unreadCount > 0 && (
            <span className="soft-badge">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {filteredNotifications.map((notification) => {
            const config =
              notificationConfig[notification.type] ||
              notificationConfig.system;

            const Icon = config.icon;

            return (
              <div
                key={notification.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 13,
                  padding: "16px 4px",
                  borderBottom:
                    "1px solid #edf0f4",
                  background: notification.unread
                    ? "#fafbff"
                    : "transparent",
                }}
              >
                {/* ICON */}
                <div
                  className={`notification-icon ${config.className}`}
                >
                  <Icon size={17} />
                </div>

                {/* CONTENT */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      flexWrap: "wrap",
                    }}
                  >
                    <strong
                      style={{
                        color: "#293751",
                        fontSize: 11,
                      }}
                    >
                      {notification.title}
                    </strong>

                    {notification.unread && (
                      <span className="unread-dot" />
                    )}
                  </div>

                  <p
                    style={{
                      margin: "5px 0 7px",
                      color: "#7e899d",
                      fontSize: 9,
                      lineHeight: 1.55,
                    }}
                  >
                    {notification.message}
                  </p>

                  <span
                    style={{
                      color: "#a0a9b8",
                      fontSize: 8,
                    }}
                  >
                    {notification.time}
                  </span>
                </div>

                {/* ACTIONS */}
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    flexShrink: 0,
                  }}
                >
                  {notification.unread && (
                    <button
                      className="icon-btn"
                      title="Mark as read"
                      onClick={() =>
                        markAsRead(notification.id)
                      }
                    >
                      <Check size={14} />
                    </button>
                  )}

                  <button
                    className="icon-btn"
                    title="Delete"
                    onClick={() =>
                      deleteNotification(notification.id)
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div
              style={{
                padding: "55px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  margin: "0 auto 12px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 12,
                  background: "#f1f3f7",
                  color: "#8b96a9",
                }}
              >
                <Bell size={21} />
              </div>

              <h3
                style={{
                  margin: "0 0 5px",
                  color: "#35425b",
                  fontSize: 13,
                }}
              >
                No notifications found
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#929caf",
                  fontSize: 9,
                }}
              >
                You're all caught up.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PREFERENCES */}
      <div className="content-card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <div>
            <h2>Notification Preferences</h2>

            <p>
              Configure how you want to receive workspace
              alerts.
            </p>
          </div>
        </div>

        <div className="notification-preferences">
          <Preference
            title="Churn Risk Alerts"
            description="Notify me when customers enter high-risk segments."
            defaultChecked
          />

          <Preference
            title="Analysis Completed"
            description="Notify me when analytics jobs finish."
            defaultChecked
          />

          <Preference
            title="Customer Imports"
            description="Notify me when new customer data is imported."
            defaultChecked
          />

          <Preference
            title="Security Alerts"
            description="Notify me about new logins and security events."
            defaultChecked
          />
        </div>
      </div>
    </div>
  );
}

function Preference({
  title,
  description,
  defaultChecked,
}) {
  const [checked, setChecked] =
    useState(defaultChecked);

  return (
    <div className="notification-preference">
      <div>
        <strong>{title}</strong>

        <p>{description}</p>
      </div>

      <button
        type="button"
        className={`toggle ${checked ? "active" : ""}`}
        onClick={() => setChecked(!checked)}
        aria-label={title}
      >
        <span />
      </button>
    </div>
  );
}