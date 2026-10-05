const express = require("express");
const Customer = require("../models/Customer");

const router = express.Router();

// ==========================================
// TEST ROUTE
// ==========================================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Analytics route is working 🚀",
  });
});

// ==========================================
// ANALYTICS SUMMARY
// ==========================================
router.get("/summary", async (req, res) => {
  try {
    console.log("📊 Analytics summary request received");

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
      (total, customer) => {
        return total + Number(customer.monthlySpend || 0);
      },
      0
    );

    const averageChurnScore =
      totalCustomers > 0
        ? customers.reduce(
            (total, customer) => {
              return total + Number(customer.churnRisk || 0);
            },
            0
          ) / totalCustomers
        : 0;

    const subscriptionBreakdown = {};

    customers.forEach((customer) => {
      const plan = customer.subscription || "Unknown";

      if (!subscriptionBreakdown[plan]) {
        subscriptionBreakdown[plan] = 0;
      }

      subscriptionBreakdown[plan]++;
    });

    const responseData = {
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

    console.log("📊 Analytics data:", responseData);

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error(
      "❌ Analytics error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to generate analytics",
      error: error.message,
    });
  }
});

module.exports = router;
