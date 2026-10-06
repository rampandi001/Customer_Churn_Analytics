const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

/* =========================
   DATABASE
========================= */

connectDB();

/* =========================
   CORS
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "http://localhost:4174",
  "http://localhost:4175",
  "http://localhost:4176",
];

const isAllowedOrigin = (origin) => {
  // Allow requests without an origin
  // such as Postman or server-side requests
  if (!origin) {
    return true;
  }

  // Allow ANY localhost port
  if (/^http:\/\/localhost:\d+$/.test(origin)) {
    return true;
  }

  // Allow Vercel deployments
  if (origin.endsWith(".vercel.app")) {
    return true;
  }

  // Allow explicitly listed origins
  return allowedOrigins.includes(origin);
};

app.use(
  cors({
    origin: function (origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
    ],

    credentials: false,

    optionsSuccessStatus: 204,
  })
);

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

/* =========================
   ROUTES
========================= */

const customerRoutes = require("./routes/customerRoutes");

app.use("/api/customers", customerRoutes);

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ChurnIQ backend is running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

/* =========================
   ANALYTICS
========================= */

const Customer = require("./models/Customer");

app.get("/api/analytics/summary", async (req, res) => {
  try {
    const customers = await Customer.find();

    const totalCustomers = customers.length;

    const highRisk = customers.filter(
      (customer) =>
        customer.churnStatus === "High"
    ).length;

    const mediumRisk = customers.filter(
      (customer) =>
        customer.churnStatus === "Medium"
    ).length;

    const lowRisk = customers.filter(
      (customer) =>
        customer.churnStatus === "Low"
    ).length;

    const totalRevenue = customers.reduce(
      (total, customer) =>
        total +
        Number(customer.monthlySpend || 0),
      0
    );

    const averageChurnScore =
      totalCustomers > 0
        ? customers.reduce(
            (total, customer) =>
              total +
              Number(customer.churnRisk || 0),
            0
          ) / totalCustomers
        : 0;

    const subscriptionBreakdown = {};

    customers.forEach((customer) => {
      const subscription =
        customer.subscription || "Unknown";

      subscriptionBreakdown[subscription] =
        (subscriptionBreakdown[subscription] || 0) +
        1;
    });

    res.json({
      totalCustomers,
      highRisk,
      mediumRisk,
      lowRisk,
      totalRevenue,
      averageChurnScore,
      subscriptionBreakdown,
    });
  } catch (error) {
    console.error(
      "Analytics error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to load analytics",
      error: error.message,
    });
  }
});

/* =========================
   ROOT
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ChurnIQ Backend API",
  });
});

/* =========================
   404
========================= */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((error, req, res, next) => {
  console.error(
    "Server error:",
    error.message
  );

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS origin not allowed",
    });
  }

  res.status(500).json({
    message: "Internal server error",
  });
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 ChurnIQ Backend running on port ${PORT}`
  );
});