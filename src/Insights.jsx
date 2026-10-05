
import { useMemo, useState } from "react";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Users,
  ShieldAlert,
  Target,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download,
  Sparkles,
  CircleAlert,
  CheckCircle2,
  BarChart3,
  Clock3,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const monthlyData = [
  { month: "Apr", churn: 8.2, retained: 91.8 },
  { month: "May", churn: 7.5, retained: 92.5 },
  { month: "Jun", churn: 9.1, retained: 90.9 },
  { month: "Jul", churn: 6.8, retained: 93.2 },
  { month: "Aug", churn: 5.9, retained: 94.1 },
  { month: "Sep", churn: 5.2, retained: 94.8 },
];

const planData = [
  { plan: "Basic", churn: 12.4 },
  { plan: "Standard", churn: 8.1 },
  { plan: "Premium", churn: 4.3 },
  { plan: "Enterprise", churn: 2.1 },
];

const reasonData = [
  { name: "Price concerns", value: 35 },
  { name: "Poor experience", value: 25 },
  { name: "Competitor", value: 20 },
  { name: "Low usage", value: 12 },
  { name: "Other", value: 8 },
];

const reasonColors = ["#6366f1", "#06b6d4", "#f59e0b", "#f97316", "#94a3b8"];

const insightItems = [
  {
    id: 1,
    category: "Retention",
    severity: "High",
    title: "Basic plan has the highest sample churn rate",
    description:
      "The illustrative plan data shows a 12.4% churn rate for Basic, compared with 4.3% for Premium. Review feedback, product usage, and plan fit before deciding on retention actions.",
    action: "Review Basic plan feedback",
    icon: TrendingUp,
    color: "#dc2626",
  },
  {
    id: 2,
    category: "Engagement",
    severity: "Medium",
    title: "Low usage may indicate a retention opportunity",
    description:
      "Customers with low activity can benefit from onboarding assistance, feature discovery, and relevant engagement messages. Validate this pattern against your actual customer records.",
    action: "Explore engagement strategies",
    icon: Users,
    color: "#d97706",
  },
  {
    id: 3,
    category: "Customer Experience",
    severity: "Medium",
    title: "Support experience deserves closer review",
    description:
      "The sample churn-reason breakdown assigns 25% to poor experience. Analyze support tickets and customer feedback to identify recurring service issues.",
    action: "Inspect support feedback",
    icon: CircleAlert,
    color: "#d97706",
  },
  {
    id: 4,
    category: "Performance",
    severity: "Low",
    title: "Sample monthly churn trend is declining",
    description:
      "The illustrative monthly series moves from 8.2% in April to 5.2% in September. Compare this trend with real historical data to determine whether the change is sustained.",
    action: "Compare monthly results",
    icon: TrendingDown,
    color: "#16a34a",
  },
];

const cardStyle = {
  background: "var(--card-bg, #fff)",
  border: "1px solid var(--border-color, #e5e7eb)",
  borderRadius: 16,
  padding: 20,
  minWidth: 0,
};

const textColor = { color: "var(--text-color, #111827)" };
const muted = { color: "var(--muted-text, #64748b)" };

function MetricCard({ icon: Icon, title, value, note, color, trend, positive }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <p style={{ ...muted, fontSize: 12, margin: 0 }}>{title}</p>
          <h2 style={{ ...textColor, fontSize: 26, margin: "10px 0 7px" }}>{value}</h2>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              color: positive ? "#16a34a" : "#d97706",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {positive ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
            {trend}
          </span>
        </div>
        <span
          style={{
            width: 42,
            height: 42,
            display: "grid",
            placeItems: "center",
            borderRadius: 12,
            background: `${color}18`,
            color,
            flexShrink: 0,
          }}
        >
          <Icon size={21} />
        </span>
      </div>
      <p style={{ ...muted, fontSize: 10, margin: "9px 0 0" }}>{note}</p>
    </div>
  );
}

function ChartPanel({ title, subtitle, children }) {
  return (
    <section style={cardStyle}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ ...textColor, fontSize: 16, margin: 0 }}>{title}</h3>
        <p style={{ ...muted, fontSize: 11, margin: "6px 0 0" }}>{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function InsightCard({ item, onAction }) {
  const Icon = item.icon;
  return (
    <article style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 13 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: item.color, fontSize: 11, fontWeight: 700 }}>
          <Icon size={16} />
          {item.category}
        </span>
        <span
          style={{
            padding: "5px 9px",
            borderRadius: 20,
            fontSize: 10,
            fontWeight: 700,
            color: item.color,
            background: `${item.color}15`,
          }}
        >
          {item.severity} priority
        </span>
      </div>
      <div>
        <h3 style={{ ...textColor, fontSize: 14, lineHeight: 1.5, margin: "0 0 7px" }}>{item.title}</h3>
        <p style={{ ...muted, fontSize: 11, lineHeight: 1.7, margin: 0 }}>{item.description}</p>
      </div>
      <button
        type="button"
        onClick={() => onAction(item)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          width: "100%",
          marginTop: "auto",
          padding: "10px 12px",
          border: "1px solid var(--border-color, #e5e7eb)",
          borderRadius: 9,
          background: "var(--surface-bg, #f8fafc)",
          color: "var(--text-color, #111827)",
          fontSize: 11,
          fontWeight: 650,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {item.action}
        <ArrowUpRight size={15} />
      </button>
    </article>
  );
}

export default function InsightsPage() {
  const [period, setPeriod] = useState("6 months");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedInsight, setSelectedInsight] = useState(null);

  const categories = ["All", ...new Set(insightItems.map((item) => item.category))];

  const filteredInsights = useMemo(() => {
    const query = search.trim().toLowerCase();
    return insightItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const exportInsights = () => {
    const headers = ["Category", "Priority", "Insight", "Description", "Suggested Action"];
    const rows = filteredInsights.map((item) => [
      item.category,
      item.severity,
      item.title,
      item.description,
      item.action,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "customer-churn-insights.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAction = (item) => {
    setSelectedInsight(item);
  };

  return (
    <div style={{ display: "grid", gap: 22 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <h1 style={{ ...textColor, fontSize: 25, margin: 0 }}>Customer Insights</h1>
          <p style={{ ...muted, fontSize: 13, margin: "7px 0 0" }}>
            Explore churn patterns and identify areas for further investigation.
          </p>
        </div>
        <div style={{ display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 7, border: "1px solid var(--border-color, #e5e7eb)", borderRadius: 9, padding: "9px 11px", background: "var(--card-bg, #fff)" }}>
            <CalendarDays size={15} color="#64748b" />
            <select value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="Analysis period" style={{ border: 0, outline: 0, background: "transparent", color: "var(--text-color, #111827)", fontSize: 12 }}>
              <option>30 days</option>
              <option>3 months</option>
              <option>6 months</option>
              <option>12 months</option>
            </select>
          </label>
          <button type="button" onClick={exportInsights} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 13px", border: 0, borderRadius: 9, background: "#4f46e5", color: "#fff", fontSize: 12, fontWeight: 650, cursor: "pointer" }}>
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))", gap: 14 }}>
        <MetricCard icon={TrendingDown} title="Sample Churn Rate" value="5.2%" trend="Lower in sample series" positive={true} color="#6366f1" note="Illustrative September value" />
        <MetricCard icon={Users} title="At-Risk Customers" value="1,284" trend="8.5% of sample base" positive={false} color="#f59e0b" note="Example dashboard metric" />
        <MetricCard icon={Target} title="Retention Rate" value="94.8%" trend="Higher in sample series" positive={true} color="#10b981" note="Illustrative September value" />
        <MetricCard icon={Lightbulb} title="Insights Identified" value={insightItems.length} trend="Across 4 categories" positive={true} color="#06b6d4" note="Static demo insight cards" />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 18 }}>
        <ChartPanel title="Churn and Retention Trend" subtitle={`Illustrative monthly metrics · ${period}`}>
          <div style={{ width: "100%", height: 270 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} unit="%" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="churn" name="Churn" stroke="#6366f1" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="retained" name="Retention" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Churn by Subscription Plan" subtitle="Illustrative churn percentages by plan">
          <div style={{ width: "100%", height: 270 }}>
            <ResponsiveContainer>
              <BarChart data={planData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="plan" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} unit="%" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="churn" name="Churn rate" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Churn reasons */}
      <ChartPanel title="Illustrative Churn Reasons" subtitle="Example breakdown to demonstrate the visualization">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))", alignItems: "center", gap: 12 }}>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={reasonData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={91} paddingAngle={3}>
                  {reasonData.map((item, index) => <Cell key={item.name} fill={reasonColors[index]} />)}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "grid", gap: 13 }}>
            {reasonData.map((item, index) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 9, ...textColor, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: reasonColors[index], flexShrink: 0 }} />
                  {item.name}
                </span>
                <strong style={{ ...textColor, fontSize: 12 }}>{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </ChartPanel>

      {/* Insights listing */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div>
            <h2 style={{ ...textColor, fontSize: 18, margin: 0 }}>Key Findings & Recommendations</h2>
            <p style={{ ...muted, fontSize: 12, margin: "5px 0 0" }}>Filter and review the example insights below.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, border: "1px solid var(--border-color, #e5e7eb)", borderRadius: 9, padding: "8px 10px", background: "var(--card-bg, #fff)" }}>
            <Search size={15} color="#64748b" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search insights" aria-label="Search insights" style={{ width: 135, border: 0, outline: 0, background: "transparent", color: "var(--text-color, #111827)", fontSize: 12 }} />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 15 }}>
          {categories.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} style={{ padding: "7px 12px", borderRadius: 20, border: category === item ? "1px solid #4f46e5" : "1px solid var(--border-color, #e5e7eb)", background: category === item ? "#4f46e5" : "var(--card-bg, #fff)", color: category === item ? "#fff" : "var(--text-color, #111827)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              {item}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 14 }}>
          {filteredInsights.map((item) => (
            <InsightCard key={item.id} item={item} onAction={handleAction} />
          ))}
        </div>

        {filteredInsights.length === 0 && (
          <div style={{ ...cardStyle, textAlign: "center", ...muted, fontSize: 13 }}>
            No insights match your search or category.
          </div>
        )}
      </section>

      {/* Selected insight detail */}
      {selectedInsight && (
        <section style={{ ...cardStyle, border: "1px solid #6366f155", background: "var(--card-bg, #fff)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#6366f1", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                <Sparkles size={15} /> INSIGHT DETAIL
              </div>
              <h3 style={{ ...textColor, fontSize: 16, margin: 0 }}>{selectedInsight.title}</h3>
            </div>
            <button type="button" onClick={() => setSelectedInsight(null)} aria-label="Close insight detail" style={{ border: "1px solid var(--border-color, #e5e7eb)", borderRadius: 8, padding: 7, background: "transparent", color: "var(--text-color, #111827)", cursor: "pointer" }}>
              ×
            </button>
          </div>
          <p style={{ ...muted, fontSize: 12, lineHeight: 1.7, margin: "10px 0" }}>{selectedInsight.description}</p>
          <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#6366f1", fontSize: 12, fontWeight: 650 }}>
            <CheckCircle2 size={16} /> Suggested next step: {selectedInsight.action}
          </div>
          <p style={{ ...muted, fontSize: 10, margin: "12px 0 0" }}>
            This is a suggested investigation, not an automatically executed business action.
          </p>
        </section>
      )}

      {/* Disclaimer */}
      <div style={{ ...cardStyle, display: "flex", gap: 10, alignItems: "flex-start", borderLeft: "4px solid #f59e0b" }}>
        <Clock3 size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ ...muted, fontSize: 11, lineHeight: 1.7, margin: 0 }}>
          Demo screen: charts, KPIs, churn reasons, and findings use illustrative static values.
          The period selector is currently a UI control and does not change the underlying sample dataset.
          Connect real database queries and validated analysis before using these insights operationally.
        </p>
      </div>
    </div>
  );
}