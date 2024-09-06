# Emma Backstage Plugins

## Overview

The `emma-backstage-plugins` repository contains three main plugins: `emma`, `emma-backend`, and `emma-common`. These plugins work together to provide a comprehensive solution for managing and displaying data through a frontend interface and backend services.

## Plugins

### `emma` Plugin

The `emma` plugin provides the frontend components and logic for the Emma application. It includes UI components for displaying data, routing, and API interactions.

**Key Features:**
- Main entry points for the plugin.
- Initialization logic.
- Routing definitions.
- API client for backend interactions.
- UI components for heat maps.

### `emma-backend` Plugin

The `emma-backend` plugin provides the backend services for the Emma application. It includes API implementations, routing, and testing logic.

**Key Features:**
- Main entry point for the backend plugin.
- Initialization logic.
- Backend API implementations.
- Routing logic for backend services.
- Tests for routing logic.

### `emma-common` Plugin

The `emma-common` plugin provides shared resources such as constants, types, and API methods that are used by both the frontend and backend plugins.

**Key Features:**
- Shared constants and types.
- Permission management logic.
- API interaction methods and factory functions.
- Setup logic for tests.

## Getting started

### Clone the Repository

```sh
git clone https://github.com/your-repo/emma-backstage-plugins.git
cd emma-backstage-plugins
```

### Set Environment Variables

Ensure that the environment variables `EMMA_CLIENT_ID` and `EMMA_CLIENT_SECRET` are set in your environment. You can set them in your terminal session or in a `.env` file.

```sh
export EMMA_CLIENT_ID=your_client_id
export EMMA_CLIENT_SECRET=your_client_secret
```

### Install plugin dependencies

```sh
yarn install
```

## Running the code
To start the application stay in the root directory. To start the development server for each plugin, navigate to the respective plugin directories. Then run:

```sh
yarn dev
```

## Testing the code
To run all tests stay in the root directory. To run the tests for each plugin, navigate to the respective plugin directories. Then run:

```sh
yarn test
```

## Building and running with Docker

This section provides instructions on how to build and run the Backstage application using Docker Compose. The setup includes two main services: a PostgreSQL database (`backstage_db`) and the Backstage backend (`backend`).

### Prerequisites

- Docker and Docker Compose installed on your machine.
- Environment variables `EMMA_CLIENT_ID` and `EMMA_CLIENT_SECRET` set in your environment.

### Docker Compose configuration

The `docker-compose.yaml` file defines the services and their configurations.

### Steps to build and run

1. **Build and run the services**:
   Use Docker Compose to build and run the services defined in the `docker-compose.yaml` file.

   ```sh
   docker-compose up --build
   ```

   This command will:
   - Pull the latest PostgreSQL image and start the `backstage_db` service.
   - Build the Backstage backend image from the Dockerfile located at `packages/backend/Dockerfile`.
   - Start the `backstage-backend` service, which depends on the `backstage_db` service.

2. **Access the application**:
   Once the services are up and running, you can access the Backstage application at `http://localhost:7007`.

### Stopping the services

To stop the running services, use the following command:

```sh
docker-compose down
```

This command will stop and remove the containers, networks, and volumes created by Docker Compose.

### Additional notes

- The PostgreSQL database data is persisted in a Docker volume named `db`.
- The `backend` service uses environment variables for database connection and Emma API credentials.

By following these steps, you can easily build and run the Backstage application using Docker Compose.

## License
This project is licensed under the MIT License.