# My Library - Personal Book Management System

## Description

My Library - Personal Book Management-System is a web application for discovering books and managing personal reading collections.

Users can:

- Search books using the Open Library API
- Add books to favorites
- Manage a personal library
- Track reading status
- View featured books
- Register and log in with a personal account

Administrators can:

- View registered users
- Delete user accounts
- Manage featured books
- View application statistics

---

## Technology Stack

Frontend:

- HTML5
- CSS3
- JavaScript

Backend:

- Node.js
- Express.js
- SQLite

Authentication:

- JWT (JSON Web Token)
- bcryptjs

External API:

- Open Library API

---

## Software Requirements

Required software:

- Node.js 22.x or newer
- npm 10.x or newer

---

## Installation

Clone the repository:

```bash
git clone https://github.com/muhammed-cnklc/My-Library---Personal-Book-Management-System.git

cd My-Library---Personal-Book-Management-System
```

Navigate to the backend directory:

```bash
cd My-Library---Personal-Book-Management-System/backend
```

Install backend dependencies:

```bash
npm install
```

If the frontend has its own package.json:

```bash
cd ../frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=3000
JWT_SECRET=mySecretKey
```

---

## Start Backend

Navigate to backend:

```bash
cd backend
```

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Backend URL:

```text
http://localhost:3000
```

---

## Start Frontend

Open the frontend files using a local web server.

Example using VS Code Live Server:

Right click:

```text
index.html
```

and choose:

```text
Open with Live Server
```

Example URL:

```text
http://127.0.0.1:5500
```

---

## Open Library API

The application uses the following Open Library endpoints:

```text
/search.json?q={query}
/works/{work_id}.json
/authors/{author_id}.json
https://covers.openlibrary.org/b/id/{cover_id}-M.jpg
```

No API key is required.

Documentation:

https://openlibrary.org/developers/api

---

## User Roles

### Guest

- Search books
- View featured books

### User

- Add favorites
- Manage personal library
- Update reading status

### Admin

- View users
- Delete users
- Manage featured books
- View statistics

---

## Author

Muhammed Cankilic
Student ID: c2410475192
