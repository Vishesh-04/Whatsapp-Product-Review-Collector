# WhatsApp Product Review Collector

This is a full-stack application built for the SDE assignment. It
captures product reviews submitted by users over WhatsApp, stores them
in a PostgreSQL database, and displays them in a live React dashboard.

## Tech Stack

### Backend

-   Python (FastAPI)
-   SQLAlchemy
-   Uvicorn
-   python-dotenv

### Database

-   PostgreSQL

### Frontend

-   React.js
-   Tailwind CSS
-   Lucide React
-   HTML Canvas

### External Services

-   Twilio API (WhatsApp Sandbox)
-   ngrok

## Project Structure

    project-root/
    ├── backend/
    │   ├── main.py
    │   ├── requirements.txt
    │   └── .env
    ├── frontend/
    │   ├── src/
    │   │   ├── App.jsx
    │   │   └── ReviewChart.jsx
    │   └── package.json
    └── README.md

## Prerequisites

-   Python 3.10+
-   Node.js and npm
-   PostgreSQL Server
-   ngrok
-   Twilio WhatsApp Sandbox

## Installation & Setup

### 1. Backend Setup

    cd backend
    pip install -r requirements.txt

Create `.env`:

    DB_USER=postgres
    DB_PASSWORD=YourPgAdminPassword
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_NAME=Reviews

Run server:

    python main.py

### 2. Frontend Setup

    cd frontend
    npm install
    npm run dev

### 3. Twilio Webhook Setup

Start ngrok:

    ngrok http 8000

Set Twilio webhook to:

    https://your-ngrok-url/whatsapp

## Usage Guide

1.  Activate Twilio sandbox using join code.
2.  Send "Hi" to start review flow.
3.  View dashboard at http://localhost:5173.

## API Endpoints

  Endpoint       Method   Description
  -------------- -------- ----------------------
  /whatsapp      POST     Webhook endpoint
  /api/reviews   GET      Fetch stored reviews

## Troubleshooting

### Database authentication errors

Fix `.env` credentials and ensure DB_HOST=127.0.0.1.

### Twilio Error 11200

Check ngrok status and webhook URL.

### Dashboard not updating

Check console for CORS issues.

## Demo Video

[Click here to watch the demo video](https://www.loom.com/share/5dc57d06a1ec4296a8ad458fe72419f4)
