/* Featured Books */

async function loadFeaturedBooks() {

    try {
        const response = await fetch(`${API_URL}/admin/featured`);
        const featuredBooks = await response.json();
        const featuredBooksWithDetails = await Promise.all(
            featuredBooks.map(
                async (featuredBook) => {
                    const bookResponse = await fetch(`${API_URL}/books/${featuredBook.book_id}`);
                    const book = await bookResponse.json();

                    return {
                        ...featuredBook, book
                    };
                }
            )
        );

        displayFeaturedBooks(featuredBooksWithDetails);

    } catch (error) {

        console.error(error);
    }
}

async function loadFeaturedPreview() {

    const container = document.getElementById("featuredPreviewContainer");

    if (!container) {

        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/featured`);
        const featuredBooks = await response.json();
        const featuredBooksWithDetails = await Promise.all(
            featuredBooks.map(
                async (featuredBook) => {
                    const bookResponse = await fetch(`${API_URL}/books/${featuredBook.book_id}`);
                    const book = await bookResponse.json();

                    return {
                        ...featuredBook, book
                    };
                }
            )
        );
        const preview = featuredBooksWithDetails.slice(0, 3);

        displayFeaturedPreview(preview);

    } catch (error) {

        console.error(error);
    }
}

function displayFeaturedPreview(featuredBooks) {

    const container = document.getElementById("featuredPreviewContainer");

    if (!container) {

        return;
    }

    container.innerHTML = "";

    featuredBooks.forEach(featuredBook => {

        const book = featuredBook.book;
        const card = document.createElement("div");

        card.classList.add("card");
        card.innerHTML =
            `
            <h3>${book.title}</h3>
            ${book.cover
                ? `<img src="${book.cover}" alt="${book.title}">`
                : ""
            }
        `;

        container.appendChild(card);
    });
}

function displayFeaturedBooks(featuredBooks) {

    const container = document.getElementById("featuredContainer");

    if (!container) {

        return;
    }

    const isAdmin = localStorage.getItem("role") === "admin";

    if (featuredBooks.length === 0) {

        container.innerHTML = createEmptyCard(
            "No Featured Books Available",
            "Featured books selected by administrators will appear here."
        );

        return;
    }

    container.innerHTML = "";

    featuredBooks.forEach(featuredBook => {

        const book = featuredBook.book;
        const card = document.createElement("div");

        card.classList.add("card");
        card.innerHTML =
            createBookCard(book)
        +
            `
            ${isAdmin ? `
                <button type="button" onclick="deleteFeaturedBook(${featuredBook.id}, this)">
                    Remove
                </button>
            ` : ""}
            `
        ;

        container.appendChild(card);
    });
}

async function addFeaturedBook(event) {

    event.preventDefault();

    const token = localStorage.getItem("token");
    const book_id = document.getElementById("featuredBookId").value;
    const response = await fetch(`${API_URL}/admin/featured`,
        {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ book_id })
        }
    );
    
    await response.json();

    document.getElementById("featuredBookId").value = "";

    loadFeaturedBooks();
}

function updateFeaturedPage() {

    const adminSection = document.getElementById("featuredAdminSection");

    if (!adminSection) {
        
        return;
    }

    const isAdmin = localStorage.getItem("role") === "admin";

    adminSection.style.display = isAdmin ? "block" : "none";
}

async function deleteFeaturedBook(id, button) {

    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/admin/featured/${id}`, 
        {
            method: "DELETE",
            headers: { 
                "Authorization": `Bearer ${token}`
            }
        }
    );
    
    await response.json();

    if (response.ok) {

        button.textContent = "✓ Removed";
        button.disabled = true;
        button.style.backgroundColor = "gray";
        button.style.color = "white";
    }
}