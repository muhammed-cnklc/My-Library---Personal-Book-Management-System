const axios = require("axios");

const BASE_URL = "https://openlibrary.org";

// Generate cover image URL
function getCoverUrl(coverId) {

    if (!coverId) {

        return null;
    }

    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}

// Search books by title, author or keyword
exports.searchBooks = async (query) => {

    const response = await axios.get(
        `${BASE_URL}/search.json`,
        {
            params: {
                q: query
            }
        }
    );

    return response.data.docs.map(
        (book) => ({
            
            id: book.key ?.replace("/works/", "") || null,
            title: book.title || "Unknown Title",
            author: book.author_name?.[0] || "Unknown Author",
            isbn: book.isbn?.[0] || null,
            coverId: book.cover_i || null,
            cover: getCoverUrl(book.cover_i),
            firstPublishYear: book.first_publish_year || null,
            editionCount: book.edition_count || 0,
            hasCover: !!book.cover_i,
            publishDate: book.publish_date?.[0] || null
        })
    );
};

// Get detailed book information
exports.getBookDetails = async (workId) => {

    const response = await axios.get(
        `${BASE_URL}/works/${workId}.json`
    );

    const book = response.data;

    let author = null;

    if (
        book.authors &&
        book.authors.length > 0
    ) {

        const authorKey =
            book.authors[0].author.key;

        const authorResponse =
            await axios.get(
                `${BASE_URL}${authorKey}.json`
            );

        author =
            authorResponse.data.name;
    }

    return {

        id: workId,

        title:
            book.title,

        author,

        isbn: null,

        coverId:
            book.covers?.[0] || null,

        firstPublishYear:
            book.first_publish_date || null,

        editionCount:
            null,

        hasCover:
            !!book.covers?.length,

        publishDate:
            book.first_publish_date || null,

        description:
            typeof book.description ===
            "string"
                ? book.description
                : book.description?.value ||
                  null,

        subjects:
            book.subjects || [],

        covers:
            book.covers || [],

        cover:
            book.covers?.length
                ? getCoverUrl(
                    book.covers[0]
                )
                : null

    };

};

//  Get author information
exports.getAuthorDetails = async (authorId) => {

    const response = await axios.get(
        `${BASE_URL}/authors/${authorId}.json`
    );
    const author = response.data;

    return { 
        id: authorId,
        name: author.name,
        birthDate: author.birth_date || null,
        bio: typeof author.bio === "string" 
            ? author.bio
            : author.bio?.value || null
    };
};

exports.getCoverUrl = getCoverUrl;