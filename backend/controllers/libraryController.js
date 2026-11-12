const db = require("../database/db");

const allowedStatuses = [
    "Want to Read",
    "Currently Reading",
    "Finished",
    "Dropped"
];

/*
 * Add a book to the user's library
 */
exports.addBook = (req, res) => {

    const { book_id, status } = req.body;

    const userId = req.user.id;

    if (!book_id) {
        return res.status(400).json({
            message: "Book ID required"
        });
    }

    if (
        !status ||
        !allowedStatuses.includes(status)
    ) {
        return res.status(400).json({
            message: "Invalid status"
        });
    }

    const checkSql = `
        SELECT *
        FROM library_books
        WHERE user_id = ?
        AND book_id = ?
    `;

    db.get(
        checkSql,
        [userId, book_id],
        (err, existingBook) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (existingBook) {
                return res.status(400).json({
                    message:
                        "Book already exists in library"
                });
            }

            const sql = `
                INSERT INTO library_books
                (
                    user_id,
                    book_id,
                    status
                )
                VALUES (?, ?, ?)
            `;

            db.run(
                sql,
                [userId, book_id, status],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    res.status(201).json({
                        message:
                            "Book added to library",
                        libraryId:
                            this.lastID
                    });

                }
            );

        }
    );

};

/*
 * Get all books from the user's library
 */
exports.getLibrary = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT *
        FROM library_books
        WHERE user_id = ?
        ORDER BY added_at DESC
    `;

    db.all(
        sql,
        [userId],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);

        }
    );

};

/*
 * Update reading status
 */
exports.updateStatus = (req, res) => {

    const libraryId = req.params.id;

    const { status } = req.body;

    const userId = req.user.id;

    if (
        !status ||
        !allowedStatuses.includes(status)
    ) {
        return res.status(400).json({
            message: "Invalid status"
        });
    }

    const sql = `
        UPDATE library_books
        SET status = ?
        WHERE id = ?
        AND user_id = ?
    `;

    db.run(
        sql,
        [status, libraryId, userId],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message:
                        "Library entry not found"
                });
            }

            res.json({
                message:
                    "Status updated successfully"
            });

        }
    );

};

/*
 * Remove a book from the library
 */
exports.deleteBook = (req, res) => {

    const libraryId = req.params.id;

    const userId = req.user.id;

    const sql = `
        DELETE FROM library_books
        WHERE id = ?
        AND user_id = ?
    `;

    db.run(
        sql,
        [libraryId, userId],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message:
                        "Library entry not found"
                });
            }

            res.json({
                message:
                    "Book removed from library"
            });

        }
    );

};