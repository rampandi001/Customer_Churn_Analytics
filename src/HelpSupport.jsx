import { useState } from "react";
import {
  HelpCircle,
  Search,
  MessageCircle,
  BookOpen,
  Mail,
  ChevronDown,
  ExternalLink,
  Clock,
  ShieldCheck,
} from "lucide-react";

const faqs = [
  {
    q: "How is churn risk calculated?",
    a: "Churn risk is estimated from customer activity, subscription information, engagement, and other available customer attributes. This project currently uses demo data for UI demonstration.",
  },
  {
    q: "How can I import customer data?",
    a: "Open Data Import from the sidebar and upload your customer dataset. You can review the imported records before using them in analytics.",
  },
  {
    q: "Can I export reports?",
    a: "Yes. Reports can be exported from the Reports page using the available export actions.",
  },
  {
    q: "Is the prediction model connected to a real ML backend?",
    a: "The current application is a frontend analytics prototype. A real machine-learning backend can be connected later through REST APIs.",
  },
  {
    q: "How do I manage users?",
    a: "Open User Management from the sidebar. Administrators can review users, roles, permissions, and account status.",
  },
  {
    q: "Where can I view security activity?",
    a: "Security-related activity can be reviewed through Security & Access and Audit Logs.",
  },
];

export default function HelpSupport() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(0);

  const filteredFaqs = faqs.filter((item) =>
    `${item.q} ${item.a}`.toLowerCase().includes(search.toLowerCase())
  );

  const page = {
    maxWidth: "1100px",
    margin: "0 auto",
    paddingBottom: "40px",
  };

  const card = {
    background: "#ffffff",
    border: "1px solid #e7eaf2",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(30, 40, 80, 0.05)",
  };

  return (
    <div style={page}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "28px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#6366f1",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            <HelpCircle size={15} />
            SUPPORT CENTER
          </div>

          <h1
            style={{
              margin: 0,
              color: "#17213d",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            Help & Support
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#7b8499",
              fontSize: "13px",
            }}
          >
            Find answers, browse common questions, and contact the support team.
          </p>
        </div>

        <button
          style={{
            border: "0",
            background: "#6366f1",
            color: "#fff",
            borderRadius: "9px",
            padding: "11px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "12px",
          }}
        >
          <MessageCircle size={15} />
          Contact Support
        </button>
      </div>

      {/* Search */}
      <div
        style={{
          ...card,
          padding: "16px",
          marginBottom: "22px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "1px solid #e1e5ef",
            borderRadius: "10px",
            padding: "0 13px",
            height: "44px",
          }}
        >
          <Search size={17} color="#929aae" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help articles and FAQs..."
            style={{
              border: 0,
              outline: 0,
              flex: 1,
              fontSize: "13px",
              color: "#34405a",
              background: "transparent",
            }}
          />
        </div>
      </div>

      {/* Support cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "30px",
        }}
      >
        <SupportCard
          icon={BookOpen}
          title="Documentation"
          text="Learn how the analytics dashboard works."
          action="Browse guides"
        />

        <SupportCard
          icon={MessageCircle}
          title="Contact Support"
          text="Send a support request to the analytics team."
          action="Create request"
        />

        <SupportCard
          icon={Mail}
          title="Email Support"
          text="Get help with account and workspace issues."
          action="Send email"
        />
      </div>

      {/* FAQ */}
      <div style={{ ...card, padding: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#1b2744",
                fontSize: "18px",
              }}
            >
              Frequently Asked Questions
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#8a93a7",
                fontSize: "12px",
              }}
            >
              Quick answers to common questions.
            </p>
          </div>

          <div
            style={{
              padding: "6px 10px",
              background: "#f2f3ff",
              color: "#6366d9",
              borderRadius: "7px",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            {filteredFaqs.length} Articles
          </div>
        </div>

        <div>
          {filteredFaqs.map((item, index) => {
            const isOpen = open === index;

            return (
              <div
                key={item.q}
                style={{
                  border: "1px solid #edf0f5",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  style={{
                    width: "100%",
                    border: 0,
                    background: isOpen ? "#f7f7ff" : "#fff",
                    padding: "15px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#35405a",
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                      transition: "0.2s",
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 16px 16px",
                      color: "#7d879c",
                      fontSize: "12px",
                      lineHeight: 1.7,
                      background: "#f7f7ff",
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom note */}
      <div
        style={{
          marginTop: "18px",
          padding: "14px 16px",
          background: "#f5f8ff",
          border: "1px solid #e4eaff",
          borderRadius: "12px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <ShieldCheck size={18} color="#6366f1" />

        <div>
          <strong
            style={{
              color: "#39435c",
              fontSize: "11px",
            }}
          >
            Need additional help?
          </strong>

          <div
            style={{
              color: "#8a93a7",
              fontSize: "10px",
              marginTop: "3px",
            }}
          >
            Support is available for workspace, security, data import, and
            analytics questions.
          </div>
        </div>

        <Clock
          size={16}
          color="#929aae"
          style={{ marginLeft: "auto" }}
        />
      </div>
    </div>
  );
}

function SupportCard({ icon: Icon, title, text, action }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e7eaf2",
        borderRadius: "15px",
        padding: "20px",
        minHeight: "145px",
        boxShadow: "0 6px 20px rgba(30,40,80,0.04)",
      }}
    >
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "10px",
          background: "#f0efff",
          color: "#6366d9",
          display: "grid",
          placeItems: "center",
          marginBottom: "14px",
        }}
      >
        <Icon size={18} />
      </div>

      <h3
        style={{
          margin: 0,
          fontSize: "13px",
          color: "#303b55",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "7px 0 13px",
          color: "#8b94a7",
          fontSize: "11px",
          lineHeight: 1.5,
        }}
      >
        {text}
      </p>

      <button
        style={{
          border: 0,
          background: "transparent",
          color: "#6366d9",
          padding: 0,
          fontSize: "10px",
          fontWeight: 800,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {action}
        <ExternalLink size={12} />
      </button>
    </div>
  );
}