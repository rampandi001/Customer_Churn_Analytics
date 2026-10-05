import { useMemo, useState } from "react";
import {
  Users,
  Search,
  UserPlus,
  ShieldCheck,
  MoreHorizontal,
  Mail,
  Clock3,
  UserRound,
} from "lucide-react";

const initialUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@churniq.com",
    role: "Administrator",
    status: "Active",
    lastActive: "Just now",
    initials: "AU",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@churniq.com",
    role: "Analyst",
    status: "Active",
    lastActive: "12 min ago",
    initials: "SJ",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael@churniq.com",
    role: "Manager",
    status: "Active",
    lastActive: "1 hour ago",
    initials: "MC",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@churniq.com",
    role: "Analyst",
    status: "Inactive",
    lastActive: "3 days ago",
    initials: "ED",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david@churniq.com",
    role: "Viewer",
    status: "Active",
    lastActive: "5 hours ago",
    initials: "DW",
  },
];

const roleDescriptions = {
  Administrator:
    "Full access to workspace settings, users and analytics.",
  Manager:
    "Can manage customers, reports and analytics.",
  Analyst:
    "Can view and analyze customer churn data.",
  Viewer:
    "Read-only access to dashboards and reports.",
};

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Analyst",
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        role === "All" || user.role === role;

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inviteUser = (e) => {
    e.preventDefault();

    if (!newUser.name.trim() || !newUser.email.trim()) {
      return;
    }

    const user = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "Active",
      lastActive: "Invited now",
      initials: newUser.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    };

    setUsers((current) => [...current, user]);

    setNewUser({
      name: "",
      email: "",
      role: "Analyst",
    });

    setShowModal(false);
  };

  return (
    <div className="page-shell">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <Users size={14} />
            WORKSPACE MANAGEMENT
          </div>

          <h1>User Management</h1>

          <p>
            Manage workspace members, roles and access permissions.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="primary-btn"
            onClick={() => setShowModal(true)}
          >
            <UserPlus size={14} />
            Invite User
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={17} />
          </div>

          <span>Total Users</span>
          <strong>{users.length}</strong>
          <small>Workspace members</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <ShieldCheck size={17} />
          </div>

          <span>Active Users</span>
          <strong>{activeUsers}</strong>
          <small className="positive">
            {Math.round((activeUsers / users.length) * 100)}% active
          </small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <UserRound size={17} />
          </div>

          <span>Administrators</span>
          <strong>
            {users.filter(
              (user) => user.role === "Administrator"
            ).length}
          </strong>

          <small>Full workspace access</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Mail size={17} />
          </div>

          <span>Pending Invites</span>
          <strong>3</strong>
          <small>Awaiting response</small>
        </div>
      </div>

      {/* FILTER */}
      <div className="audit-toolbar">
        <div className="audit-search">
          <Search size={15} />

          <input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="audit-filter"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Administrator">
            Administrator
          </option>
          <option value="Manager">Manager</option>
          <option value="Analyst">Analyst</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {/* USERS TABLE */}
      <div className="audit-table-card">
        <div className="card-header">
          <div>
            <h2>Workspace Members</h2>
            <p>
              Manage team members and their workspace permissions.
            </p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>USER</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>LAST ACTIVE</th>
                <th>ACCESS</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">
                        {user.initials}
                      </div>

                      <div>
                        <strong>{user.name}</strong>
                        <small>{user.email}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="soft-badge">
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-pill ${
                        user.status === "Active"
                          ? "success"
                          : "warning"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#6d7890",
                        fontSize: 9,
                      }}
                    >
                      <Clock3 size={13} />
                      {user.lastActive}
                    </div>
                  </td>

                  <td>
                    <span
                      style={{
                        color: "#7d899e",
                        fontSize: 9,
                      }}
                    >
                      {roleDescriptions[user.role]}
                    </span>
                  </td>

                  <td>
                    <button className="icon-btn">
                      <MoreHorizontal size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROLE CARDS */}
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            marginBottom: 12,
            color: "#273650",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Role Permissions
        </div>

        <div className="card-grid">
          {Object.entries(roleDescriptions).map(
            ([roleName, description]) => (
              <div className="card" key={roleName}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 9,
                    background: "#eef0ff",
                    color: "#6366f1",
                  }}
                >
                  <ShieldCheck size={17} />
                </div>

                <h3
                  style={{
                    margin: "12px 0 5px",
                    color: "#263550",
                    fontSize: 12,
                  }}
                >
                  {roleName}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#8994a8",
                    fontSize: 9,
                    lineHeight: 1.5,
                  }}
                >
                  {description}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* INVITE MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>Invite New User</h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#8994a8",
                    fontSize: 9,
                  }}
                >
                  Add a new member to your workspace.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={inviteUser}>
              <div
                className="form-grid"
                style={{ marginTop: 20 }}
              >
                <div className="form-group full">
                  <label>FULL NAME</label>

                  <input
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-group full">
                  <label>EMAIL ADDRESS</label>

                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        email: e.target.value,
                      })
                    }
                    placeholder="name@company.com"
                  />
                </div>

                <div className="form-group full">
                  <label>ROLE</label>

                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        role: e.target.value,
                      })
                    }
                  >
                    <option>Administrator</option>
                    <option>Manager</option>
                    <option>Analyst</option>
                    <option>Viewer</option>
                  </select>
                </div>
              </div>

              <div className="settings-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  <Mail size={14} />
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}