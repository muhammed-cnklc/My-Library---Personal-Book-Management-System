const express = require("express");

const router = express.Router();

const libraryController =
    require("../controllers/libraryController");

const {
    verifyToken
} = require("../middleware/authMiddleware");

/*
 * Add book to library
 */
router.post(
    "/",
    verifyToken,
    libraryController.addBook
);

/*
 * Get user's library
 */
router.get(
    "/",
    verifyToken,
    libraryController.getLibrary
);

/*
 * Update reading status
 */
router.put(
    "/:id",
    verifyToken,
    libraryController.updateStatus
);

/*
 * Remove book from library
 */
router.delete(
    "/:id",
    verifyToken,
    libraryController.deleteBook
);

module.exports = router;