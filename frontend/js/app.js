/* Event Listeners */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        updateNavbar();
        updateUserInfo();
        updateFeaturedPage();

        loadUsers();
        loadStatistics();

        loadFeaturedPreview();
    }
);

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", registerUser);
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
}

const searchForm = document.getElementById("searchForm");

if (searchForm) {
    searchForm.addEventListener("submit", searchBooks);
}

const featuredForm = document.getElementById("featuredForm");

if (featuredForm) {
    featuredForm.addEventListener("submit", addFeaturedBook);
}

/* Page Initialization */

if (document.getElementById("favoritesContainer")) {
    loadFavorites();
}

if (document.getElementById("libraryContainer")) {
    loadLibrary();
}

if (document.getElementById("featuredContainer")) {
    loadFeaturedBooks();
}
