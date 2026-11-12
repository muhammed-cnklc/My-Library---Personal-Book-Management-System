const db = require("../database/db");

/*
 * Add book to favorites
 */
exports.addFavorite = (req, res) => {

    const { book_id } = req.body;

    const userId = req.user.id;

    if (!book_id) {

        return res.status(400).json({
            message: "Book ID required"
        });

    }

    const checkSql = `
        SELECT *
        FROM favorite_books
        WHERE user_id = ?
        AND book_id = ?
    `;

    db.get(
        checkSql,
        [userId, book_id],
        (err, existingFavorite) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });

            }

            if (existingFavorite) {

                return res.status(400).json({
                    message:
                        "Book already in favorites"
                });

            }

            const sql = `
                INSERT INTO favorite_books
                (
                    user_id,
                    book_id
                )
                VALUES (?, ?)
            `;

            db.run(
                sql,
                [userId, book_id],
                function (err) {

                    if (err) {

                        return res.status(500).json({
                            message: err.message
                        });

                    }

                    res.status(201).json({
                        message:
                            "Favorite added",
                        favoriteId:
                            this.lastID
                    });

                }
            );

        }
    );

};

/*
 * Get all favorite books
 */
exports.getFavorites = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT *
        FROM favorite_books
        WHERE user_id = ?
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
 * Remove favorite book
 */
exports.deleteFavorite = (req, res) => {

    const favoriteId =
        req.params.id;

    const userId =
        req.user.id;

    const sql = `
        DELETE FROM favorite_books
        WHERE id = ?
        AND user_id = ?
    `;

    db.run(
        sql,
        [favoriteId, userId],
        function (err) {

            if (err) {

                return res.status(500).json({
                    message:
                        err.message
                });

            }

            if (
                this.changes === 0
            ) {

                return res.status(404).json({
                    message:
                        "Favorite not found"
                });

            }

            res.json({
                message:
                    "Favorite removed"
            });

        }
    );

};