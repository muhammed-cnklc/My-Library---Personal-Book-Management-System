/* Library */

async function addBookToLibrary(bookId, button) {

    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/library`,
        {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ book_id: bookId, status: "Want to Read" })
        }
    );
    const data = await response.json();
    if (response.ok) {

        button.textContent = "✓ Added";
        button.disabled = true;
        button.style.backgroundColor = "green";
        button.style.color = "white";
    }
}

async function loadLibrary() {

    const token = localStorage.getItem("token");

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
        const libraryWithDetails = await Promise.all(
            libraryBooks.map(
                async (libraryBook) => {
                    const bookResponse = await fetch(
                        `${API_URL}/books/${libraryBook.book_id}`
                    );
                    const book = await bookResponse.json();
                    
                    return {
                        ...libraryBook, 
                        book
                    };
                }
            )
        );

        displayLibrary(libraryWithDetails);

    } catch (error) {

        console.error(error);
    }
}

function displayLibrary(libraryBooks) {

    const container = document.getElementById("libraryContainer");

    if (!container) {

        return;
    }

    if (libraryBooks.length === 0) {

        container.innerHTML = createEmptyCard(
            "No Books in Library Yet",
            "Books added to your library will appear here."
        );

        return;
    }

    container.innerHTML = "";

    libraryBooks.forEach(
        libraryBook => {
            const book = libraryBook.book;
            const card = document.createElement("div");
            
            let statusClass = "";

switch (libraryBook.status) {

    case "Want to Read":
        statusClass = "status-want";
        break;

    case "Currently Reading":
        statusClass = "status-reading";
        break;

    case "Finished":
        statusClass = "status-finished";
        break;

    case "Dropped":
        statusClass = "status-dropped";
        break;
}

            card.classList.add("card");
            card.innerHTML =
            `
            <div class="library-status ${statusClass}">
                ${libraryBook.status}
            </div>
            `
            +   
                createBookCard(book)
            +
                `
                <select onchange="updateLibraryStatus(${libraryBook.id}, this.value)">
                    <option value="Want to Read" ${libraryBook.status === "Want to Read" ? "selected" : ""}>
                        Want to Read
                    </option>
                    <option value="Currently Reading" ${libraryBook.status === "Currently Reading" ? "selected" : ""}>   
                        Currently Reading
                    </option>
                    <option value="Dropped" ${libraryBook.status === "Dropped" ? "selected" : ""}>
                        Dropped
                    </option>
                    <option value="Finished" ${libraryBook.status === "Finished" ? "selected" : ""}>
                        Finished
                    </option>
                </select>
                <button type="button" onclick="deleteLibraryBook(${libraryBook.id}, this)">
                    Remove
                </button>
            `;
            
            container.appendChild(card);
        }
    );
}

async function updateLibraryStatus(id, status) {

    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/library/${id}`,
        {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ status })
        }
    );
    const data = await response.json();

    console.log(data.message);
}

async function deleteLibraryBook(id, button) {

    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/library/${id}`,
        {
            method: "DELETE",
            headers: { 
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (response.ok) {

        button.textContent = "✓ Removed";
        button.disabled = true;
        button.style.backgroundColor = "gray";
        button.style.color = "white";
    }
}