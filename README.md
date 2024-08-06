# Smart Cab Allocation System

## Overview

The Smart Cab Allocation System is a comprehensive solution designed to streamline the process of allocating cabs to users based on their location. The system ensures efficient cab allocation by identifying the nearest available cabs using geolocation data and the Google Maps API.

## Features

- **User Authentication**: Secure login and registration.
- **Cab Management**: Add, update, and fetch cab information.
- **Trip Management**: Create and manage trips with real-time location updates.
- **Interactive Maps**: Display cabs and trip locations on Google Maps.
- **Real-time Updates**: Using Socket.io for real-time communication.

## Technologies Used

### Backend

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for Node.js.
- **Mongoose**: MongoDB object modeling tool.
- **Google Maps API**: Used for calculating distances and travel times.
- **Socket.io**: Real-time communication library.
- **JWT**: JSON Web Tokens for secure authentication.

### Frontend

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript.
- **ShadCN**: UI components library.
- **Google Maps API**: Displaying maps and markers.

### External APIs

- **Google Maps API**: Used in both frontend and backend for geolocation and directions.

## Setup and Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/bhaveshAswani112/smart-cab-allocation.git
    cd smart-cab-allocation
    ```

2. **Install backend dependencies**:
    ```bash
    cd backend
    npm install
    ```

3. **Install frontend dependencies**:
    ```bash
    cd frontend
    npm install
    ```

4. **Set up environment variables**:
    Create a `.env` file in the backend directory with the following content:
    ```plaintext
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/smart-cab-allocation
    JWT_SECRET=your_jwt_secret
    GOOGLE_MAPS_API_KEY=your_google_maps_api_key
    ```

5. **Start the backend server**:
    ```bash
    cd backend
    node server.js
    ```

6. **Start the frontend server**:
    ```bash
    cd frontend
    npm run dev
    ```

## Usage

1. **Authentication**:
    - Users can register and log in to access the system.

2. **Adding a Cab**:
    - Use the form to add a new cab with its location details.

3. **Creating a Trip**:
    - Select the start and end locations on the map to create a new trip.
    - The system will allocate the nearest available cab.

4. **Real-time Updates**:
    - The system uses Socket.io for real-time updates on cab status and trip progress.

## Directory Structure

```plaintext
smart-cab-allocation/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── utils/
│   ├── .env
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
└── README.md
