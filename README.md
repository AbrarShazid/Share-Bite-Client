# ShareBite 🍽️

**Live Site:** [https://share-bite-a11.vercel.app/](https://share-bite-a11.vercel.app/)

## 📌 Project Overview

**ShareBite** is a full-stack web platform for food sharing and surplus reduction. It enables individuals and organizations to donate excess food to those in need. Built using **Tailwind**, **React**, **Node.js**, **Express**, **Firebase**, **MongoDB**, and **TanStack Query**, the app supports secure CRUD operations, authentication, and dynamic user experiences with responsive design and animation.

---

## ✨ Key Features

### 🧾 Pages & Routing
- **Home**: Featured foods (top 6 by quantity)
- **Available Foods**: All available food items shown in cards, sortable by expiry date, searchable by name, with toggle between 2-column and 3-column layouts
- **Add Food**: Form to add new food
- **Manage My Foods**: View, update, or delete foods added by the logged-in user
- **My Food Requests**: View all food requests made by the user
- **Food Details**: View full food details and request it via a modal form

### 📦 Food Operations (CRUD)
- Add, update, delete foods
- View details of each food
- Request food (moves food from "available" to "requested")

### 💻 Frontend Tech Stack
- React 19
- Tailwind CSS
- Framer Motion for animations
- Lottie React for animated visuals
- TanStack Query for API calls and mutations
- Axios for HTTP requests
- Toast & SweetAlert2 for alerts
- SwiperJS for carousel/slider
- Fully responsive design across all devices

### 🔙 Backend Tech Stack
- Node.js with Express
- MongoDB with secure credential storage via `.env`
- JWT-based authentication
- Firebase Admin SDK for verifying Firebase tokens
- Proper CORS configuration

---

## 🔐 Security Measures
- Firebase API keys secured in `.env` file
- MongoDB credentials hidden via environment variables
- JWT used for all protected routes and requests
- Secure handling of tokens on the client side
- Domain whitelisted in Firebase for deployment


---

## 🧠 Extra Features & Enhancements
- Toggle layout between 2-column and 3-column grids on Available Foods page
- Sorting by expiry date
- Searching by food name with debounce
- Modal for food request with locked fields
- Framer Motion animations for a smooth, modern experience

---

## 📦 NPM Packages Used

### Frontend
- `react`, `react-router`, `react-dom`
- `firebase`, `axios`, `framer-motion`, `lottie-react`
- `@tanstack/react-query`, `sweetalert2`, `react-hot-toast`
- `react-icons`, `swiper`, `clsx`, `lodash.debounce`, `dayjs`
- `tailwind-variants`, `react-intersection-observer`, `use-debounce`

### Backend
- `express`, `cors`, `dotenv`, `mongodb`
- `cookie-parser`, `firebase-admin`, `jsonwebtoken`, `axios`

---

> “Share more, waste less — with ShareBite.”
