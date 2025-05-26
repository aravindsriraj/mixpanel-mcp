# Testing the Mixpanel MCP Server Implementation

This guide provides steps to test your Mixpanel MCP server implementation to ensure everything is working correctly.

## Prerequisites

Before testing, you'll need:

- A Mixpanel account with service account credentials
- At least one Mixpanel project with some data
- The MCP server running locally or deployed

## Test Plan

### 1. Basic Connectivity

First, test that your MCP server is running and accessible:

```bash
# If running locally
curl -i http://localhost:8787/sse

# If deployed to Cloudflare
curl -i https://remote-mcp-server-authless.<your-account>.workers.dev/sse
```

You should receive a response indicating that the server is ready for SSE connections.

### 2. Authentication Test

Test that authentication parameters are being correctly processed:

1. Create a simple test script that calls a basic tool like `get_top_events` with:
   - Valid credentials
   - Invalid credentials

The server should return an appropriate error message for invalid credentials.

### 3. Tool Functionality Tests

Test each category of tools with a representative tool from each group:

#### Event Analytics Tool

```javascript
// Test get_top_events
const topEventsResult = await agent.runTool("get_top_events", {
  username: "your-service-account-username",
  password: "your-service-account-password",
  project_id: "your-project-id",
  limit: 3
});

console.log(JSON.stringify(topEventsResult, null, 2));
```

Expected: A JSON object containing the top events in your project.

#### User/Profile Tool

```javascript
// Test query_profiles with a simple query
const profilesResult = await agent.runTool("query_profiles", {
  username: "your-service-account-username",
  password: "your-service-account-password",
  project_id: "your-project-id",
  limit: 1
});

console.log(JSON.stringify(profilesResult, null, 2));
```

Expected: A JSON object containing user profile data.

#### Report Tool

```javascript
// Test a simple segmentation report
const segmentationResult = await agent.runTool("query_segmentation_report", {
  username: "your-service-account-username",
  password: "your-service-account-password",
  project_id: "your-project-id",
  event: "pageview", // Use an event that exists in your project
  from_date: "2023-06-01",
  to_date: "2023-06-02",
  where: "1=1"
});

console.log(JSON.stringify(segmentationResult, null, 2));
```

Expected: A JSON object containing segmentation data.

### 4. Error Handling Tests

Test how the server handles various error conditions:

#### Missing Required Parameters

```javascript
// Test missing required parameter
const missingParamsResult = await agent.runTool("get_top_events", {
  username: "your-service-account-username",
  password: "your-service-account-password"
  // Missing project_id
});
```

Expected: A clear error message indicating the missing parameter.

#### Invalid Parameter Format

```javascript
// Test invalid parameter format
const invalidFormatResult = await agent.runTool("aggregate_event_counts", {
  username: "your-service-account-username",
  password: "your-service-account-password",
  project_id: "your-project-id",
  event: "not-a-json-array", // Should be a JSON array string
  unit: "day",
  from_date: "2023-06-01",
  to_date: "2023-06-02"
});
```

Expected: A clear error message about the invalid format.

### 5. Performance Test

Test the server's performance with a heavier query:

```javascript
// Test a more complex query
const performanceTestResult = await agent.runTool("query_segmentation_report", {
  username: "your-service-account-username",
  password: "your-service-account-password",
  project_id: "your-project-id",
  event: "pageview",
  from_date: "2023-01-01",
  to_date: "2023-06-30", // 6 months of data
  where: "1=1",
  on: "properties.browser",
  unit: "month"
});
```

Monitor:
- Response time
- Any timeout issues
- Data completeness

### 6. Integration Test with MCP Client

Test the full integration with an MCP client like Claude Desktop:

1. Configure Claude Desktop to connect to your MCP server
2. Ask Claude to analyze your Mixpanel data using the tools
3. Verify that Claude can properly use the tools and interpret the results

Example prompt for Claude:
```
I have Mixpanel analytics data for my app. Using the Mixpanel MCP tools, can you show me:
1. What are the top 5 events in my project?
2. How many users performed the "purchase" event last month?
3. What's the retention rate for users who signed up in the last 30 days?

Use these credentials:
- Username: [your-username]
- Password: [your-password]
- Project ID: [your-project-id]
```

## Troubleshooting Common Issues

### 1. Authentication Failures

If you encounter "HTTP error! status: 401" or similar:
- Double-check your service account credentials
- Ensure the service account has appropriate permissions in Mixpanel

### 2. Data Format Issues

If you see "Invalid events format" or similar:
- Ensure all JSON strings are properly formatted
- Check that array parameters are properly formatted as JSON strings

### 3. Network Issues

If requests time out or fail to connect:
- Check your internet connection
- Verify that Mixpanel services are up and running
- Check for any proxy or firewall issues

### 4. Rate Limiting

If you encounter "HTTP error! status: 429":
- Reduce the frequency of requests
- Implement backoff strategies for retries

## Next Steps

After successful testing:

1. Document any specific requirements or limitations discovered
2. Consider implementing additional error handling or retry logic
3. Create examples for common analytics tasks with your specific data
4. Share the MCP server endpoint with your team for broader usage
