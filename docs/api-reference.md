# Mixpanel MCP Tools - API Documentation

This document provides detailed information about the Mixpanel API tools available in this MCP server.

## Authentication

All tools require the following authentication parameters:

| Parameter | Description |
|-----------|-------------|
| `username` | Your Mixpanel service account username |
| `password` | Your Mixpanel service account password |
| `project_id` | Your Mixpanel project ID |

## Event Analytics Tools

### `get_today_top_events`

Get the top events for today.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `type` | string | No | "general" | Type of events: "general", "average", or "unique" |
| `limit` | number | No | 10 | Maximum number of events to return |

### `get_top_events`

Get the top events for a project.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `type` | string | No | "general" | Type of events: "general", "average", or "unique" |
| `limit` | number | No | 10 | Maximum number of events to return |

### `aggregate_event_counts`

Get aggregate event counts.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `event` | string | Yes | - | The event or events to get data for (JSON array as string) |
| `type` | string | No | "general" | Analysis type: "general", "unique", or "average" |
| `unit` | string | Yes | - | Granularity level: "minute", "hour", "day", "week", or "month" |
| `interval` | number | * | - | Number of units to return data for |
| `from_date` | string | * | - | Start date in yyyy-mm-dd format |
| `to_date` | string | * | - | End date in yyyy-mm-dd format |

*Note: Must specify either `interval` or both `from_date` and `to_date`.

### `aggregated_event_property_values`

Get aggregated property values for events.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `from_date` | string | * | - | Start date in yyyy-mm-dd format |
| `to_date` | string | * | - | End date in yyyy-mm-dd format |
| `interval` | number | * | - | Number of units to return data for |
| `event` | string | Yes | - | Event name to query |
| `name` | string | Yes | - | Property name to get values for |
| `values` | string | No | - | Specific property values as JSON array string |
| `type` | string | No | "general" | Analysis type: "general", "unique", or "average" |
| `unit` | string | Yes | - | Granularity level: "minute", "hour", "day", "week", or "month" |
| `limit` | number | No | 255 | Maximum number of values to return |

*Note: Must specify either `interval` or both `from_date` and `to_date`.

## User/Profile Tools

### `profile_event_activity`

Get profile event activity for specific users.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `workspace_id` | string | No | - | ID of the workspace if applicable |
| `distinct_ids` | string | Yes | - | User IDs as JSON array string |
| `from_date` | string | Yes | - | Start date in yyyy-mm-dd format |
| `to_date` | string | Yes | - | End date in yyyy-mm-dd format |

### `query_profiles`

Query user profiles based on various criteria.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `workspace_id` | string | No | - | ID of the workspace if applicable |
| `where` | string | No | - | Expression to filter users |
| `output_properties` | string | No | - | Properties to return, as JSON array string |
| `filter_by_cohort` | string | No | - | Cohort ID to filter by |
| `include_all_users` | boolean | No | true | Only used with `filter_by_cohort` |
| `distinct_ids` | string | No | - | Multiple user IDs as JSON array string |
| `distinct_id` | string | No | - | Single user ID |
| `session_id` | string | No | - | Session ID from previous query results |
| `page` | number | No | - | Page number (requires `session_id`) |
| `data_group_id` | string | No | - | Group key ID for group profiles |
| `behaviors` | number | No | - | For exporting profiles with event selectors |
| `as_of_timestamp` | number | No | - | Only used with `behaviors` |

## Report Tools

### `query_insights_report`

Fetch an Insights report by ID.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `workspace_id` | string | No | - | ID of the workspace if applicable |
| `bookmark_id` | string | Yes | - | ID of the Insights report |

### `query_funnel_report`

Get funnel analysis data.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `workspace_id` | string | No | - | ID of the workspace if applicable |
| `funnel_id` | string | Yes | - | Mixpanel funnel ID |
| `from_date` | string | Yes | - | Start date in yyyy-mm-dd format |
| `to_date` | string | Yes | - | End date in yyyy-mm-dd format |
| `length` | number | No | - | Number of units to complete funnel |
| `length_unit` | string | No | - | Unit for length: "day", "hour", "minute", "second" |
| `interval` | number | No | - | Days per bucket |
| `unit` | string | No | - | Alternative for interval: "day", "week", "month" |

### `query_retention_report`

Get retention analysis data.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `from_date` | string | Yes | - | Start date in yyyy-mm-dd format |
| `to_date` | string | Yes | - | End date in yyyy-mm-dd format |
| `retention_type` | string | No | "birth" | Type: "birth" or "compounded" |
| `born_event` | string | * | - | First event for birth retention cohort |
| `event` | string | No | - | Event for returning counts |
| `born_where` | string | No | - | Expression to filter born_events |
| `return_where` | string | No | - | Expression to filter return events |
| `interval` | number | ** | - | Number of individual buckets |
| `interval_count` | number | No | 1 | Number of buckets to return |
| `unit` | string | ** | "day" | Interval unit: "day", "week", or "month" |
| `on` | string | No | - | Property to segment by |
| `limit` | number | No | - | Limit for segmentation values |
| `workspace_id` | string | No | - | ID of the workspace if applicable |

*Note: Required if `retention_type` is "birth"
**Note: Don't use both `interval` and `unit` together

### `query_frequency_report`

Get user engagement frequency data.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `from_date` | string | Yes | - | Start date in yyyy-mm-dd format |
| `to_date` | string | Yes | - | End date in yyyy-mm-dd format |
| `unit` | string | Yes | - | Overall period: "day", "week", or "month" |
| `addiction_unit` | string | Yes | - | Granularity: "hour" or "day" |
| `where` | string | Yes | - | Expression to filter events |
| `event` | string | No | - | Event name to query |
| `on` | string | No | - | Property to segment by |
| `limit` | number | No | - | Limit for segmentation values |
| `workspace_id` | string | No | - | ID of the workspace if applicable |

### Segmentation Tools

#### `query_segmentation_report`

Get segmentation analysis.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `event` | string | Yes | - | Event name to query |
| `from_date` | string | Yes | - | Start date in yyyy-mm-dd format |
| `to_date` | string | Yes | - | End date in yyyy-mm-dd format |
| `where` | string | Yes | - | Expression to filter events |
| `unit` | string | No | "day" | Bucket size: "minute", "hour", "day", "month" |
| `interval` | number | No | - | Days per bucket |
| `type` | string | No | "general" | Analysis type: "general", "unique", "average" |
| `limit` | number | No | 60 | Max property values |
| `on` | string | No | - | Property to segment by |
| `format` | string | No | - | Output format, can be "csv" |
| `workspace_id` | string | No | - | ID of the workspace if applicable |

#### `query_segmentation_average`

Get average values in a segmentation.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `event` | string | Yes | - | Event name to query |
| `from_date` | string | Yes | - | Start date in yyyy-mm-dd format |
| `to_date` | string | Yes | - | End date in yyyy-mm-dd format |
| `on` | string | Yes | - | Expression to average per unit time |
| `unit` | string | No | "day" | Bucket size: "hour" or "day" |
| `where` | string | No | - | Expression to filter events |
| `workspace_id` | string | No | - | ID of the workspace if applicable |

#### `query_segmentation_sum`

Get sum values in a segmentation.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `event` | string | Yes | - | Event name to query |
| `from_date` | string | Yes | - | Start date in yyyy-mm-dd format |
| `to_date` | string | Yes | - | End date in yyyy-mm-dd format |
| `on` | string | Yes | - | Expression to sum per unit time |
| `unit` | string | No | "day" | Bucket size: "hour" or "day" |
| `where` | string | No | - | Expression to filter events |
| `workspace_id` | string | No | - | ID of the workspace if applicable |

#### `query_segmentation_bucket`

Get numeric property buckets in a segmentation.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `event` | string | Yes | - | Event name to query |
| `from_date` | string | Yes | - | Start date in yyyy-mm-dd format |
| `to_date` | string | Yes | - | End date in yyyy-mm-dd format |
| `on` | string | Yes | - | Numeric property to segment by |
| `where` | string | Yes | - | Expression to filter events |
| `unit` | string | No | "day" | Bucket size: "hour" or "day" |
| `type` | string | No | "general" | Analysis type: "general", "unique", "average" |
| `workspace_id` | string | No | - | ID of the workspace if applicable |

## Reference Tools

### `list_saved_cohorts`

List all saved cohorts.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `workspace_id` | string | No | - | ID of the workspace if applicable |

### `list_saved_funnels`

List all saved funnels.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `workspace_id` | string | No | - | ID of the workspace if applicable |

### `top_event_properties`

Get top properties for an event.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `event` | string | Yes | - | Event name to query |
| `limit` | number | No | 10 | Maximum number of properties |
| `workspace_id` | string | No | - | ID of the workspace if applicable |

### `top_event_property_values`

Get top values for a specific event property.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `event` | string | Yes | - | Event name to query |
| `name` | string | Yes | - | Property name to get values for |
| `limit` | number | No | 255 | Maximum number of values |
| `workspace_id` | string | No | - | ID of the workspace if applicable |

### `custom_jql`

Run custom JQL queries.

#### Parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | string | Yes | - | Mixpanel service account username |
| `password` | string | Yes | - | Mixpanel service account password |
| `project_id` | string | Yes | - | Mixpanel project ID |
| `script` | string | Yes | - | JQL script to run |
| `params` | string | No | - | Parameters to pass to the script as JSON string |
| `workspace_id` | string | No | - | ID of the workspace if applicable |
