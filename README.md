# TransactiTrack

**TransactiTrack** is a modern, responsive web application designed to track financial transactions and manage categories effectively. It features a **Node.js backend** and a **React frontend**, integrated with **MongoDB Atlas** for database management.

---

## Features

### Backend
- Built with **Node.js** and **Express.js**.
- MongoDB Atlas as the database with **Mongoose** for schema definition.
- RESTful API endpoints for:
  - Managing transactions (CRUD operations).
  - Managing categories (CRUD operations).
- Environment variable configuration via `.env`.

### Frontend
- Built with **React** and styled using **styled-components**.
- **React Router** for seamless navigation.
- Fully responsive design inspired by GitHub's UI.
- Integration with the backend API to perform CRUD operations on transactions and categories.

---

## Prerequisites

Before running the application, ensure you have the following installed:

1. **Node.js** (v14.x or higher)
2. **npm** (v6.x or higher)
3. **MongoDB Atlas** account
4. **Git**

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Philos250/TransactiTrack.git
cd TransactiTrack
```

---

### 2. Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` folder and add the following:
   ```plaintext
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/transactitrack?retryWrites=true&w=majority
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   PORT=6000
   ```
   Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:6000`.

---

### 3. Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`.

---

## API Endpoints

### Transactions
- **GET** `/api/transactions`: Fetch all transactions.
- **POST** `/api/transactions`: Create a new transaction.
- **PUT** `/api/transactions/:id`: Update a transaction.
- **DELETE** `/api/transactions/:id`: Delete a transaction.

### Categories
- **GET** `/api/categories`: Fetch all categories.
- **POST** `/api/categories`: Create a new category.
- **PUT** `/api/categories/:id`: Update a category.
- **DELETE** `/api/categories/:id`: Delete a category.

---

## Project Structure

### Backend
```plaintext
backend/
├── src/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Middleware functions
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── .env                # Environment variables
├── package.json        # Backend dependencies
└── README.md           # Backend documentation
```

### Frontend
```plaintext
frontend/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, icons
│   ├── components/     # Reusable components
│   ├── pages/          # Main pages
│   ├── services/       # API calls
│   ├── styles/         # Global and theme styles
│   ├── App.js          # Main app component
│   └── index.js        # React entry point
├── package.json        # Frontend dependencies
└── README.md           # Frontend documentation
```

---

## Deployment

### Backend Deployment
- Use **Render**, **Heroku**, or **AWS** for hosting the backend.
- Ensure the environment variables (e.g., `MONGO_URI`) are correctly configured on the server.

### Frontend Deployment
- Use **Netlify**, **Vercel**, or **GitHub Pages** for hosting the frontend.
- Update the API base URL in `src/services/api.js` to point to the deployed backend.

---

## Contributions

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact
For questions or support, please contact:
- **HABIMANA Jean de Dieu**
- **Email**: jeandedh@andrew.cmu.edu

