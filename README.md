# Bookmark Manager App

A full-stack bookmark management application built using Next.js and Supabase.

## Features

- Google Authentication (OAuth)
- Add bookmarks
- Edit bookmarks
- Delete bookmarks
- Search bookmarks
- Pagination
- Real-time updates
- Open links in new tab
- Private user data (RLS)
- Loading spinner
- Responsive design

---

## Tech Stack

- Frontend: Next.js (React)
- Backend: Supabase (Auth + Database)
- Styling: Tailwind CSS

---

## Authentication

Google OAuth login using Supabase Auth.

---

## Database Schema

### bookmarks table

| Column | Type |
|--------|------|
| id | uuid |
| title | text |
| url | text |
| user_id | uuid |
| created_at | timestamp |

---

## Security

- Row Level Security (RLS)
- Each user can access only their bookmarks

---

## Challenges Faced

- OAuth redirect issues
- Hydration mismatch
- URL validation
- Pagination logic

---

## Solutions

- Used Supabase OAuth flow
- Fixed client-side rendering
- Added URL formatter
- Implemented pagination with range  

---

## Author

- Vignesh Senthilkumar (Full-Stack developer)
