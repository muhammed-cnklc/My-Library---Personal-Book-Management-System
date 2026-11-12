const openLibraryService = require("../services/openLibraryService");

// Search books
exports.searchBooks = async (req,res) => {

    try {

        const query = req.query.q;

        if (!query) {

            return res.status(400).json(
                {
                    message: "Search query required"
                }
            );
        }

        const books = await openLibraryService.searchBooks(query);

        res.json(books);

    } catch (error) {

        res.status(500).json(
            {
                message: error.message
            }
        );
    }
};

// Get book details
exports.getBookDetails = async (req, res) => {
    
    try {
        const workId = req.params.id;
        const book = await openLibraryService.getBookDetails(workId);

        if (!book) {

            return res.status(404).json(
                {
                    message: "Book not found"
                }
            );
        }

        res.json(book);

    } catch (error) {

        res.status(500).json(
            {
                message: error.message
            }
        );
    }
};

// Get author details
exports.getAuthorDetails = async (req, res) => {
    
    try {
        const authorId = req.params.id;
        const author = await openLibraryService.getAuthorDetails(authorId);
        
        res.json(author);
    
    } catch (error) {
        
        res.status(500).json(
            {
                message: error.message
            }
        );
    }
};