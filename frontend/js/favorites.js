/* Favorite Books */

async function addFavorite(bookId, button) {

    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/favorites`, 
        {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`
            }, 
            body: JSON.stringify({ book_id: bookId })
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

async function loadFavorites() {

    const token = localStorage.getItem("token");

    if (!token) {

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
        const favoritesWithDetails = await Promise.all(
            favorites.map(
                async (favorite) => {
                    const bookResponse = await fetch(`${API_URL}/books/${favorite.book_id}`);
                    const book = await bookResponse.json();

                    return {
                        ...favorite, book
                    };
                }
            )
        );

        displayFavorites(favoritesWithDetails);

    } catch (error) {

        console.error(error);

    }
}

function displayFavorites(favorites) {

    const container = document.getElementById("favoritesContainer");

    if (!container) {
        
        return;
    }

    if (favorites.length === 0) {

        container.innerHTML = createEmptyCard(
            "No Favorite Books Yet",
            "Books added to favorites will appear here."
        );

        return;
    }

    container.innerHTML = "";

    favorites.forEach(favorite => {

        const book = favorite.book;
        const card = document.createElement("div");

        card.classList.add("card");
        card.innerHTML = 
            createBookCard(book)  
        + 
            `<button type="button" onclick="deleteFavorite(${favorite.id}, this)">
                Remove
            </button>`
        ;

        container.appendChild(card);
    });
}

async function deleteFavorite(id, button) {

    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/favorites/${id}`, 
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