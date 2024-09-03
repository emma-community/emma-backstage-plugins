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

## Installation

To install the dependencies for all plugins, run:

```sh
yarn install
```

## Running the Plugins
To start the development server for each plugin, navigate to the respective plugin directory and run:

```sh
yarn dev
```

## Testing
To run the tests for each plugin, navigate to the respective plugin directory and use:

```sh
yarn test
```

## License
This project is licensed under the MIT License.