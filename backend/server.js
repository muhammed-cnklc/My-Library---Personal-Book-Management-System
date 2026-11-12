require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const db = require("./database/db");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const adminRoutes = require("./routes/adminRoutes");

const { verifyToken } = require("./middleware/authMiddleware");

const app = express();

// Parse JSON requests
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/admin", adminRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("API Running");
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Backend is running"
    });
});

// Protected test route
app.get(
    "/api/profile", verifyToken, (req, res) => {
        res.json(
            {
                message: "Protected route accessed",
                user: req.user
            }
        );
    }
);

// Load and execute database schema
const schema = fs.readFileSync(
    path.join(
        __dirname,
        "database",
        "schema.sql"
    ),
    "utf8"
);

db.exec(schema, (err) => {
    if (err) {
        console.error("Schema error:", err.message);
    } else {
        console.log("Database tables created");
    }
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`
    );
});