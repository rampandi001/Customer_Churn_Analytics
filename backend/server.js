const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const Customer = require("./models/Customer");
const customerRoutes = require("./routes/customerRoutes");

const app = express();

/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://churniq-backend-0c1x.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // such as Postman/curl/server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow known origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel deployments
      if (
        origin.endsWith(".vercel.app") ||
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("⚠️ CORS blocked:", origin);

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
  })
);

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* =========================================================
   DATABASE
========================================================= */

connectDB();

/* =========================================================
   ROOT
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ChurnIQ Backend is running 🚀",
    service: "ChurnIQ API",
    status: "online",
  });
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "ChurnIQ API",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

/* =========================================================
   CUSTOMER ROUTES
========================================================= */

console.log(
  "Customer routes type:",
  typeof customerRoutes
);

app.use(
  "/api/customers",
  customerRoutes
);

/* =========================================================
   ANALYTICS TEST
========================================================= */

app.get("/api/analytics-test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Analytics endpoint is working 🚀",
  });
});

/* =========================================================
   ANALYTICS SUMMARY
========================================================= */

app.get(
  "/api/analytics/summary",
  async (req, res) => {
    try {
      console.log(
        "📊 Analytics summary requested"
      );

      const customers =
        await Customer.find().lean();

      const totalCustomers =
        customers.length;

      const highRisk =
        customers.filter(
          (customer) =>
            customer.churnStatus === "High"
        ).length;

      const mediumRisk =
        customers.filter(
          (customer) =>
            customer.churnStatus === "Medium"
        ).length;

      const lowRisk =
        customers.filter(
          (customer) =>
            customer.churnStatus === "Low"
        ).length;

      const totalRevenue =
        customers.reduce(
          (total, customer) =>
            total +
            Number(
              customer.monthlySpend || 0
            ),
          0
        );

      const averageChurnScore =
        totalCustomers > 0
          ? customers.reduce(
              (total, customer) =>
                total +
                Number(
                  customer.churnRisk || 0
                ),
              0
            ) / totalCustomers
          : 0;

      const subscriptionBreakdown = {};

      customers.forEach((customer) => {
        const plan =
          customer.subscription ||
          "Unknown";

        subscriptionBreakdown[plan] =
          (subscriptionBreakdown[plan] || 0) +
          1;
      });

      const analyticsData = {
        totalCustomers,
        highRisk,
        mediumRisk,
        lowRisk,
        totalRevenue,
        averageChurnScore: Number(
          averageChurnScore.toFixed(2)
        ),
        subscriptionBreakdown,
      };

      console.log(
        "📊 Analytics result:",
        analyticsData
      );

      return res.status(200).json({
        success: true,
        data: analyticsData,
      });
    } catch (error) {
      console.error(
        "❌ Analytics error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to generate analytics",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  console.log(
    `❌ 404: ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    success: false,
    message: "Route not found",
    route: req.originalUrl,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(
  (error, req, res, next) => {
    console.error(
      "❌ Server error:",
      error.message
    );

    if (
      error.message ===
      "Not allowed by CORS"
    ) {
      return res.status(403).json({
        success: false,
        message: "CORS origin not allowed",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
);

/* =========================================================
   SERVER
========================================================= */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 ChurnIQ Backend running on port ${PORT}`
  );
});