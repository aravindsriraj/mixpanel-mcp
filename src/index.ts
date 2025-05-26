import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Mixpanel Analytics",
		version: "1.0.0",
	});

	async init() {
		// Get today's top events from Mixpanel
		this.server.tool(
			"get_today_top_events",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				type: z.enum(["general", "average", "unique"]).describe("The type of events to fetch, either general, average, or unique, defaults to general").optional(),
				limit: z.number().optional().describe("Maximum number of events to return"),
			},
			async ({ username, password, project_id, type = "general", limit = 10 }) => {
				try {
					// Create authorization header using base64 encoding of credentials
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Construct URL with query parameters
					const url = `https://mixpanel.com/api/query/events/top?project_id=${project_id}&type=${type}${limit ? `&limit=${limit}` : ''}`;
					
					// Set up request options
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					// Make the API request
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error fetching Mixpanel events:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error fetching Mixpanel events: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);

		// Get top events from Mixpanel
		this.server.tool(
			"get_top_events",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				type: z.enum(["general", "average", "unique"]).describe("The type of events to fetch, either general, average, or unique, defaults to general").optional(),
				limit: z.number().optional().describe("Maximum number of events to return"),
			},
			async ({ username, password, project_id, type = "general", limit = 10 }) => {
				try {
					// Create authorization header using base64 encoding of credentials
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Construct URL with query parameters
					const url = `https://mixpanel.com/api/query/events/names?project_id=${project_id}&type=${type}${limit ? `&limit=${limit}` : ''}`;
					
					// Set up request options
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					// Make the API request
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error fetching Mixpanel events:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error fetching Mixpanel events: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);

		// Get profile event activity
		this.server.tool(
			"profile_event_activity",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				workspace_id: z.string().describe("The ID of the workspace if applicable").optional(),
				distinct_ids: z.string().describe("A JSON array as a string representing the `distinct_ids` to return activity feeds for. Example: `[\"12a34aa567eb8d-9ab1c26f345b67-89123c45-6aeaa7-89f12af345f678\"]`"),
				from_date: z.string().describe("The date in yyyy-mm-dd format to begin querying from (inclusive)"),
				to_date: z.string().describe("The date in yyyy-mm-dd format to query to (inclusive)"),
			},
			async ({ username, password, project_id, workspace_id, distinct_ids, from_date, to_date }) => {
				try {
					// Create authorization header using base64 encoding of credentials
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Construct URL with query parameters
					let url = `https://mixpanel.com/api/query/stream/query?project_id=${project_id}&distinct_ids=${encodeURIComponent(distinct_ids)}&from_date=${from_date}&to_date=${to_date}`;
					
					// Add optional workspace_id if provided
					if (workspace_id) {
						url += `&workspace_id=${workspace_id}`;
					}
					
					// Set up request options
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					// Make the API request
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`API request failed with status ${response.status}: ${errorText}`);
					}
					
					const data = await response.json();
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error('Error fetching profile event activity:', error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error fetching profile event activity: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);

		// Get aggregate event counts
		this.server.tool(
			"aggregate_event_counts",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				event: z.string().describe("The event or events that you wish to get data for, a string encoded as a JSON array. Example format: \"[\\\"play song\\\", \\\"log in\\\", \\\"add playlist\\\"]\""),
				type: z.enum(["general", "unique", "average"]).describe("The type of data to fetch, either general, unique, or average, defaults to general").optional(),
				unit: z.enum(["minute", "hour", "day", "week", "month"]).describe("The level of granularity of the data you get back"),
				interval: z.number().optional().describe("The number of units to return data for. Specify either interval or from_date and to_date"),
				from_date: z.string().optional().describe("The date in yyyy-mm-dd format to begin querying from (inclusive)"),
				to_date: z.string().optional().describe("The date in yyyy-mm-dd format to query to (inclusive)"),
			},
			async ({ username, password, project_id, event, type = "general", unit, interval, from_date, to_date }) => {
				try {
					// Create authorization header using base64 encoding of credentials
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Validate parameters
					if (!interval && (!from_date || !to_date)) {
						throw new Error("You must specify either interval or both from_date and to_date");
					}
					
					// Parse events to ensure it's a valid JSON array
					let parsedEvents;
					try {
						parsedEvents = JSON.parse(event);
						if (!Array.isArray(parsedEvents)) {
							throw new Error("Events must be a JSON array");
						}
					} catch (e) {
						throw new Error(`Invalid events format: ${e instanceof Error ? e.message : String(e)}`);
					}
					
					// Build query parameters
					const queryParams = new URLSearchParams({
						project_id: project_id || '',
						type: type,
						unit: unit
					});
					
					// Add either interval or date range
					if (interval) {
						queryParams.append('interval', interval.toString());
					} else {
						queryParams.append('from_date', from_date || '');
						queryParams.append('to_date', to_date || '');
					}
					
					// Add events parameter
					queryParams.append('event', event);
					
					// Construct URL with query parameters
					const url = `https://mixpanel.com/api/query/events?${queryParams.toString()}`;
					
					// Set up request options
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					// Make the API request
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error fetching Mixpanel event counts:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error fetching Mixpanel event counts: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);

		// Get insights report
		this.server.tool(
			"query_insights_report",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
				bookmark_id: z.string().describe("The ID of your Insights report"),
			},
			async ({ username, password, project_id, workspace_id, bookmark_id }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					const queryParams = new URLSearchParams({
						project_id: project_id || '',
						bookmark_id: bookmark_id
					});
					
					if (workspace_id) {
						queryParams.append('workspace_id', workspace_id);
					}
					
					const url = `https://mixpanel.com/api/query/insights?${queryParams.toString()}`;
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error fetching Mixpanel insights:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error fetching Mixpanel insights: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);

		// Get funnel report
		this.server.tool(
			"query_funnel_report",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
				funnel_id: z.string().describe("The Mixpanel funnel ID that you wish to get data for"),
				from_date: z.string().describe("The date in yyyy-mm-dd format to begin querying from (inclusive)"),
				to_date: z.string().describe("The date in yyyy-mm-dd format to query to (inclusive)"),
				length: z.number().optional().describe("The number of units each user has to complete the funnel"),
				length_unit: z.enum(["day", "hour", "minute", "second"]).optional().describe("The unit applied to the length parameter"),
				interval: z.number().optional().describe("The number of days you want each bucket to contain"),
				unit: z.enum(["day", "week", "month"]).optional().describe("Alternate way of specifying interval"),
			},
			async ({ username, password, project_id, workspace_id, funnel_id, from_date, to_date, length, length_unit, interval, unit }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					const queryParams = new URLSearchParams({
						project_id: project_id,
						funnel_id: funnel_id,
						from_date: from_date,
						to_date: to_date
					});
					
					if (workspace_id) queryParams.append('workspace_id', workspace_id);
					if (length) queryParams.append('length', length.toString());
					if (length_unit) queryParams.append('length_unit', length_unit);
					if (interval) queryParams.append('interval', interval.toString());
					if (unit) queryParams.append('unit', unit);
					
					const url = `https://mixpanel.com/api/query/funnels?${queryParams.toString()}`;
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();

					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error fetching Mixpanel funnel data:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error fetching Mixpanel funnel data: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);

		// List saved cohorts
		this.server.tool(
			"list_saved_cohorts",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
			},
			async ({ username, password, project_id, workspace_id }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					let url = `https://mixpanel.com/api/query/cohorts?project_id=${project_id}`;
					if (workspace_id) {
						url += `&workspace_id=${workspace_id}`;
					}
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error listing saved cohorts:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error listing saved cohorts: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);

		// List saved funnels
		this.server.tool(
			"list_saved_funnels",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
			},
			async ({ username, password, project_id, workspace_id }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					let url = `https://mixpanel.com/api/query/funnels/list?project_id=${project_id}`;
					if (workspace_id) {
						url += `&workspace_id=${workspace_id}`;
					}
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error listing saved funnels:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error listing saved funnels: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);
		
		// Query segmentation average
		this.server.tool(
			"query_segmentation_average",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				event: z.string().describe("The event that you wish to get data for. Note: this is a single event name, not an array"),
				from_date: z.string().describe("The date in yyyy-mm-dd format to begin querying from (inclusive)"),
				to_date: z.string().describe("The date in yyyy-mm-dd format to query to (inclusive)"),
				on: z.string().describe("The expression to average per unit time. The result of the expression should be a numeric value"),
				unit: z.enum(["hour", "day"]).optional().describe("The buckets [hour, day] into which the property values are placed. Default is 'day'"),
				where: z.string().optional().describe("An expression to filter events"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
			},
			async ({ username, password, project_id, event, from_date, to_date, on, unit = "day", where, workspace_id }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Construct parameters
					const queryParams = new URLSearchParams({
						project_id: project_id || '',
						event: event,
						from_date: from_date,
						to_date: to_date,
						on: on,
						unit: unit
					});
					
					if (where) queryParams.append('where', where);
					if (workspace_id) queryParams.append('workspace_id', workspace_id);
					
					const url = `https://mixpanel.com/api/query/segmentation/average?${queryParams.toString()}`;
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error querying segmentation average:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error querying segmentation average: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);

		// Query segmentation sum
		this.server.tool(
			"query_segmentation_sum",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				event: z.string().describe("The event that you wish to get data for (single event name, not an array)"),
				from_date: z.string().describe("The date in yyyy-mm-dd format to begin querying from (inclusive)"),
				to_date: z.string().describe("The date in yyyy-mm-dd format to query to (inclusive)"),
				on: z.string().describe("The expression to sum per unit time (should result in a numeric value)"),
				unit: z.enum(["hour", "day"]).optional().describe("Time bucket size: 'hour' or 'day'. Default is 'day'"),
				where: z.string().optional().describe("An expression to filter events"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
			},
			async ({ username, password, project_id, event, from_date, to_date, on, unit = "day", where, workspace_id }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Construct parameters
					const queryParams = new URLSearchParams({
						project_id: project_id || '',
						event: event,
						from_date: from_date,
						to_date: to_date,
						on: on,
						unit: unit
					});
					
					if (where) queryParams.append('where', where);
					if (workspace_id) queryParams.append('workspace_id', workspace_id);
					
					const url = `https://mixpanel.com/api/query/segmentation/sum?${queryParams.toString()}`;
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error querying segmentation sum:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error querying segmentation sum: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);

		// Query segmentation report
		this.server.tool(
			"query_segmentation_report",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				event: z.string().describe("The event that you wish to get data for. Note: this is a single event name, not an array"),
				from_date: z.string().describe("The date in yyyy-mm-dd format to begin querying from (inclusive)"),
				to_date: z.string().describe("The date in yyyy-mm-dd format to query to (inclusive)"),
				where: z.string().describe("An expression to filter events"),
				unit: z.enum(["minute", "hour", "day", "month"]).optional().describe("The buckets into which the property values that you segment on are placed. Default is 'day'"),
				interval: z.number().optional().describe("Optional parameter in lieu of 'unit' when 'type' is not 'general'. Determines the number of days your results are bucketed into"),
				type: z.enum(["general", "unique", "average"]).optional().describe("The type of analysis to perform, either general, unique, or average, defaults to general"),
				limit: z.number().optional().describe("Return the top property values. Defaults to 60. Maximum value 10,000. This parameter does nothing if 'on' is not specified"),
				on: z.string().optional().describe("The property expression to segment the event on"),
				format: z.enum(["csv"]).optional().describe("Can be set to 'csv'"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
			},
			async ({ username, password, project_id, event, from_date, to_date, where, unit = "day", interval, type = "general", limit = 60, on, format, workspace_id }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Construct parameters
					const queryParams = new URLSearchParams({
						project_id: project_id || '',
						event: event,
						from_date: from_date,
						to_date: to_date,
						where: where,
						unit: unit,
						type: type
					});
					
					if (interval) queryParams.append('interval', interval.toString());
					if (limit) queryParams.append('limit', limit.toString());
					if (on) queryParams.append('on', on);
					if (format) queryParams.append('format', format);
					if (workspace_id) queryParams.append('workspace_id', workspace_id);
					
					const url = `https://mixpanel.com/api/query/segmentation?${queryParams.toString()}`;
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error querying segmentation report:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error querying segmentation report: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);

		// Query segmentation bucket
		this.server.tool(
			"query_segmentation_bucket",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				event: z.string().describe("The event that you wish to get data for. Note: this is a single event name, not an array"),
				from_date: z.string().describe("The date in yyyy-mm-dd format to begin querying from (inclusive)"),
				to_date: z.string().describe("The date in yyyy-mm-dd format to query to (inclusive)"),
				on: z.string().describe("The property expression to segment the event on. This expression must be a numeric property"),
				where: z.string().describe("An expression to filter events"),
				unit: z.enum(["hour", "day"]).optional().describe("The buckets into which the property values that you segment on are placed. Default is 'day'"),
				type: z.enum(["general", "unique", "average"]).optional().describe("The type of analysis to perform, either general, unique, or average, defaults to general"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
			},
			async ({ username, password, project_id, event, from_date, to_date, on, where, unit = "day", type = "general", workspace_id }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Construct parameters
					const queryParams = new URLSearchParams({
						project_id: project_id || '',
						event: event,
						from_date: from_date,
						to_date: to_date,
						on: on,
						where: where,
						unit: unit,
						type: type
					});
					
					if (workspace_id) queryParams.append('workspace_id', workspace_id);
					
					const url = `https://mixpanel.com/api/query/segmentation/numeric?${queryParams.toString()}`;
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error querying segmentation bucket:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error querying segmentation bucket: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);
		
		// Query retention report
		this.server.tool(
			"query_retention_report",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				from_date: z.string().describe("The date in yyyy-mm-dd format to begin querying from (inclusive)"),
				to_date: z.string().describe("The date in yyyy-mm-dd format to query to (inclusive)"),
				retention_type: z.enum(["birth", "compounded"]).optional().describe("Type of retention: 'birth' (first time) or 'compounded' (recurring). Defaults to 'birth'"),
				born_event: z.string().optional().describe("The first event a user must do to be counted in a birth retention cohort, required if retention_type is 'birth'. Can use $mp_web_page_view as the born_event for general cases."),
				event: z.string().optional().describe("The event to generate returning counts for. If not specified, looks across all events"),
				born_where: z.string().optional().describe("An expression to filter born_events"),
				return_where: z.string().optional().describe("An expression to filter return events"),
				interval: z.number().optional().describe("The number of individual bucketed interval. Default is 1. DO NOT USE IF ALREADY PROVIDING UNIT."),
				interval_count: z.number().optional().describe("The number of individual buckets/intervals to return. Default is 1. DO NOT USE IF ALREADY PROVIDING UNIT."),
				unit: z.enum(["day", "week", "month"]).optional().describe("The interval unit: 'day' (eg use if asked for D7 or D30), 'week' (eg use if asked for W12), or 'month' (eg use if asked for M6). Default is 'day'. DO NOT USE IF ALREADY PROVIDING INTERVAL."),
				on: z.string().optional().describe("The property expression to segment the second event on"),
				limit: z.number().optional().describe("Return the top limit segmentation values. Only applies when 'on' is specified"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
			},
			async ({ username, password, project_id, from_date, to_date, retention_type = "birth", born_event, event, born_where, return_where, interval, interval_count, unit, on, limit, workspace_id }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Construct parameters
					const queryParams = new URLSearchParams({
						project_id: project_id || '',
						from_date: from_date,
						to_date: to_date,
						retention_type: retention_type
					});
					
					// Add optional parameters
					if (born_event) queryParams.append('born_event', born_event);
					if (event) queryParams.append('event', event);
					if (born_where) queryParams.append('born_where', born_where);
					if (return_where) queryParams.append('return_where', return_where);
					if (interval) queryParams.append('interval', interval.toString());
					if (interval_count) queryParams.append('interval_count', interval_count.toString());
					if (unit) queryParams.append('unit', unit);
					if (on) queryParams.append('on', on);
					if (limit) queryParams.append('limit', limit.toString());
					if (workspace_id) queryParams.append('workspace_id', workspace_id);
					
					const url = `https://mixpanel.com/api/query/retention?${queryParams.toString()}`;
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error querying retention report:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error querying retention report: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);
		
		// Query frequency report
		this.server.tool(
			"query_frequency_report",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				from_date: z.string().describe("The date in yyyy-mm-dd format to begin querying from (inclusive)"),
				to_date: z.string().describe("The date in yyyy-mm-dd format to query to (inclusive)"),
				unit: z.enum(["day", "week", "month"]).describe("The overall time period to return frequency of actions for"),
				addiction_unit: z.enum(["hour", "day"]).describe("The granularity to return frequency of actions at"),
				where: z.string().describe("An expression to filter the returning events"),
				event: z.string().optional().describe("The event to generate returning counts for"),
				on: z.string().optional().describe("The property expression to segment the second event on"),
				limit: z.number().optional().describe("Return the top limit segmentation values. This parameter does nothing if 'on' is not specified"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
			},
			async ({ username, password, project_id, from_date, to_date, unit, addiction_unit, where, event, on, limit, workspace_id }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Construct parameters
					const queryParams = new URLSearchParams({
						project_id: project_id || '',
						from_date: from_date,
						to_date: to_date,
						unit: unit,
						addiction_unit: addiction_unit,
						where: where
					});
					
					// Add optional parameters
					if (event) queryParams.append('event', event);
					if (on) queryParams.append('on', on);
					if (limit) queryParams.append('limit', limit.toString());
					if (workspace_id) queryParams.append('workspace_id', workspace_id);
					
					const url = `https://mixpanel.com/api/query/addiction?${queryParams.toString()}`;
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error querying frequency report:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error querying frequency report: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);
		
		// Query profiles
		this.server.tool(
			"query_profiles",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
				where: z.string().optional().describe("An expression to filter users (or groups)"),
				output_properties: z.string().optional().describe("A JSON array of names of properties you want returned. Example: '[\"$last_name\", \"$email\", \"Total Spent\"]'"),
				filter_by_cohort: z.string().optional().describe("Takes a JSON object with a single key called 'id' whose value is the cohort ID. Example: '{\"id\":12345}'"),
				include_all_users: z.boolean().optional().describe("Only applicable with 'filter_by_cohort' parameter. Default is true"),
				distinct_ids: z.string().optional().describe("A JSON array of distinct_ids to retrieve profiles for. Example: '[\"id1\", \"id2\"]'"),
				distinct_id: z.string().optional().describe("A unique identifier used to distinguish an individual profile"),
				session_id: z.string().optional().describe("A string id provided in the results of a previous query. Using a session_id speeds up api response, and allows paging through results"),
				page: z.number().optional().describe("Which page of the results to retrieve. Pages start at zero. If the 'page' parameter is provided, the session_id parameter must also be provided"),
				data_group_id: z.string().optional().describe("The ID of the group key, used when querying group profiles"),
				behaviors: z.number().optional().describe("If you are exporting user profiles using an event selector, you use a 'behaviors' parameter in your request"),
				as_of_timestamp: z.number().optional().describe("This parameter is only useful when also using 'behaviors'"),
			},
			async ({ username, password, project_id, workspace_id, where, output_properties, filter_by_cohort, include_all_users, distinct_ids, distinct_id, session_id, page, data_group_id, behaviors, as_of_timestamp }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Build query parameters
					const queryParams = new URLSearchParams({
						project_id: project_id || ''
					});
					
					// Add optional parameters
					if (workspace_id) queryParams.append('workspace_id', workspace_id);
					if (where) queryParams.append('where', where);
					if (output_properties) queryParams.append('output_properties', output_properties);
					if (filter_by_cohort) queryParams.append('filter_by_cohort', filter_by_cohort);
					if (include_all_users !== undefined) queryParams.append('include_all_users', include_all_users.toString());
					if (distinct_ids) queryParams.append('distinct_ids', distinct_ids);
					if (distinct_id) queryParams.append('distinct_id', distinct_id);
					if (session_id) queryParams.append('session_id', session_id);
					if (page !== undefined) queryParams.append('page', page.toString());
					if (data_group_id) queryParams.append('data_group_id', data_group_id);
					if (behaviors !== undefined) queryParams.append('behaviors', behaviors.toString());
					if (as_of_timestamp !== undefined) queryParams.append('as_of_timestamp', as_of_timestamp.toString());
					
					const url = `https://mixpanel.com/api/query/user?${queryParams.toString()}`;
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error querying profiles:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error querying profiles: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);
		
		// Get aggregated event property values
		this.server.tool(
			"aggregated_event_property_values",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				from_date: z.string().optional().describe("The date in yyyy-mm-dd format to begin querying from (inclusive)"),
				to_date: z.string().optional().describe("The date in yyyy-mm-dd format to query to (inclusive)"),
				interval: z.number().optional().describe("The number of units to return data for. Specify either interval or from_date and to_date"),
				event: z.string().describe("The event that you wish to get data for (a single event name, not an array)"),
				name: z.string().describe("The name of the property you would like to get data for"),
				values: z.string().optional().describe("The specific property values to get data for, encoded as a JSON array. Example: \"[\"female\", \"unknown\"]\""),
				type: z.enum(["general", "unique", "average"]).optional().describe("The analysis type - general, unique, or average events, defaults to general"),
				unit: z.enum(["minute", "hour", "day", "week", "month"]).describe("The level of granularity of the data (minute, hour, day, week, or month)"),
				limit: z.number().optional().describe("The maximum number of values to return (default: 255)"),
			},
			async ({ username, password, project_id, from_date, to_date, interval, event, name, values, type = "general", unit, limit = 255 }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Validate parameters
					if (!interval && (!from_date || !to_date)) {
						throw new Error("You must specify either interval or both from_date and to_date");
					}
					
					// Build query parameters
					const queryParams = new URLSearchParams({
						project_id: project_id || '',
						event: event,
						name: name,
						type: type,
						unit: unit,
						limit: limit.toString()
					});
					
					// Add either interval or date range
					if (interval) {
						queryParams.append('interval', interval.toString());
					} else {
						queryParams.append('from_date', from_date || '');
						queryParams.append('to_date', to_date || '');
					}
					
					if (values) queryParams.append('values', values);
					
					const url = `https://mixpanel.com/api/query/events/properties/values?${queryParams.toString()}`;
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error fetching event property values:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error fetching event property values: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);
		
		// Top event properties
		this.server.tool(
			"top_event_properties",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				event: z.string().describe("The event that you wish to get data for. Note: this is a single event name, not an array"),
				limit: z.number().optional().describe("The maximum number of properties to return. Defaults to 10"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
			},
			async ({ username, password, project_id, event, limit = 10, workspace_id }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Construct parameters
					const queryParams = new URLSearchParams({
						project_id: project_id || '',
						event: event,
						limit: limit.toString()
					});
					
					if (workspace_id) queryParams.append('workspace_id', workspace_id);
					
					const url = `https://mixpanel.com/api/query/events/properties?${queryParams.toString()}`;
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error fetching top event properties:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error fetching top event properties: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);
		
		// Top event property values
		this.server.tool(
			"top_event_property_values",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				event: z.string().describe("The event that you wish to get data for. Note: this is a single event name, not an array"),
				name: z.string().describe("The name of the property you would like to get data for"),
				limit: z.number().optional().describe("The maximum number of values to return. Defaults to 255"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
			},
			async ({ username, password, project_id, event, name, limit = 255, workspace_id }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Construct parameters
					const queryParams = new URLSearchParams({
						project_id: project_id || '',
						event: event,
						name: name,
						limit: limit.toString()
					});
					
					if (workspace_id) queryParams.append('workspace_id', workspace_id);
					
					const url = `https://mixpanel.com/api/query/events/properties/values?${queryParams.toString()}`;
					
					const options = {
						method: 'GET',
						headers: {
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						}
					};
					
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error fetching top event property values:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error fetching top event property values: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);
		
		// Custom JQL
		this.server.tool(
			"custom_jql",
			{
				username: z.string().describe("The Mixpanel service account username"),
				password: z.string().describe("The Mixpanel service account password"),
				project_id: z.string().describe("The Mixpanel project ID"),
				script: z.string().describe("The JQL script to run (JavaScript code that uses Mixpanel's JQL functions)"),
				params: z.string().optional().describe("A JSON string containing parameters to pass to the script (will be available as the 'params' variable)"),
				workspace_id: z.string().optional().describe("The ID of the workspace if applicable"),
			},
			async ({ username, password, project_id, script, params, workspace_id }) => {
				try {
					const credentials = `${username}:${password}`;
					const encodedCredentials = Buffer.from(credentials).toString('base64');
					
					// Build request body
					const requestBody: Record<string, any> = {
						script: script
					};
					
					if (params) {
						try {
							// Add parsed params to request body
							requestBody.params = JSON.parse(params);
						} catch (e) {
							throw new Error(`Invalid JSON in params: ${e instanceof Error ? e.message : String(e)}`);
						}
					}
					
					// Build URL
					let url = `https://mixpanel.com/api/query/jql?project_id=${project_id || ''}`;
					if (workspace_id) {
						url += `&workspace_id=${workspace_id}`;
					}
					
					// Set up request options
					const options = {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'accept': 'application/json',
							'authorization': `Basic ${encodedCredentials}`
						},
						body: JSON.stringify(requestBody)
					};
					
					// Make the API request
					const response = await fetch(url, options);
					
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
					}
					
					const data = await response.json();
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data)
							}
						]
					};
				} catch (error) {
					console.error("Error executing custom JQL:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					return {
						content: [
							{
								type: "text",
								text: `Error executing custom JQL: ${errorMessage}`
							}
						],
						isError: true
					};
				}
			}
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
