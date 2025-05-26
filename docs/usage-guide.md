# Mixpanel MCP Tools - Usage Guide

This document provides practical examples and usage patterns for the Mixpanel analytics tools provided by this MCP server.

## Prerequisites

Before using these tools, you need:

1. A Mixpanel account with service account credentials
2. The project ID for your Mixpanel project
3. Access to an MCP client that can connect to this server

## Getting Started

All tools require authentication parameters to be passed with each request:

```javascript
const params = {
  username: "your-service-account-username", // Your Mixpanel service account username
  password: "your-service-account-password", // Your Mixpanel service account password
  project_id: "1234567"                      // Your Mixpanel project ID
};
```

## Common Use Cases

### 1. Analyzing Event Data

#### Top Events Analysis

To understand what events are most frequent in your application:

```javascript
// Get today's top events
const todayTopEvents = await agent.runTool("get_today_top_events", {
  ...params,
  limit: 5
});

// Get all top events
const topEvents = await agent.runTool("get_top_events", {
  ...params,
  limit: 10
});
```

#### Event Counts Over Time

To analyze how event counts change over time:

```javascript
// Events over the last 30 days
const eventCounts = await agent.runTool("aggregate_event_counts", {
  ...params,
  event: "[\"play_song\", \"add_to_playlist\"]", // JSON array as string
  unit: "day",
  from_date: "2023-06-01", 
  to_date: "2023-06-30"
});
```

### 2. User Behavior Analysis

#### User Profiles

To query specific user profiles:

```javascript
// Get profiles of users with high purchase counts
const highValueUsers = await agent.runTool("query_profiles", {
  ...params,
  where: "properties[\"purchase_count\"] > 5",
  output_properties: "[\"$email\", \"$name\", \"purchase_count\", \"total_spent\"]"
});

// Get specific user profile by ID
const specificUser = await agent.runTool("query_profiles", {
  ...params,
  distinct_id: "user-123456"
});
```

#### User Event Activity

To analyze what specific users have been doing:

```javascript
// Get event activity for specific users
const userActivity = await agent.runTool("profile_event_activity", {
  ...params,
  distinct_ids: "[\"user-123\", \"user-456\"]",  // JSON array as string
  from_date: "2023-06-01",
  to_date: "2023-06-30"
});
```

### 3. Funnel Analysis

#### List Available Funnels

First, list available funnels in your project:

```javascript
// Get all saved funnels
const savedFunnels = await agent.runTool("list_saved_funnels", {
  ...params
});
```

#### Analyze a Specific Funnel

Then analyze a specific funnel by its ID:

```javascript
// Get funnel report
const funnelReport = await agent.runTool("query_funnel_report", {
  ...params,
  funnel_id: "12345", // ID from the list_saved_funnels response
  from_date: "2023-06-01",
  to_date: "2023-06-30"
});
```

### 4. Retention Analysis

To understand user retention:

```javascript
// D7 retention analysis (analyzing 7-day retention)
const retention = await agent.runTool("query_retention_report", {
  ...params,
  from_date: "2023-06-01",
  to_date: "2023-06-30",
  retention_type: "birth",
  born_event: "$mp_web_page_view", // First event
  unit: "day", // For D7 retention
  interval_count: 7 
});
```

### 5. Segmentation Analysis

To segment users by property:

```javascript
// Segment users by country
const segmentation = await agent.runTool("query_segmentation_report", {
  ...params,
  event: "purchase", 
  from_date: "2023-06-01",
  to_date: "2023-06-30",
  where: "1=1", // No filtering
  on: "properties.country", // Segment by country
  limit: 10 // Top 10 countries
});
```

### 6. Advanced: Custom JQL Queries

For advanced analytics, use custom JQL:

```javascript
// Users who performed event A but not event B
const customAnalysis = await agent.runTool("custom_jql", {
  ...params,
  script: `
    function main() {
      return join(
        Events({
          from_date: "2023-06-01",
          to_date: "2023-06-30",
          event_selectors: [{event: "event_a"}]
        }),
        Events({
          from_date: "2023-06-01",
          to_date: "2023-06-30",
          event_selectors: [{event: "event_b"}]
        }),
        {type: "leftJoin", leftKey: "distinct_id", rightKey: "distinct_id"}
      )
      .filter(function(row) {
        return row.right === null;
      })
      .groupBy(["properties.user_type"], mixpanel.reducer.count())
      .map(function(row) {
        return {
          user_type: row.key[0],
          count: row.value
        };
      });
    }
  `
});
```

## Best Practices

1. **Date Ranges**: Always specify reasonable date ranges to avoid timeout issues
2. **Error Handling**: Check for errors in the response and handle them appropriately
3. **Rate Limiting**: Be aware of Mixpanel's API rate limits when making multiple requests
4. **Credentials Security**: Never share or expose your service account credentials
5. **Complex Queries**: For complex analytics needs, use the `custom_jql` tool which offers the most flexibility

## Troubleshooting

If you encounter errors:

1. **Authentication Issues**: Ensure service account credentials are correct
2. **Format Issues**: Verify JSON strings are properly formatted
3. **Date Formats**: Use yyyy-mm-dd format for all dates
4. **Parameter Types**: Ensure numeric parameters are passed as numbers, not strings
5. **Response Size**: For large datasets, use filtering to reduce response size
