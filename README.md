# 🎬 VeeraTube

A production-ready YouTube-like video platform built with React + Vite, Node.js/Express, MariaDB, and AWS S3.

---

## 📁 Project Structure

```
veeratube/
├── backend/
│   ├── config/
│   │   ├── db.js          # MariaDB connection + auto-init tables
│   │   ├── s3.js          # AWS S3 client
│   │   └── mailer.js      # Nodemailer SMTP
│   ├── middleware/
│   │   └── auth.js        # JWT middleware
│   ├── routes/
│   │   ├── auth.js        # /auth/register, /auth/login, /auth/verify-email
│   │   ├── videos.js      # /videos/upload, /videos, /videos/:id
│   │   └── users.js       # /users/:id/videos
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/    # Navbar, VideoCard, ProtectedRoute
    │   ├── context/       # AuthContext
    │   ├── pages/         # Home, Login, Register, Upload, Watch, Profile
    │   └── utils/         # Axios API client
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── .env.example
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MariaDB or MySQL running locally
- AWS account with S3 bucket
- Gmail account with App Password enabled

---

## 1️⃣ MariaDB Setup

Connect to your MariaDB server and run:

```sql
CREATE DATABASE veeratube;
CREATE USER 'veerauser'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON veeratube.* TO 'veerauser'@'localhost';
FLUSH PRIVILEGES;
```

> Tables (`users` and `videos`) are automatically created on first backend startup.

---

## 2️⃣ AWS S3 Configuration

1. Log in to [AWS Console](https://console.aws.amazon.com/)
2. Go to **S3** → **Create Bucket**
   - Set a unique bucket name (e.g. `veeratube-videos`)
   - Choose your region
   - **Uncheck** "Block all public access" (required for public video URLs)
3. In bucket **Permissions** → **Bucket Policy**, add:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

4. Go to **IAM** → **Users** → **Create User**
   - Attach policy: `AmazonS3FullAccess`
   - Create **Access Key** and copy the Key ID + Secret

---

## 3️⃣ SMTP (Gmail) Configuration

1. Enable **2-Step Verification** on your Google account
2. Go to Google Account → Security → **App passwords**
3. Generate an app password for "Mail"
4. Use your Gmail address and the app password in `.env`

---

## 4️⃣ Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=veerauser
DB_PASS=yourpassword
DB_NAME=veeratube
JWT_SECRET=change_this_to_a_long_random_string
SMTP_EMAIL=your@gmail.com
SMTP_PASS=your_gmail_app_password
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=veeratube-videos
FRONTEND_URL=http://localhost:5173
```

Then:
```bash
npm install
npm run dev      # development (nodemon)
# or
npm start        # production
```

Backend runs at: `http://localhost:5000`

---

## 5️⃣ Frontend Setup

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000
```

Then:
```bash
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| GET | `/auth/verify-email?token=...` | No | Verify email |
| POST | `/auth/login` | No | Login, returns JWT |
| POST | `/videos/upload` | Yes | Upload video + thumbnail |
| GET | `/videos` | No | Get all videos |
| GET | `/videos/:id` | No | Get single video |
| GET | `/users/:id/videos` | No | Get user profile + videos |

---

## ✅ Features

- 🔐 JWT Authentication with email verification
- 📧 SMTP verification email (Nodemailer + Gmail)
- 🎥 Video upload to AWS S3 (MP4 only, 50MB max)
- 🖼️ Thumbnail upload to AWS S3
- 📺 HTML5 video player streaming from S3
- 🏠 Video feed with thumbnails and metadata
- 👤 User profile pages
- 🛡️ Protected routes (upload requires login)
- 🎨 Dark theme with custom Tailwind design

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MariaDB (MySQL compatible) |
| Storage | AWS S3 |
| Auth | JWT + bcrypt |
| Email | Nodemailer |
| Upload | Multer + multer-s3 |
| AWS SDK | AWS SDK v3 |
