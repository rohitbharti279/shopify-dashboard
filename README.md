# Shopify Dashboard

A full-stack application to fetch and display data from Shopify, featuring a secure Express backend and a modern React frontend.

## Project Structure

```
shopify-dashboard/
├── backend/                    # Node.js/Express Backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth, error handling
│   │   ├── config/           # Configuration files
│   │   └── utils/            # Helper functions
│   ├── package.json
│   └── .env
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service calls
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React Context for state
│   │   ├── utils/           # Helper functions
│   │   └── styles/          # CSS/Styled-components
│   ├── package.json
│   └── .env
└── README.md
```

## Backend Setup

1. Go to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Shopify credentials (see `.env` example).
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on [http://localhost:5000](http://localhost:5000)

## Frontend Setup

1. Go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see `.env` example).
4. Start the frontend app:
   ```bash
   npm start
   ```
   The frontend will run on [http://localhost:3000](http://localhost:3000)

## Features

- Secure Express backend with Shopify Admin API integration
- REST API endpoints for products, orders, shop info, and analytics
- React frontend with dashboard, product listing, detail view, orders, and analytics
- Modern UI with Tailwind CSS, React Query, Chart.js, and more
- Pagination, search, filter, and responsive design

## Environment Variables

### Backend `.env`
```
PORT=5000
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_access_token_here
SHOPIFY_API_VERSION=2024-01
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SHOP_NAME=your-store
```

---

**Start building your Shopify dashboard!**
