# emma Backend Plugin

## Overview

The `emma-backend` plugin provides the backend services for the Emma application. It includes API implementations, routing, and testing logic.

## Getting started

The plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/emma/health](http://localhost:7007/api/emma/health).

## Key Files

- **`index.ts`**: Main entry point for the backend plugin.
- **`plugin.ts`**: Contains the initialization logic for the backend plugin.
- **`EmmaApiImpl.ts`**: Provides the implementation of the backend API.
- **`router.ts`**: Defines the routing logic for the backend services.
- **`router.test.ts`**: Contains tests for the routing logic.

## Installation
To install the dependencies, run:

```sh
yarn install
```

## Running the Plugin
To start the development server, run:

```sh
yarn dev
```

## Testing
To run the tests, use:

```sh
yarn test
```

## License
This project is licensed under the Apache 2.0 License.