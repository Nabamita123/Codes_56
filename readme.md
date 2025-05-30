# A backend project
🎥 Streamify — YouTube-Like Video Streaming API
Streamify is a fully-featured backend REST API for a YouTube-style video streaming platform built with Node.js, Express, and MongoDB. It supports user authentication, video uploads, playlists, subscriptions, likes, comments, admin controls, and more.

🚀 Features
User registration, login, logout with bcrypt password hashing

JWT-based access and refresh tokens with secure cookie and bearer token support

Role-based access control (USER / ADMIN)

Rate limiting with IP whitelisting via CORS policy

Upload and manage videos, avatars, and cover images (local temp storage + Cloudinary)

CRUD operations on playlists, subscriptions, watch history, likes, comments

Admin dashboard: manage users, videos, and platform content

Middleware including authentication, rate limiter, and multer for file uploads

Testing with Jest and Supertest (admin routes covered)

Cookie parsing via cookie-parser

📂 Project Structure
pgsql
Copy
Edit
Streamify/
├── public/
│   └── temp/                      # Temporary local file storage before Cloudinary upload
├── src/
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── comment.controller.js
│   │   ├── like.controller.js
│   │   ├── playlist.controller.js
│   │   ├── subscription.controller.js
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   └── watchHistory.controller.js
│   ├── db/
│   │   └── index.js               # MongoDB connection setup
│   ├── middlewares/
│   │   ├── authentication.middleware.js
│   │   ├── multer.middleware.js
│   │   └── ratelimiter.middleware.js
│   ├── models/
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── playlist.model.js
│   │   ├── subscription.model.js
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   └── watchHistory.model.js
│   ├── routes/
│   │   ├── admin.route.js
│   │   ├── comment.route.js
│   │   ├── like.route.js
│   │   ├── playlist.route.js
│   │   ├── subscribe.route.js
│   │   ├── user.route.js
│   │   ├── video.route.js
│   │   └── watchHistory.route.js
│   ├── utils/
│   │   ├── api-error.js
│   │   ├── api-response.js
│   │   ├── async-handler.js
│   │   └── cloudinary.js
│   ├── app.js                     # Express app setup
│   ├── constants.js               # Constant variables and enums
│   └── index.js                   # Server entry point
├── test/
│   └── admin.test.mjs             # Admin routes test file
├── .env                          # Environment variables
├── .gitignore
├── js.config.mjs                 # JS config
├── package.json
├── package-lock.json
└── README.md
🔧 Tech Stack & Libraries
Node.js + Express

MongoDB + Mongoose

JWT for authentication (access & refresh tokens)

bcrypt for secure password hashing

multer for handling file uploads

Cloudinary for media storage

cookie-parser for cookie management

cors with IP whitelisting for security

Jest + Supertest for testing

Custom middlewares for authentication, rate limiting, error handling

📦 Setup Instructions
1. Clone the repository
bash
Copy
Edit
git clone https://github.com/your-username/streamify.git
cd streamify
2. Install dependencies
bash
Copy
Edit
npm install
3. Configure environment variables
Create a .env file in the root directory with:

env
Copy
Edit
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_access_token_secret
JWT_REFRESH_SECRET=your_jwt_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_WHITELIST=your_whitelisted_ips_or_domains
4. Run the app
bash
Copy
Edit
npm run dev
🧪 Testing
Run tests with:

bash
Copy
Edit
npm test
Currently includes admin authentication and user fetching tests

Add more tests for routes as needed

📬 Postman Collection
You can test all the available endpoints using the official Postman collection for this project:

👉 Click here to access the Streamify Postman Collection

This collection includes endpoints for:

User authentication

Video upload, update, and delete

Playlist creation

Comments and likes

Watch history

Admin controls
🔒 Security Highlights
Passwords hashed securely with bcrypt

JWT tokens handled via cookies and headers

CORS with IP/domain whitelisting

Rate limiter middleware prevents abuse

Multer limits on file uploads

Cloudinary integration cleans up old media on update

🙌 Contribution & Future Work
Add complete test coverage for all routes

Swagger/OpenAPI docs for easier integration

Email verification & password reset flows

Docker containerization

Frontend client integration

