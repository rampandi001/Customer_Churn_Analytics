const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const Customer = require("./models/Customer");
const customerRoutes = require("./routes/customerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

console.log("Customer routes type:", typeof customerRoutes);

connectDB();

// ===============================
// ROOT
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ChurnIQ Backend is running 🚀",
  });
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "ChurnIQ API",
  });
});

// ===============================
// CUSTOMER ROUTES
// ===============================

app.use("/api/customers", customerRoutes);

// ===============================
// ANALYTICS TEST
// ===============================

app.get("/api/analytics-test", (req, res) => {
  res.json({
    success: true,
    message: "Analytics endpoint is working 🚀",
  });
});

// ===============================
// ANALYTICS SUMMARY
// ===============================

app.get("/api/analytics/summary", async (req, res) => {
  try {
    console.log("📊 Analytics summary requested");

    const customers = await Customer.find();

    const totalCustomers = customers.length;

    const highRisk = customers.filter(
      (customer) => customer.churnStatus === "High"
    ).length;

    const mediumRisk = customers.filter(
      (customer) => customer.churnStatus === "Medium"
    ).length;

    const lowRisk = customers.filter(
      (customer) => customer.churnStatus === "Low"
    ).length;

    const totalRevenue = customers.reduce(
      (total, customer) =>
        total + Number(customer.monthlySpend || 0),
      0
    );

    const averageChurnScore =
      totalCustomers > 0
        ? customers.reduce(
            (total, customer) =>
              total + Number(customer.churnRisk || 0),
            0
          ) / totalCustomers
        : 0;

    const subscriptionBreakdown = {};

    customers.forEach((customer) => {
      const plan = customer.subscription || "Unknown";

      subscriptionBreakdown[plan] =
        (subscriptionBreakdown[plan] || 0) + 1;
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

    console.log("📊 Analytics result:", analyticsData);

    res.status(200).json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error("❌ Analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate analytics",
      error: error.message,
    });
  }
});

// ===============================
// 404 HANDLER
// ===============================

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

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 ChurnIQ Backend running on http://localhost:${PORT}`
  );
});