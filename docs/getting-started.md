# Integrating emma plugins

[Backstage](https://backstage.io), an open-source platform created by Spotify, enables organizations to build custom developer portals, giving teams a unified way to manage infrastructure, services, and software catalogs. One of the most compelling features of Backstage is its ability to integrate modular plugins that extend its functionality in highly customizable ways.

Among the plugins being built by the emma community, `emma` and `emma-backend`, designed for managing and visualizing cloud compute pricing, are particularly powerful for helping your organization take advantage of the best CPU prices in the market. In this detailed guide, we will walk you through the entire process of integrating these plugins into a newly created Backstage app, so that by the end, you will have a developer portal equipped with emma visualization tools, seamlessly integrated into both the frontend and backend.

## Step 1: Create a new Backstage app

Before integrating the emma plugins, you first need to create a Backstage app if you haven’t done so already. Backstage makes this process simple with its CLI tool, which scaffolds a new app with all the basic components.

Run the following command to create a new Backstage app:

```bash
npx @backstage/create-app
```

After running this command, you’ll be prompted to give your app a name and select certain configurations. Once the setup process is complete, Backstage will generate the following structure:

- `packages/app`: Contains the frontend code of your app.
- `packages/backend`: Contains the backend code for your app.
- `app-config.yaml`: Configuration file that controls various aspects of your app.

This basic app structure will serve as the foundation for integrating the emma plugins.

## Step 2: Install the emma plugin

The first plugin we’ll integrate is emma, the frontend plugin that allows you to visualize and interact with cloud service data. To install emma in your newly created app, you need to add the plugin’s package to the frontend.

Navigate to the root of your Backstage app directory and run the following command:

```bash
yarn --cwd packages/app add @emma-community/backstage-plugin-emma
```

When asked to select package versions, simply opt for the latest one. This installs the emma plugin into your packages/app directory, which is where all frontend-related components are managed in the Backstage monorepo setup.

## Step 3: Add emma to your app frontend

Now that the emma plugin is installed, you need to register it in the app so that users can access it. This is done by adding a new route to the App.tsx file, which controls your app’s navigation.

- Open the `App.tsx` file located in `packages/app/src/App.tsx`.
- Import `EmmaHeatMapPage` from the emma plugin at the top of the file:

```typescript
import { EmmaHeatmapPage, EmmaComputePage } from '@emma-community/backstage-plugin-emma';
```

Next, add a route for the `EmmaHeatMapPage` within the existing `<FlatRoutes>` section:

```jsx
<Route path="/emma/heatmap" element={<EmmaHeatmapPage />} />
<Route path="/emma/compute" element={<EmmaHeatMapPage />} />
```

This creates a route that makes the emma plugin accessible from the path `/emma`. Once this is done, your Backstage app will be able to serve the emma frontend when navigating to that URL.

## Step 4: Add emma to your sidebar (Optional)

To improve navigation within your Backstage app, you can add the emma plugin to the app sidebar. This optional step allows users to access emma easily from any part of the app.

Here is how you can add a menu item for emma in the sidebar:

- Open the `Root.tsx` file, located in `packages/app/src/components/Root/Root.tsx`.
- Import the icon from Material UI to represent emma:

```typescript
import MapIcon from '@material-ui/icons/Map';
import ComputerIcon from '@material-ui/icons/Computer';
```

- Add a new `SidebarItem` element within the sidebar:

```jsx
<SidebarItem icon={MapIcon} to="emma/heatmap" text="Emma" />
<SidebarItem icon={ComputerIcon} to="emma/compute" text="Emma" />
```

This adds a menu item for the emma route, allowing users to navigate to the plugin directly from the sidebar.

## Step 5: Install the emma-backend plugin

The next step is to install the emma-backend plugin, which is responsible for data processing and handling API interactions for the frontend plugin. To install it, navigate to the packages/backend directory and run:

```bash
yarn --cwd packages/backend add @emma-community/backstage-plugin-emma-backend
```

When asked to select package versions, simply opt for the latest one. This command installs the emma-backend plugin in the backend of your Backstage app.

## Step 6: Configure emma-backend in backend app

Once the emma-backend plugin is installed, you need to configure it within your app’s backend. This is done by adding the necessary routes and middleware in the backend’s entry point file, index.tsx.

- Open the `index.tsx` file in `packages/backend/src/index.tsx`.

- Add the emma-backend plugin:

```typescript
backend.add(import('@emma-community/backstage-plugin-emma-backend'));
```

By adding this simple configuration, you’re enabling the backend to handle requests at the `/api/emma` endpoint, which the frontend plugin will use to fetch data.

## Step 7: Configure clientId and clientSecret in app-config.local.yaml

To ensure that the emma-backend plugin can properly access external services and APIs, you need to add the appropriate URL and credentials to your local configuration file(s).

Open the `app-config.yaml` file in the root of your Backstage app and add the following configuration:

```yaml
emma:
  baseUrl: https://emma.example.com
```

Open the `app-config.local.yaml` file in the root of your Backstage app and add the following configuration, replacing `your-client-id` and `your-client-secret` with your actual credentials:

```yaml
emma:
  clientId: your-client-id   
  clientSecret: your-client-secret
```

This ensures that your Backstage app can authenticate with emma external API and that your credentials do not get leaked on a rogue commit.

## Step 8: Verify installation

Finally, to ensure that everything is working as expected, bootstrap the application using the following command:

```bash
yarn dev
```
