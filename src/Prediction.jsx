
import { useState } from "react";
import {
  Brain,
  Search,
  User,
  CreditCard,
  CalendarDays,
  Activity,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

const initialForm = {
  name: "",
  tenure: "12",
  monthlySpend: "79",
  plan: "Standard",
  usage: "Medium",
  supportTickets: "1",
  contract: "Monthly",
  latePayments: "0",
};

const fieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: "1px solid var(--border-color, #e5e7eb)",
  borderRadius: 9,
  background: "var(--card-bg, #fff)",
  color: "var(--text-color, #111827)",
  fontSize: 13,
  outline: "none",
};

const cardStyle = {
  background: "var(--card-bg, #fff)",
  border: "1px solid var(--border-color, #e5e7eb)",
  borderRadius: 16,
  padding: 20,
  minWidth: 0,
};

const muted = { color: "var(--muted-text, #64748b)" };
const textColor = { color: "var(--text-color, #111827)" };

function Field({ label, icon: Icon, children }) {
  return (
    <label style={{ display: "grid", gap: 8, minWidth: 0 }}>
      <span style={{ ...textColor, fontSize: 12, fontWeight: 600 }}>{label}</span>
      <div style={{ position: "relative" }}>
        {Icon && (
          <Icon
            size={16}
            color="#94a3b8"
            style={{ position: "absolute", left: 12, top: 12, pointerEvents: "none" }}
          />
        )}
        {children}
      </div>
    </label>
  );
}

function SelectField({ label, value, onChange, options, icon }) {
  return (
    <Field label={label} icon={icon}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...fieldStyle, paddingLeft: icon ? 38 : 12 }}
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </Field>
  );
}

function NumberField({ label, value, onChange, min = 0, max = 100000, icon }) {
  return (
    <Field label={label} icon={icon}>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...fieldStyle, paddingLeft: icon ? 38 : 12 }}
      />
    </Field>
  );
}

function getPrediction(form) {
  // Demo-only heuristic. Replace with a trained ML model API later.
  let score = 15;

  const tenure = Number(form.tenure);
  const spend = Number(form.monthlySpend);
  const tickets = Number(form.supportTickets);
  const late = Number(form.latePayments);

  if (tenure < 3) score += 18;
  else if (tenure < 12) score += 9;
  else score -= 5;

  if (spend > 150) score += 7;
  if (spend < 40) score += 8;

  if (form.plan === "Basic") score += 10;
  if (form.plan === "Premium") score -= 5;

  if (form.usage === "Low") score += 22;
  if (form.usage === "Medium") score += 8;
  if (form.usage === "High") score -= 7;

  score += Math.min(tickets * 5, 20);
  score += Math.min(late * 8, 24);

  if (form.contract === "Annual") score -= 15;
  if (form.contract === "Two-year") score -= 22;

  score = Math.max(2, Math.min(98, score));

  const level = score >= 65 ? "High" : score >= 35 ? "Medium" : "Low";

  const recommendations = [];
  if (form.usage === "Low") {
    recommendations.push("Offer a guided onboarding session and personalized usage tips.");
  }
  if (tickets >= 3) {
    recommendations.push("Review unresolved support issues and provide a follow-up.");
  }
  if (late >= 2) {
    recommendations.push("Check billing friction and offer payment assistance options.");
  }
  if (form.plan === "Basic") {
    recommendations.push("Explore whether a suitable plan or feature bundle better fits the customer.");
  }
  if (tenure < 3) {
    recommendations.push("Start a new-customer check-in to understand early experience.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Continue regular engagement and monitor changes in usage and support activity.");
  }

  return { score, level, recommendations };
}

export default function PredictionPage() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  const runPrediction = (e) => {
    e.preventDefault();
    setResult(getPrediction(form));
  };

  const reset = () => {
    setForm(initialForm);
    setResult(null);
  };

  const riskColor =
    result?.level === "High"
      ? "#dc2626"
      : result?.level === "Medium"
      ? "#d97706"
      : "#16a34a";

  const RiskIcon =
    result?.level === "High"
      ? ShieldAlert
      : result?.level === "Medium"
      ? AlertTriangle
      : ShieldCheck;

  return (
    <div style={{ display: "grid", gap: 22 }}>
      {/* Header */}
      <div>
        <h1 style={{ ...textColor, fontSize: 25, margin: 0 }}>Churn Prediction</h1>
        <p style={{ ...muted, fontSize: 13, margin: "7px 0 0" }}>
          Estimate customer churn risk using customer profile and activity inputs.
        </p>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
        }}
      >
        {[
          { label: "Prediction Engine", value: "Demo mode", icon: Brain, color: "#6366f1" },
          { label: "Input Features", value: "8 fields", icon: Activity, color: "#06b6d4" },
          { label: "Risk Categories", value: "3 levels", icon: ShieldAlert, color: "#f59e0b" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: 12, color: item.color, background: `${item.color}18` }}>
                  <Icon size={20} />
                </span>
                <div>
                  <div style={{ ...muted, fontSize: 11 }}>{item.label}</div>
                  <div style={{ ...textColor, fontSize: 17, fontWeight: 700, marginTop: 4 }}>{item.value}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* Input form */}
        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: 12, color: "#6366f1", background: "#6366f118" }}>
              <User size={20} />
            </span>
            <div>
              <h2 style={{ ...textColor, fontSize: 17, margin: 0 }}>Customer Profile</h2>
              <p style={{ ...muted, fontSize: 11, margin: "4px 0 0" }}>Enter customer information</p>
            </div>
          </div>

          <form onSubmit={runPrediction} style={{ display: "grid", gap: 16 }}>
            <Field label="Customer Name" icon={User}>
              <input
                type="text"
                placeholder="Enter customer name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                style={{ ...fieldStyle, paddingLeft: 38 }}
              />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 13 }}>
              <NumberField label="Tenure (months)" value={form.tenure} onChange={(v) => update("tenure", v)} max={600} icon={CalendarDays} />
              <NumberField label="Monthly Spend ($)" value={form.monthlySpend} onChange={(v) => update("monthlySpend", v)} max={100000} icon={CreditCard} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 13 }}>
              <SelectField label="Subscription Plan" value={form.plan} onChange={(v) => update("plan", v)} options={["Basic", "Standard", "Premium"]} icon={CreditCard} />
              <SelectField label="Usage Level" value={form.usage} onChange={(v) => update("usage", v)} options={["Low", "Medium", "High"]} icon={Activity} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 13 }}>
              <NumberField label="Support Tickets" value={form.supportTickets} onChange={(v) => update("supportTickets", v)} max={100} icon={Search} />
              <NumberField label="Late Payments" value={form.latePayments} onChange={(v) => update("latePayments", v)} max={100} icon={CreditCard} />
            </div>

            <SelectField
              label="Contract Type"
              value={form.contract}
              onChange={(v) => update("contract", v)}
              options={["Monthly", "Annual", "Two-year"]}
              icon={CalendarDays}
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  minWidth: 160,
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 16px",
                  border: 0,
                  borderRadius: 10,
                  color: "#fff",
                  background: "#4f46e5",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Brain size={17} />
                Predict Churn Risk
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={reset}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  padding: "12px 15px",
                  border: "1px solid var(--border-color, #e5e7eb)",
                  borderRadius: 10,
                  color: "var(--text-color, #111827)",
                  background: "var(--card-bg, #fff)",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={15} />
                Reset
              </button>
            </div>
          </form>
        </section>

        {/* Results panel */}
        <section style={{ display: "grid", gap: 16 }}>
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: 12, background: "#6366f118", color: "#6366f1" }}>
                <Brain size={20} />
              </span>
              <div>
                <h2 style={{ ...textColor, fontSize: 17, margin: 0 }}>Prediction Result</h2>
                <p style={{ ...muted, fontSize: 11, margin: "4px 0 0" }}>Risk estimate for the entered profile</p>
              </div>
            </div>

            {!result ? (
              <div style={{ textAlign: "center", padding: "48px 12px 42px" }}>
                <div style={{ width: 70, height: 70, margin: "0 auto 16px", display: "grid", placeItems: "center", borderRadius: "50%", background: "#6366f115", color: "#6366f1" }}>
                  <Brain size={32} />
                </div>
                <h3 style={{ ...textColor, fontSize: 16, margin: "0 0 8px" }}>Ready to analyze</h3>
                <p style={{ ...muted, fontSize: 12, lineHeight: 1.7, maxWidth: 280, margin: "0 auto" }}>
                  Fill in the customer profile and run a prediction to view the estimated churn risk.
                </p>
              </div>
            ) : (
              <div style={{ paddingTop: 26 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ ...muted, fontSize: 12 }}>Estimated churn probability</div>
                  <div style={{ ...textColor, fontSize: 48, fontWeight: 800, margin: "10px 0 8px", letterSpacing: -2 }}>
                    {result.score}%
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: riskColor, background: `${riskColor}15`, borderRadius: 30, padding: "7px 13px", fontSize: 12, fontWeight: 700 }}>
                    <RiskIcon size={15} />
                    {result.level} Risk
                  </span>
                </div>

                <div style={{ marginTop: 26 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", ...muted, fontSize: 11, marginBottom: 8 }}>
                    <span>Risk indicator</span>
                    <span>{result.score}/100</span>
                  </div>
                  <div style={{ height: 10, background: "var(--border-color, #e5e7eb)", borderRadius: 20, overflow: "hidden" }}>
                    <div style={{ width: `${result.score}%`, height: "100%", background: riskColor, borderRadius: 20, transition: "width 0.3s ease" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", ...muted, fontSize: 10, marginTop: 7 }}>
                    <span>Low</span><span>Medium</span><span>High</span>
                  </div>
                </div>

                <div style={{ marginTop: 24, padding: 14, borderRadius: 12, background: `${riskColor}0d`, border: `1px solid ${riskColor}35` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: riskColor, fontWeight: 700, fontSize: 13 }}>
                    <RiskIcon size={17} />
                    {result.level === "High" ? "Immediate review suggested" : result.level === "Medium" ? "Monitor customer activity" : "Continue regular engagement"}
                  </div>
                  <p style={{ ...muted, fontSize: 11, lineHeight: 1.6, margin: "8px 0 0" }}>
                    {result.level === "High"
                      ? "This demo estimate indicates elevated risk. Review the customer's recent experience and consider a timely support follow-up."
                      : result.level === "Medium"
                      ? "The profile has some risk indicators. Monitor usage, billing, and customer feedback."
                      : "The profile has fewer risk indicators in this demo calculation. Continue normal retention activities."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {result && (
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
                <Lightbulb size={19} color="#d97706" />
                <h3 style={{ ...textColor, fontSize: 15, margin: 0 }}>Suggested Actions</h3>
              </div>
              <div style={{ display: "grid", gap: 11 }}>
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                    <span style={{ width: 21, height: 21, flexShrink: 0, display: "grid", placeItems: "center", borderRadius: "50%", background: "#6366f118", color: "#6366f1", fontSize: 11, fontWeight: 700 }}>
                      {index + 1}
                    </span>
                    <p style={{ ...muted, fontSize: 12, lineHeight: 1.6, margin: 0 }}>{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Demo notice */}
      <div style={{ ...cardStyle, display: "flex", gap: 11, alignItems: "flex-start", borderLeft: "4px solid #f59e0b" }}>
        <AlertTriangle size={19} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <h3 style={{ ...textColor, fontSize: 13, margin: 0 }}>Demo prediction — not a trained ML model</h3>
          <p style={{ ...muted, fontSize: 11, lineHeight: 1.7, margin: "6px 0 0" }}>
            This screen currently uses a simple illustrative heuristic to demonstrate the UI flow.
            The displayed percentage is not a validated probability. Later, connect it to your
            trained churn model through a backend API and use its actual prediction output.
          </p>
        </div>
      </div>
    </div>
  );
}