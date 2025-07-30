# 🛒 MERN Stack E-commerce Listing Cart App

This is a full-featured E-commerce web application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It includes features like product listing, cart management, Stripe payment integration, user authentication, admin dashboard, and more.

---

## 🚀 Features

### 🧑 User Features
- View all products with pagination, search, and filtering
- View individual product details
- Add products to cart
- Checkout with shipping details and Stripe payment
- View all past orders and order statuses
- Submit product reviews
- Update profile and upload profile image
- Change password
- Password reset via email (Mailtrap used)
- Toast notifications for feedback

### 🛠️ Admin Features
- Dashboard with summaries (orders, users, revenue, etc.)
- Manage all products (create, update, delete)
- Manage all orders (update statuses, delete)
- Manage all users (edit, delete)
- Delete user reviews

---

## 🔒 Authentication & Authorization

- JWT-based authentication
- Protected routes for users and admin
- Role-based access control
- Tokens stored in HTTP-only cookies for security

---

## 📧 Email Integration

- Password reset emails sent using **Mailtrap** in development
- Secure password reset tokens with expiration

---

## 🔍 Search & Filtering

- Product search by keyword
- Filtering by category, price, review stars.
- Pagination support for all pages

---

## 🧰 Tech Stack

| Technology | Description |
|------------|-------------|
| **Frontend** | React.js, Redux Toolkit, Axios, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, Cookies |
| **Payments** | Stripe API |
| **Email Service** | Mailtrap (for dev) |
| **UI/UX** | React Bootstrap, Toast Notifications |
| **State Management** | Redux Toolkit |
| **File Upload** | Multer (for images) |

---

## 📷 Screenshots

📌 **To Do**: Add relevant screenshots such as product listing, product details page, cart view, checkout page, order history, and admin dashboard.

---

## ⚙️ Installation & Setup

1. **Clone the repo**

```bash
git clone https://github.com/thusy12/E-commerce-product-listing-app-MERN.git
cd E-commerce-product-listing-app-MERN
```

2. **Install dependencies**

For backend:
```bash
cd backend
npm install
```

For frontend:
```bash
cd ../frontend
npm install
```

3. **Set up environment variables**

Create a `config.env` file inside the backend/config/ folder with the following variables:

```bash
PORT = 8000
NODE_ENV =
DB_LOCAL_URI =
JWT_SECRET =
JWT_EXPIRES_TIME =
COOKIE_EXPIRES_TIME =
SMTP_HOST =
SMTP_PORT = 
SMTP_USER =
SMTP_PASSWORD =
SMTP_FROM_NAME =
SMTP_FROM_EMAIL =
BACKEND_URL = http://localhost:8000
FRONTEND_URL = http://localhost:3000
STRIPE_API_KEY = 
STRIPE_SECRET_KEY =
```

4. **Run the application locally**

For backend:
```bash
npm run dev
```

For frontend:
```bash
npm start
```

✅ Your application is now set up and ready to use! 🎉

---

## 🌱 Future Improvements

- 🐛 Ongoing bug fixes to improve app stability and user experience
- 🧹 Code refactoring and optimization for maintainability
- ✨ Adding new features regularly to enhance functionality and usability 
- 📱 Improve responsive design for mobile devices  
- 🧪 Add unit and integration tests  
- 🐳 Dockerize for consistent development & production environments  
- 🚀 Set up CI/CD pipeline for automated deployment  
- ☁️ Deploy to AWS cloud platforms

---