const express = require("express");

const router = express.Router();

const bookController = require("../controllers/bookController");

// Search books
router.get("/search", bookController.searchBooks);

// Book details
router.get("/:id", bookController.getBookDetails);

// Author details
router.get("/author/:id", bookController.getAuthorDetails);

module.exports = router;