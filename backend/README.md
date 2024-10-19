# HST RISK

For a preview of the app, please check this [README](../README.md)

## Table of Contents
- [Prerequisites](#prerequisites)
- [Running](#running)

## Prerequisites

Before you can build and run the backend of the application, ensure that you have the following installed:

- **Node.js** and **npm** for package management.

- **Setup MongoDB**: Setup a MongoDB database and link it to your backend using the database's mongo uri in the `.env` file
            
- **Create a .env**: You need to create a .env file with the required variables:
  
   Example: 
```.env
MONGO_URI = 'your-public-mongo-uri'
ENV = "development"
PORT = 8000
HOST = "localhost"
```

## Running

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/RamezzE/HST-Risk.git
   cd HST-Risk/backend

2. **Install dependencies**:
    ```
    npm install
    ```

3. Run the server:
    ```
    npm run dev
    ```
