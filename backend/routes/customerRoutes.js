const express = require("express");
const Customer = require("../models/Customer");

const router = express.Router();

// =====================================================
// GET ALL CUSTOMERS
// =====================================================

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error(
      "❌ Fetch customers error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
});

// =====================================================
// GET SINGLE CUSTOMER
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(
      req.params.id
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error(
      "❌ Fetch customer error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error: error.message,
    });
  }
});

// =====================================================
// CREATE NEW CUSTOMER
// =====================================================

router.post("/", async (req, res) => {
  try {
    console.log(
      "📥 New customer received:",
      req.body
    );

    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    console.error(
      "❌ Customer creation error:",
      error.message
    );

    res.status(400).json({
      success: false,
      message: "Failed to create customer",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE CUSTOMER
// =====================================================

router.put("/:id", async (req, res) => {
  try {
    console.log(
      "✏️ Updating customer:",
      req.params.id
    );

    console.log(
      "📤 Update data:",
      req.body
    );

    const customer =
      await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    console.log(
      "✅ Customer updated:",
      customer.customerId
    );

    res.json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    console.error(
      "❌ Customer update error:",
      error.message
    );

    res.status(400).json({
      success: false,
      message: "Failed to update customer",
      error: error.message,
    });
  }
});

// =====================================================
// DELETE CUSTOMER
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    console.log(
      "🗑️ Deleting customer:",
      req.params.id
    );

    const customer =
      await Customer.findByIdAndDelete(
        req.params.id
      );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    console.log(
      "✅ Customer deleted:",
      customer.customerId
    );

    res.json({
      success: true,
      message: "Customer deleted successfully",
      data: customer,
    });
  } catch (error) {
    console.error(
      "❌ Customer delete error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
      error: error.message,
    });
  }
});

module.exports = router;
