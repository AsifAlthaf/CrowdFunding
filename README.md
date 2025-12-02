# CrowdFunding

CrowdFunding is a full-stack web application designed to simplify crowdfunding campaigns.  
It provides a secure backend, a responsive frontend, and tools for managing projects and donations.

---

## Features
- User authentication and profile management
- Create and manage crowdfunding campaigns
- Secure payment integration
- File uploads for campaign media
- RESTful API with Node.js + Express
- Frontend built with React

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, Redux
- **Authentication**: JWT
- **Deployment**: AWS EC2 (planned)

---

## Project Structure

```
project/ 
├── backend/ │ 
 ├── config/ │ 
 ├── controllers/ │ 
 ├── middleware/ │ 
 ├── models/ │ 
 ├── routes/ │ 
 ├── utils/ │
 └── server.js 
└── frontend/ 
 ├── src/ 
 ├── public/ 
 └── package.json

 ```
---

## Environment Variables
Create a `.env` file in `backend/` with:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PAYMENT_API_KEY=your_payment_key
```


**Never commit `.env`. Instead, provide a safe `.env.example` file for others.

---

## Installation
```bash
# Clone the repo
git clone https://github.com/AsifAlthaf/CrowdFundingX.git

# Backend setup
cd project/backend
npm install

# Frontend setup
cd ../frontend
npm install
```

## Running the App
```
# Backend
npm run dev

# Frontend
npm run dev
```

---

##Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to change.

