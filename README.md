
# Idosell Orders Backend

Backend service for fetching and storing orders from IdoSell, built with Node.js, Express, and MongoDB.

## Features
- Fetches initial orders and keeps updating them until finished/lost/false status
- Stores orders in MongoDB
- Provides REST API for fetching orders (JSON/CSV)
- Supports filtering orders by worth range
- Secure API using token authentication

## Installation (Local)
1. Clone repo
2. Copy `.env.example` -> `.env` and set values
3. Install deps:
   ```bash
   npm install
   ```
4. Run dev:
   ```bash
   npm run dev
   ```

## Run with Docker
1. Copy `.env.example` to `.env` and update your secrets (e.g., API token, IdoSell API key).
2. Build and start containers:
   ```bash
   docker-compose up --build
   ```
3. App will be available at: [http://localhost:3000](http://localhost:3000)
4. MongoDB will run at: `mongodb://localhost:27017/idosell`

## API Endpoints
- `GET /orders?minWorth=&maxWorth=&format=csv` → list orders (JSON or CSV)
- `GET /orders/:id` → single order by ID

Add header: `x-api-token: <API_TOKEN>` or `Authorization: <API_TOKEN>` to authenticate.

## License
MIT
