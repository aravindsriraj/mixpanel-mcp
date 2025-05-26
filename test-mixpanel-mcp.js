/**
 * Test Script for Mixpanel MCP Server
 * 
 * This script tests basic functionality of the Mixpanel MCP server.
 * Update the credentials and project ID before running.
 * 
 * Prerequisites:
 * - Node.js installed
 * - An active Mixpanel account with service account credentials
 * - Your MCP server running locally or deployed
 * 
 * Setup:
 * 1. Update the `username`, `password`, and `projectId` constants with your credentials
 * 2. Set `MCP_SERVER_URL` to your deployed MCP server URL or local development URL
 * 3. Run with `node test-mixpanel-mcp.js`
 */

// Update these with your actual Mixpanel service account credentials
const username = "YOUR_MIXPANEL_USERNAME";
const password = "YOUR_MIXPANEL_PASSWORD";
const projectId = "YOUR_PROJECT_ID";

// Update this with your MCP server URL
const MCP_SERVER_URL = "http://localhost:8787/mcp";

// Function to call an MCP tool
async function callMcpTool(toolName, params) {
  console.log(`\n📡 Testing tool: ${toolName}`);
  
  try {
    const response = await fetch(MCP_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tool_name: toolName,
        parameters: params,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Success: ${toolName}`);
    
    // Pretty print the first 500 chars of the result
    const resultText = data.content[0].text;
    console.log("Result preview:");
    console.log(resultText.substring(0, 500) + (resultText.length > 500 ? "..." : ""));
    
    return data;
  } catch (error) {
    console.error(`❌ Error with ${toolName}:`, error.message);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log("🚀 Starting Mixpanel MCP server tests\n");
  console.log("Using MCP server at:", MCP_SERVER_URL);

  // Test 1: Get top events (basic test)
  await callMcpTool("get_top_events", {
    username,
    password,
    project_id: projectId,
    limit: 5,
  });

  // Test 2: Try with invalid credentials
  await callMcpTool("get_top_events", {
    username: "invalid_username",
    password: "invalid_password",
    project_id: projectId,
  });

  // Test 3: Query profiles
  await callMcpTool("query_profiles", {
    username,
    password,
    project_id: projectId,
    limit: 1,
  });

  // Test 4: List saved funnels
  await callMcpTool("list_saved_funnels", {
    username,
    password,
    project_id: projectId,
  });

  // Test 5: Run with missing parameters
  await callMcpTool("query_segmentation_report", {
    username,
    password,
    project_id: projectId,
    // Missing required parameters
  });

  console.log("\n🏁 Tests completed");
}

// Run the tests
runTests().catch(console.error);
