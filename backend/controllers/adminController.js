const db = require("../database/db");

/*
 * Get all featured books
 */
exports.getFeaturedBooks = (req, res) => {

    const sql = `
        SELECT *
        FROM featured_books
        ORDER BY featured_at DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.json(rows);

    });

};

/*
 * Add featured book
 */
exports.addFeaturedBook = (req, res) => {

    const { book_id } = req.body;

    const featuredBy = req.user.id;

    if (!book_id) {
        return res.status(400).json({
            message: "Book ID required"
        });
    }

    const checkSql = `
        SELECT *
        FROM featured_books
        WHERE book_id = ?
    `;

    db.get(
        checkSql,
        [book_id],
        (err, existingBook) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (existingBook) {
                return res.status(400).json({
                    message:
                        "Book already featured"
                });
            }

            const sql = `
                INSERT INTO featured_books
                (
                    book_id,
                    featured_by
                )
                VALUES (?, ?)
            `;

            db.run(
                sql,
                [book_id, featuredBy],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    res.status(201).json({
                        message:
                            "Featured book added",
                        featuredId:
                            this.lastID
                    });

                }
            );

        }
    );

};

/*
 * Remove featured book
 */
exports.deleteFeaturedBook = (req, res) => {

    const featuredId = req.params.id;

    const sql = `
        DELETE FROM featured_books
        WHERE id = ?
    `;

    db.run(
        sql,
        [featuredId],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message:
                        "Featured book not found"
                });
            }

            res.json({
                message:
                    "Featured book deleted"
            });

        }
    );

};

/*
 * Get all users
 */
exports.getUsers = (req, res) => {

    const sql = `
        SELECT
            id,
            username,
            email,
            role,
            created_at
        FROM users
        ORDER BY role DESC, username ASC
    `;

    db.all(
        sql,
        [],
        (err, users) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(users);

        }
    );

};

/*
 * Delete user
 */
exports.deleteUser = (req, res) => {

    const userId = req.params.id;

    const checkSql = `
        SELECT *
        FROM users
        WHERE id = ?
    `;

    db.get(
        checkSql,
        [userId],
        (err, user) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            if (user.role === "admin") {
                return res.status(403).json({
                    message:
                        "Admins cannot be deleted"
                });
            }

            db.run(
                `
                DELETE FROM favorite_books
                WHERE user_id = ?
                `,
                [userId],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    db.run(
                        `
                        DELETE FROM library_books
                        WHERE user_id = ?
                        `,
                        [userId],
                        (err) => {

                            if (err) {
                                return res.status(500).json({
                                    message: err.message
                                });
                            }

                            db.run(
                                `
                                DELETE FROM users
                                WHERE id = ?
                                `,
                                [userId],
                                function (err) {

                                    if (err) {
                                        return res.status(500).json({
                                            message:
                                                err.message
                                        });
                                    }

                                    res.json({
                                        message:
                                            "User deleted"
                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};

/*
 * Dashboard statistics
 */
exports.getStatistics = (req, res) => {

    db.get(
        `
        SELECT COUNT(*) AS totalUsers
        FROM users
        `,
        [],
        (err, usersResult) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            db.get(
                `
                SELECT COUNT(*) AS totalFavorites
                FROM favorite_books
                `,
                [],
                (err, favoritesResult) => {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    db.get(
                        `
                        SELECT COUNT(*) AS totalLibraryBooks
                        FROM library_books
                        `,
                        [],
                        (err, libraryResult) => {

                            if (err) {
                                return res.status(500).json({
                                    message: err.message
                                });
                            }

                            db.get(
                                `
                                SELECT COUNT(*) AS totalFeaturedBooks
                                FROM featured_books
                                `,
                                [],
                                (err, featuredResult) => {

                                    if (err) {
                                        return res.status(500).json({
                                            message: err.message
                                        });
                                    }

                                    res.json({

                                        totalUsers:
                                            usersResult.totalUsers,

                                        totalFavorites:
                                            favoritesResult.totalFavorites,

                                        totalLibraryBooks:
                                            libraryResult.totalLibraryBooks,

                                        totalFeaturedBooks:
                                            featuredResult.totalFeaturedBooks

                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};