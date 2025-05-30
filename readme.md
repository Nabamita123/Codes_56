# 🎥 Streamify — YouTube-Like Video Streaming API

Streamify is a fully-featured backend REST API for a YouTube-style video streaming platform built with **Node.js**, **Express**, and **MongoDB**. It supports user authentication, video uploads, playlists, subscriptions, likes, comments, admin controls, and more.

---

## 🚀 Features

- User registration, login, logout with **bcrypt** password hashing
- JWT-based **access and refresh tokens** with secure cookie and bearer token support
- **Role-based access control** (USER / ADMIN)
- Rate limiting with **IP whitelisting** via CORS policy
- Upload and manage videos, avatars, and cover images using **Multer** and **Cloudinary**
- Full **CRUD operations** on playlists, subscriptions, watch history, likes, and comments
- Admin dashboard to manage users, videos, and platform content
- Middleware for authentication, rate limiting, and file uploads
- Testing using **Jest** and **Supertest** (currently admin routes covered)
- Cookie handling via **cookie-parser**

---

## 📂 Project Structure
- Streamify/
- ├── public/
- │ └── temp/ # Temporary local file storage before Cloudinary upload
- ├── src/
- │ ├── controllers/
- │ │ ├── admin.controller.js
- │ │ ├── comment.controller.js
- │ │ ├── like.controller.js
- │ │ ├── playlist.controller.js
- │ │ ├── subscription.controller.js
- │ │ ├── user.controller.js
- │ │ ├── video.controller.js
- │ │ └── watchHistory.controller.js
- │ ├── db/
- │ │ └── index.js # MongoDB connection setup
- │ ├── middlewares/
- │ │ ├── authentication.middleware.js
- │ │ ├── multer.middleware.js
- │ │ └── ratelimiter.middleware.js
- │ ├── models/
- │ │ ├── comment.model.js
- │ │ ├── like.model.js
- │ │ ├── playlist.model.js
- │ │ ├── subscription.model.js
- │ │ ├── user.model.js
- │ │ ├── video.model.js
- │ │ └── watchHistory.model.js
- │ ├── routes/
- │ │ ├── admin.route.js
- │ │ ├── comment.route.js
- │ │ ├── like.route.js
- │ │ ├── playlist.route.js
- │ │ ├── subscribe.route.js
- │ │ ├── user.route.js
- │ │ ├── video.route.js
- │ │ └── watchHistory.route.js
- │ ├── utils/
- │ │ ├── api-error.js
- │ │ ├── api-response.js
- │ │ ├── async-handler.js
- │ │ └── cloudinary.js
- │ ├── app.js # Express app setup
- │ ├── constants.js # Constant variables and enums
- │ └── index.js # Server entry point
- ├── test/
- │ └── admin.test.mjs # Admin routes test file
- ├── .env # Environment variables
- ├── .gitignore
- ├── js.config.mjs
- ├── package.json
- ├── package-lock.json
- └── README.md


---

## 🔧 Tech Stack & Libraries

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT** for authentication (access & refresh tokens)
- **bcrypt** for password hashing
- **Multer** for handling file uploads
- **Cloudinary** for media storage
- **cookie-parser** for cookie handling
- **CORS** with IP whitelisting
- **Jest + Supertest** for testing
- Custom middleware for auth, rate limiting, error handling

---

## 📦 Setup Instructions

### 1. Clone the repository

``bash
- git clone https://github.com/your-username/streamify.git
- cd streamify

### 2. Install dependencies
- npm install
### 3. Configure environment variables
- Create a **.env** file in the root directory with:

- PORT=3000
- MONGODB_URI=your_mongodb_connection_string
- ACCESS_TOKEN_SECRET=your_jwt_access_token_secret
- ACCESS_TOKEN_EXPIRY = 1d
- REFRESH_TOKEN_SECRET=your_jwt_refresh_token_secret
- REFRESH_TOKEN_EXPIRY=10d
- CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
- CLOUDINARY_CLOUD_KEY=your_cloudinary_api_key
- CLOUDINARY_CLOUD_SECRET=your_cloudinary_api_secret
- CORS_ORIGIN=*

### 4. Run the app
- npm run dev

--- 

## 🧪 Testing
Run tests with:
- npm test
(Currently includes admin authentication and user fetching tests)

---

## 📬 Postman Collection
You can test all the available endpoints using the official Postman collection for this project:

- 👉 [Click here to access the Streamify Postman Collection](https://.postman.co/workspace/My-Workspace~c8f32535-80e1-488a-8be5-0dbcee454a33/collection/29353298-5c844e0a-f27e-4e85-810a-7f33f12971e8?action=share&creator=29353298&active-environment=29353298-3571d17f-3a22-462a-b0a1-6dcd9f18b7d6)

This collection includes endpoints for:

- User authentication

- Video upload, update, and delete

- Playlist creation

- Comments and likes

- Watch history

- Admin controls

---

## 🔒 Security Highlights
- Passwords hashed securely with bcrypt

- JWT tokens handled via cookies and headers

- CORS with IP/domain whitelisting

- Rate limiter middleware prevents abuse

- Multer limits on file uploads

- Cloudinary integration cleans up old media on update

---

## 🙌 Contribution & Future Work
- Add complete test coverage for all routes

- Swagger/OpenAPI docs for easier integration

- Email verification & password reset flows

- Docker containerization

- Frontend client integration

---
