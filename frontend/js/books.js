async function loadFavoriteIds() {

    const token = localStorage.getItem("token");

    if (!token) {
        favoriteBooksIds = [];
        
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/favorites`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        const favorites = await response.json();

        favoriteBooksIds = favorites.map(favorite => favorite.book_id);

    } catch (error) {

        console.error(error);
    }
}

async function loadLibraryIds() {

    const token = localStorage.getItem("token");

    if (!token) {
        libraryBookIds = [];
        
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/library`, 
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        const libraryBooks = await response.json();

        libraryBookIds = libraryBooks.map(
            libraryBook => libraryBook.book_id
        );

    } catch (error) {

        console.error(error);
    }
}

/* Books */

async function searchBooks(event) {

    event.preventDefault();

    const searchTerm = document.getElementById("searchInput").value;

    if (!searchTerm.trim()) {

        return;
    }

    try {
        const response = await fetch(`${API_URL}/books/search?q=${encodeURIComponent(searchTerm)}`);
        const books = await response.json();

        await loadFavoriteIds();
        await loadLibraryIds();

        displayBooks(books);

    } catch (error) {

        console.error(error);
    }
}

function createBookCard(book) {

    const editionCount =
        book.editionCount ?? "N/A";

    const hasCover =
        book.hasCover ??
        !!book.cover;

    return `

    <h3>${book.title}</h3>

    ${
        book.cover
            ? `
                <img
                    src="${book.cover}"
                    alt="${book.title}"
                >
            `
            : ""
    }

    <ul class="book-details">
        <li>
            <strong>ID:</strong>
            ${book.id}
        </li>

        <li>
            <strong>Author:</strong>
            ${book.author ?? "N/A"}
        </li>

        <li>
            <strong>ISBN:</strong>
            ${book.isbn ?? "N/A"}
        </li>

        <li>
            <strong>Cover ID:</strong>
            ${
                book.coverId ??
                book.covers?.[0] ??
                "N/A"
            }
        </li>

        <li>
            <strong>First Publish Year:</strong>
            ${book.firstPublishYear ?? "N/A"}
        </li>

        <li>
            <strong>Edition Count:</strong>
            ${editionCount}
        </li>

        <li>
            <strong>Has Cover:</strong>
            ${hasCover ? "Yes" : "No"}
        </li>
    </ul>

    `;
}

function createEmptyCard(title, message) {

    return `
    
    <div class="card">
    <h3>${title}</h3>
    <h5>${message}</h5>
    </div>
    `;
}

function displayBooks(books) {

    const isLoggedIn = !!localStorage.getItem("token");
    const results = document.getElementById("results");

    results.innerHTML = "";

    if (books.length === 0) {

        results.innerHTML = createEmptyCard(
            "No books Found",
            "Try searching for a different book."
        );

        return;
    }

    books.forEach(book => 
        {
            const card = document.createElement("div");
            card.classList.add("card");
            const isFavorite = favoriteBooksIds.includes(book.id);
            const isLibraryBook = libraryBookIds.includes(book.id);

            card.innerHTML =
                createBookCard(book)
            +
                `
                ${isLoggedIn ? `
                    
                    ${isFavorite ? `
                        <button type="button" disabled style="background-color: green; color: white;">
                            ✓ Already in Favorites
                        </button>
                    ` : `
                        <button type="button" onclick="addFavorite('${book.id}', this)">
                            Add to Favorites
                        </button>
                    `}
                    
                    ${isLibraryBook ? `
                        <button type="button" disabled style="background-color: green; color: white;">
                            ✓ Already in Library
                        </button>
                    ` : `
                        <button type="button" onclick="addBookToLibrary('${book.id}', this)">
                            Add to Library
                        </button>
                    `}
        
                ` : ""}
            `;
            
            results.appendChild(card);
        }
    );
}