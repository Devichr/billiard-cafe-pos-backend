# Billiard Cafe POS Backend

This project is a backend API for a billiard and cafe Point of Sale (POS) system. It is built using TypeScript and Fastify, and it connects to a PostgreSQL database. The API provides endpoints for managing billiard games, cafe operations, and controlling lights via an ESP32 module.

## Features

- **Billiard Operations**: Manage game details and update scores.
- **Cafe Management**: Retrieve menu items and process orders.
- **ESP32 Control**: Send commands to an ESP32 module to control lights based on light IDs.

## Project Structure

```
billiard-cafe-pos-backend
├── src
│   ├── app.ts                # Main entry point of the application
│   ├── server.ts             # Server configuration and startup
│   ├── controllers           # Contains controllers for handling requests
│   │   ├── billiardController.ts
│   │   ├── cafeController.ts
│   │   └── esp32Controller.ts
│   ├── routes                # Defines API routes
│   │   ├── billiardRoutes.ts
│   │   ├── cafeRoutes.ts
│   │   └── esp32Routes.ts
│   ├── services              # Business logic for each domain
│   │   ├── billiardService.ts
│   │   ├── cafeService.ts
│   │   └── esp32Service.ts
│   ├── db                   # Database connection setup
│   │   └── index.ts
│   └── types                 # TypeScript interfaces and types
│       └── index.ts
├── package.json              # NPM dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd billiard-cafe-pos-backend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up the PostgreSQL database**:
   - Create a PostgreSQL database and configure the connection in `src/db/index.ts`.

4. **Run the application**:
   ```
   npm run start
   ```

## API Usage

- **Billiard API**: Access endpoints related to billiard operations.
- **Cafe API**: Access endpoints for managing cafe operations.
- **ESP32 API**: Use the ESP32 endpoints to control lights.

## License

This project is licensed under the MIT License.