
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock3,
  Cpu,
  Database,
  Download,
  HardDrive,
  RefreshCw,
  Server,
  ShieldCheck,
  Wifi,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./SystemHealth.css";

const responseData = [
  { time: "09:00", response: 118 },
  { time: "09:10", response: 132 },
  { time: "09:20", response: 126 },
  { time: "09:30", response: 145 },
  { time: "09:40", response: 139 },
  { time: "09:50", response: 158 },
  { time: "10:00", response: 142 },
  { time: "10:10", response: 135 },
  { time: "10:20", response: 151 },
  { time: "10:30", response: 128 },
  { time: "10:40", response: 122 },
  { time: "10:50", response: 130 },
];

const initialServices = [
  {
    name: "Application Server",
    description: "Main dashboard and application services",
    icon: Server,
    status: "Operational",
    uptime: "99.98%",
    latency: "142 ms",
    checked: "Just now",
  },
  {
    name: "Database",
    description: "Customer records and analytics data",
    icon: Database,
    status: "Operational",
    uptime: "99.99%",
    latency: "24 ms",
    checked: "Just now",
  },
  {
    name: "Prediction Engine",
    description: "Churn risk scoring service",
    icon: Activity,
    status: "Operational",
    uptime: "99.95%",
    latency: "186 ms",
    checked: "1 min ago",
  },
  {
    name: "Authentication",
    description: "Login and access management",
    icon: ShieldCheck,
    status: "Operational",
    uptime: "99.97%",
    latency: "78 ms",
    checked: "Just now",
  },
  {
    name: "Data Import Service",
    description: "CSV validation and import processing",
    icon: HardDrive,
    status: "Degraded",
    uptime: "98.72%",
    latency: "420 ms",
    checked: "2 min ago",
  },
];

const initialEvents = [
  {
    id: 1,
    title: "Database health check completed",
    description: "Connection pool is responding normally.",
    time: "10:48 AM",
    type: "success",
  },
  {
    id: 2,
    title: "Data Import latency elevated",
    description: "Import processing response time is above its normal range.",
    time: "10:42 AM",
    type: "warning",
  },
  {
    id: 3,
    title: "Prediction service check passed",
    description: "Prediction engine responded successfully.",
    time: "10:35 AM",
    type: "success",
  },
  {
    id: 4,
    title: "Scheduled maintenance completed",
    description: "Routine maintenance task marked as completed.",
    time: "09:15 AM",
    type: "info",
  },
];

function StatusBadge({ status }) {
  const normalized = status.toLowerCase();

  return (
    <span className={`health-status ${normalized}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  trend,
  tone = "blue",
}) {
  return (
    <article className="health-metric-card">
      <div className={`health-metric-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <div className="health-metric-content">
        <span className="health-metric-label">{label}</span>
        <strong>{value}</strong>
        <span className="health-metric-detail">
          {trend && (
            <span className={`metric-trend ${trend.direction}`}>
              {trend.direction === "down" ? (
                <ArrowDown size={13} />
              ) : (
                <ArrowUp size={13} />
              )}
              {trend.text}
            </span>
          )}
          {detail}
        </span>
      </div>
    </article>
  );
}

export default function SystemHealth() {
  const [services, setServices] = useState(initialServices);
  const [events, setEvents] = useState(initialEvents);
  const [range, setRange] = useState("1 hour");
  const [lastChecked, setLastChecked] = useState("Just now");
  const [checking, setChecking] = useState(false);

  const operationalCount = services.filter(
    (service) => service.status === "Operational"
  ).length;

  const overallStatus =
    services.some((service) => service.status === "Offline")
      ? "Offline"
      : services.some((service) => service.status === "Degraded")
        ? "Degraded"
        : "Operational";

  const chartData = useMemo(() => {
    if (range === "30 minutes") return responseData.slice(-6);
    if (range === "24 hours") {
      return responseData.map((item, index) => ({
        ...item,
        time: `${String(index * 2).padStart(2, "0")}:00`,
        response: item.response + (index % 3) * 14,
      }));
    }
    return responseData;
  }, [range]);

  const runHealthCheck = () => {
    setChecking(true);

    // Demo-only status refresh; does not contact a real server.
    setTimeout(() => {
      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setServices((current) =>
        current.map((service) => ({
          ...service,
          checked: "Just now",
        }))
      );
      setLastChecked(now);
      setEvents((current) => [
        {
          id: Date.now(),
          title: "Manual health check completed",
          description:
            "Demo check refreshed the displayed service timestamps.",
          time: now,
          type: "info",
        },
        ...current,
      ]);
      setChecking(false);
    }, 700);
  };

  const exportStatus = () => {
    const rows = [
      ["Service", "Status", "Uptime", "Latency", "Last Checked"],
      ...services.map((service) => [
        service.name,
        service.status,
        service.uptime,
        service.latency,
        service.checked,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "system-health-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="system-health-page">
      <div className="health-page-header">
        <div>
          <div className="health-eyebrow">
            <Activity size={14} />
            SYSTEM MONITORING
          </div>
          <h1>System Health</h1>
          <p>
            Monitor platform availability, performance, and service status.
          </p>
        </div>

        <div className="health-header-actions">
          <span className="health-last-check">
            <Clock3 size={14} />
            Updated {lastChecked}
          </span>
          <button
            className="health-secondary-button"
            onClick={runHealthCheck}
            disabled={checking}
          >
            <RefreshCw size={15} className={checking ? "spin-icon" : ""} />
            {checking ? "Checking..." : "Run health check"}
          </button>
          <button className="health-primary-button" onClick={exportStatus}>
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      <section className={`health-overview-banner ${overallStatus.toLowerCase()}`}>
        <div className="health-overview-icon">
          {overallStatus === "Operational" ? (
            <CheckCircle2 size={22} />
          ) : overallStatus === "Degraded" ? (
            <AlertTriangle size={22} />
          ) : (
            <XCircle size={22} />
          )}
        </div>
        <div className="health-overview-copy">
          <strong>
            {overallStatus === "Operational"
              ? "All systems operational"
              : overallStatus === "Degraded"
                ? "Some services need attention"
                : "Service interruption detected"}
          </strong>
          <span>
            {operationalCount} of {services.length} services are operational.
            Displayed statuses are sample monitoring data.
          </span>
        </div>
        <StatusBadge status={overallStatus} />
      </section>

      <section className="health-metrics-grid">
        <MetricCard
          icon={Activity}
          label="Platform uptime"
          value="99.98%"
          detail="Illustrative 30-day figure"
          trend={{ direction: "up", text: "+0.04%" }}
          tone="green"
        />
        <MetricCard
          icon={Clock3}
          label="Avg. response time"
          value="142 ms"
          detail="Sample service response"
          trend={{ direction: "down", text: "-8.2%" }}
          tone="blue"
        />
        <MetricCard
          icon={Server}
          label="Services online"
          value={`${operationalCount}/${services.length}`}
          detail="Based on displayed statuses"
          tone="purple"
        />
        <MetricCard
          icon={Cpu}
          label="CPU utilization"
          value="38.6%"
          detail="Illustrative resource metric"
          tone="orange"
        />
      </section>

      <section className="health-main-grid">
        <article className="health-panel health-chart-panel">
          <div className="health-panel-header">
            <div>
              <h2>Response time</h2>
              <p>Average application response time</p>
            </div>
            <select
              className="health-range-select"
              value={range}
              onChange={(event) => setRange(event.target.value)}
              aria-label="Response time range"
            >
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>24 hours</option>
            </select>
          </div>

          <div className="health-chart-summary">
            <strong>142 <small>ms</small></strong>
            <span className="chart-positive">
              <ArrowDown size={13} /> 8.2% vs. previous period
            </span>
          </div>

          <div className="health-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="responseFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3978e8" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#3978e8" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#edf0f5" strokeDasharray="4 4" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#9299a8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={20}
                />
                <YAxis
                  tick={{ fill: "#9299a8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={42}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e8ebf1",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value} ms`, "Response"]}
                />
                <Area
                  type="monotone"
                  dataKey="response"
                  stroke="#3978e8"
                  strokeWidth={2.5}
                  fill="url(#responseFill)"
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="health-chart-footnote">
            <span><i className="legend-dot" /> Response time</span>
            <span>Sample data · Not connected to live telemetry</span>
          </div>
        </article>

        <article className="health-panel resource-panel">
          <div className="health-panel-header">
            <div>
              <h2>Resource utilization</h2>
              <p>Illustrative infrastructure metrics</p>
            </div>
            <span className="health-live-label">
              <span /> DEMO
            </span>
          </div>

          <div className="resource-list">
            <div className="resource-item">
              <div className="resource-item-top">
                <span><Cpu size={16} /> CPU usage</span>
                <strong>38.6%</strong>
              </div>
              <div className="resource-track">
                <div className="resource-fill cpu-fill" style={{ width: "38.6%" }} />
              </div>
              <small>Within illustrative normal range</small>
            </div>
            <div className="resource-item">
              <div className="resource-item-top">
                <span><Database size={16} /> Memory usage</span>
                <strong>64.2%</strong>
              </div>
              <div className="resource-track">
                <div className="resource-fill memory-fill" style={{ width: "64.2%" }} />
              </div>
              <small>Sample memory utilization</small>
            </div>
            <div className="resource-item">
              <div className="resource-item-top">
                <span><HardDrive size={16} /> Storage usage</span>
                <strong>52.8%</strong>
              </div>
              <div className="resource-track">
                <div className="resource-fill storage-fill" style={{ width: "52.8%" }} />
              </div>
              <small>Sample disk capacity usage</small>
            </div>
            <div className="resource-item">
              <div className="resource-item-top">
                <span><Wifi size={16} /> Network usage</span>
                <strong>27.4%</strong>
              </div>
              <div className="resource-track">
                <div className="resource-fill network-fill" style={{ width: "27.4%" }} />
              </div>
              <small>Sample network utilization</small>
            </div>
          </div>
        </article>
      </section>

      <section className="health-panel services-panel">
        <div className="health-panel-header services-header">
          <div>
            <h2>Service status</h2>
            <p>Current status of application components</p>
          </div>
          <span className="service-count">
            {services.length} services monitored
          </span>
        </div>

        <div className="health-services-table-wrap">
          <table className="health-services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Uptime</th>
                <th>Latency</th>
                <th>Last checked</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <tr key={service.name}>
                    <td>
                      <div className="service-name-cell">
                        <span className="service-icon"><Icon size={17} /></span>
                        <span>
                          <strong>{service.name}</strong>
                          <small>{service.description}</small>
                        </span>
                      </div>
                    </td>
                    <td><StatusBadge status={service.status} /></td>
                    <td className="health-table-number">{service.uptime}</td>
                    <td className="health-table-number">{service.latency}</td>
                    <td className="health-table-muted">{service.checked}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="health-panel events-panel">
        <div className="health-panel-header">
          <div>
            <h2>Recent system events</h2>
            <p>Latest sample monitoring activity</p>
          </div>
          <span className="events-total">{events.length} events</span>
        </div>

        <div className="health-events-list">
          {events.map((event) => (
            <div className="health-event-row" key={event.id}>
              <span className={`health-event-icon ${event.type}`}>
                {event.type === "success" ? (
                  <CheckCircle2 size={17} />
                ) : event.type === "warning" ? (
                  <AlertTriangle size={17} />
                ) : (
                  <Activity size={17} />
                )}
              </span>
              <div className="health-event-copy">
                <strong>{event.title}</strong>
                <p>{event.description}</p>
              </div>
              <time>{event.time}</time>
            </div>
          ))}
        </div>
      </section>

      <div className="health-demo-note">
        <AlertTriangle size={15} />
        <span>
          Demo UI: service states, uptime, resource values, and events are
          illustrative. Connect real server monitoring, API health checks,
          and persistent event logs before using this as a production status
          page.
        </span>
      </div>
    </main>
  );
}