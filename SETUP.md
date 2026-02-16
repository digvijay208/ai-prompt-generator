# Setup Instructions

## Prerequisites
- Node.js installed
- MongoDB installed and running

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB (if not running):
```bash
mongod
```

3. Start the server:
```bash
npm start
```

4. Open your browser and go to:
```
http://localhost:3000
```

## Usage
- First visit will redirect to login page
- Create an account or login
- Access the AI Prompt Generator after authentication

## Files Created
- `login.html` - Login/signup page
- `auth.js` - Frontend authentication
- `server.js` - Node.js backend with MongoDB
- `package.json` - Dependencies