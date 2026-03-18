# URL Shortener

## The System
This is a simple URL shortener project (similar to TinyURL), built as a home assignment for AppReel. The system accepts a valid long URL, generates a unique short ID for it (e.g. `http://localhost:3000/aB3dE5`), and redirects the user back to the original URL when they access the short link.

## Technology Stack
I chose a modern, clean, and easy-to-run stack:
- **Next.js (App Router) + TypeScript:** Serves as both the Frontend and Backend in the same project. This eliminates the need to run two different servers and configure communication between them. Everything sits in one clean place.
- **PostgreSQL (Database):** A powerful relational database hosted in the cloud. It is fully scalable, can support an immense amount of records, and performs incredibly fast lookups due to exact indexing on the URL short-IDs.
- **Prisma ORM:** A tool that allows communication with the database using simple and readable TypeScript code instead of writing raw SQL queries. This makes the code much shorter.
- **Vanilla CSS:** The project is entirely styled using pure CSS (`globals.css`) for a modern look, without relying on external design libraries as requested in the assignment.

## How to run the project locally?
The project is configured to work out of the box. All you need to do is execute the following steps in the terminal (inside the `app-reel` folder):

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up the Environment Variables:**
   Create a `.env` file in the root directory (`app-reel`) and provide a connection string to a PostgreSQL database:
   ```env
   DATABASE_URL="postgresql://user:password@cloud-url/dbname"
   ```

3. **Initialize the Database:**
   *(This pushes the schema to your PostgreSQL database and generates the Prisma Client)*
   ```bash
   npx prisma db push
   npx prisma generate
   ```

   ```bash
   npm run dev
   ```

The website will now be available at: `http://localhost:3000`

## Brief Code Explanation
- **User Interface (Frontend):** Located in `app/page.tsx`.
- **API for creating short links:** Located in `app/api/shorten/route.ts` - Validates the URL and generates a random short ID that doesn't yet exist in the system.
- **Redirection:** Located in `app/[shortId]/route.ts` - When a user visits a short URL, the server matches the ID, searches the database, and automatically redirects them to the original URL.
