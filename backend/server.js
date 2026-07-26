require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Try to connect to MongoDB (won't crash if it fails)
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "..")));

// API Routes
try {
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/products", require("./routes/productRoutes"));
    app.use("/api/cart", require("./routes/cartRoutes"));
    app.use("/api/orders", require("./routes/orderRoutes"));
    app.use("/api/users", require("./routes/userRoutes"));
} catch (err) {
    console.log("API routes not available (no database):", err.message);
}

// Health check
app.get("/", (req, res) => {
    res.send("Backend is running 🚀. Frontend available at /");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`  🚀 Server running on port ${PORT}`);
    console.log(`  🌐 Frontend: http://localhost:${PORT}`);
    console.log(`  🔌 API:      http://localhost:${PORT}/api`);
    console.log(`========================================\n`);
});
