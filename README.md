# Mixpanel Analytics MCP Server

This project implements a Model Context Protocol (MCP) server that provides access to Mixpanel Analytics API through a set of tools. These tools can be used by AI agents to query and analyze data from Mixpanel.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the server locally:
```bash
npm run dev
```

3. Deploy to Cloudflare Workers:
```bash
npm run deploy
```

This will deploy your MCP server to a URL like: `remote-mcp-server-authless.<your-account>.workers.dev/sse`

## Authentication

All tools require authentication parameters to be passed directly in each request:

- `username`: Your Mixpanel service account username
- `password`: Your Mixpanel service account password
- `project_id`: Your Mixpanel project ID

This approach avoids the use of environment variables, making the tools more flexible and secure.

## Documentation

Detailed documentation is available in the `docs` directory:

- [API Reference](/docs/api-reference.md) - Complete documentation of all tool parameters
- [Usage Guide](/docs/usage-guide.md) - Examples and use cases for each tool
- [Testing Guide](/docs/testing-guide.md) - Guide to test your MCP server implementation
- [Sample Responses](/docs/sample-responses.md) - Example JSON responses from each tool
- [Implementation Summary](/docs/implementation-summary.md) - Overview of the implementation and next steps

## Available Tools

### Event Analytics Tools

#### `get_today_top_events`
Get the top events for today.

#### `get_top_events`
Get the top events for a project.

#### `aggregated_event_property_values`
Get aggregated property values for events.

#### `aggregate_event_counts`
Get aggregate event counts.

### User/Profile Tools

#### `profile_event_activity`
Get profile event activity for specific users.

#### `query_profiles`
Query user profiles based on various criteria.

### Report Tools

#### `query_insights_report`
Fetch an Insights report by ID.

#### `query_funnel_report`
Get funnel analysis data.

#### `query_retention_report`
Get retention analysis data.

#### `query_frequency_report`
Get user engagement frequency data.

#### `query_segmentation_report`
Get segmentation analysis.

Also available: `query_segmentation_average`, `query_segmentation_sum`, `query_segmentation_bucket`

### Reference Tools

#### `list_saved_cohorts`
List all saved cohorts.

#### `list_saved_funnels`
List all saved funnels.

#### `top_event_properties`
Get top properties for an event.

#### `top_event_property_values`
Get top values for a specific event property.

#### `custom_jql`
Run custom JQL queries.

## Example Usage

### Example 1: Get Today's Top Events

```javascript
await agent.runTool("get_today_top_events", {
  username: "your-service-account-username",
  password: "your-service-account-password",
  project_id: "1234567",
  limit: 5
});
```

### Example 2: Query User Profiles

```javascript
await agent.runTool("query_profiles", {
  username: "your-service-account-username",
  password: "your-service-account-password",
  project_id: "1234567",
  where: "properties[\"total_purchases\"] > 5",
  output_properties: "[\"$email\", \"$name\", \"total_purchases\"]"
});
```

### Example 3: Run a Custom JQL Query

```javascript
await agent.runTool("custom_jql", {
  username: "your-service-account-username",
  password: "your-service-account-password",
  project_id: "1234567",
  script: `
    function main() {
      return Events({
        from_date: "2023-01-01",
        to_date: "2023-01-31"
      })
      .groupBy(["properties.country"], mixpanel.reducer.count())
      .map(function(row) {
        return { country: row.key[0], count: row.value };
      });
    }
  `
});
```

### Example 4: Get Funnel Analysis

```javascript
await agent.runTool("query_funnel_report", {
  username: "your-service-account-username",
  password: "your-service-account-password",
  project_id: "1234567",
  funnel_id: "12345",
  from_date: "2023-06-01",
  to_date: "2023-06-30"
});
```

## Connecting to MCP Clients

### Connect to Cloudflare AI Playground

You can connect to your MCP server from the Cloudflare AI Playground, which is a remote MCP client:

1. Go to https://playground.ai.cloudflare.com/
2. Enter your deployed MCP server URL (`remote-mcp-server-authless.<your-account>.workers.dev/sse`)
3. You can now use your Mixpanel tools directly from the playground!

### Connect Claude Desktop to your MCP server

You can connect to your remote MCP server from local MCP clients, by using the [mcp-remote proxy](https://www.npmjs.com/package/mcp-remote). 

To connect to your MCP server from Claude Desktop, follow [Anthropic's Quickstart](https://modelcontextprotocol.io/quickstart/user) and within Claude Desktop go to Settings > Developer > Edit Config.

Update with this configuration:

```json
{
  "mcpServers": {
    "mixpanel": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8787/sse"  // or remote-mcp-server-authless.your-account.workers.dev/sse
      ]
    }
  }
}
```

Restart Claude and you should see the Mixpanel tools become available. 
