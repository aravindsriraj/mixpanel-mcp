# Mixpanel MCP Tools - Sample Responses

This document provides example responses from various Mixpanel MCP tools to help you understand the expected data formats.

## Event Analytics Tools

### `get_today_top_events`

```json
{
  "legend_size": 5,
  "data": {
    "series": ["2023-09-20"],
    "values": {
      "page_view": {
        "2023-09-20": 12453
      },
      "button_click": {
        "2023-09-20": 8765
      },
      "login": {
        "2023-09-20": 3211
      },
      "search": {
        "2023-09-20": 2876
      },
      "purchase": {
        "2023-09-20": 954
      }
    }
  }
}
```

### `get_top_events`

```json
[
  "page_view",
  "button_click",
  "login",
  "search",
  "purchase",
  "sign_up",
  "add_to_cart",
  "checkout",
  "share",
  "play_video"
]
```

### `aggregate_event_counts`

```json
{
  "legend_size": 2,
  "data": {
    "series": [
      "2023-06-01",
      "2023-06-02",
      "2023-06-03",
      "2023-06-04"
    ],
    "values": {
      "purchase": {
        "2023-06-01": 87,
        "2023-06-02": 92,
        "2023-06-03": 76,
        "2023-06-04": 105
      },
      "add_to_cart": {
        "2023-06-01": 342,
        "2023-06-02": 315,
        "2023-06-03": 298,
        "2023-06-04": 387
      }
    }
  }
}
```

## User/Profile Tools

### `profile_event_activity`

```json
{
  "session_id": "1234abcd5678efgh",
  "results": [
    {
      "distinct_id": "user-123456",
      "events": [
        {
          "event": "page_view",
          "properties": {
            "time": 1687334400000,
            "distinct_id": "user-123456",
            "$browser": "Chrome",
            "$os": "Mac OS X",
            "page_name": "Home"
          }
        },
        {
          "event": "button_click",
          "properties": {
            "time": 1687334460000,
            "distinct_id": "user-123456",
            "button_name": "Get Started",
            "page_name": "Home"
          }
        }
      ]
    }
  ]
}
```

### `query_profiles`

```json
{
  "session_id": "5678abcd1234efgh",
  "page": 0,
  "page_size": 2,
  "total": 2,
  "results": [
    {
      "distinct_id": "user-123456",
      "$properties": {
        "$email": "user@example.com",
        "$name": "John Smith",
        "total_purchases": 7,
        "account_type": "premium",
        "last_seen": "2023-06-21T14:32:15"
      }
    },
    {
      "distinct_id": "user-789012",
      "$properties": {
        "$email": "another@example.com",
        "$name": "Jane Doe",
        "total_purchases": 12,
        "account_type": "premium",
        "last_seen": "2023-06-22T09:17:42"
      }
    }
  ]
}
```

## Report Tools

### `query_insights_report`

```json
{
  "session_id": "abcd1234efgh5678",
  "name": "Monthly Active Users",
  "type": "line",
  "results": [
    {
      "count": 45678,
      "date": "2023-06-01"
    },
    {
      "count": 46123,
      "date": "2023-06-02"
    },
    {
      "count": 47890,
      "date": "2023-06-03"
    }
  ]
}
```

### `query_funnel_report`

```json
{
  "meta": {
    "dates": [
      "2023-06-01",
      "2023-06-30"
    ]
  },
  "data": {
    "steps": [
      "View Product",
      "Add to Cart",
      "Checkout",
      "Purchase"
    ],
    "analysis": [
      {
        "completion": 23.5,
        "starting_amount": 10000,
        "steps": [
          {"count": 10000, "step_conv_ratio": 100},
          {"count": 4500, "step_conv_ratio": 45.0},
          {"count": 3200, "step_conv_ratio": 71.1},
          {"count": 2350, "step_conv_ratio": 73.4}
        ],
        "date": "2023-06-01 - 2023-06-30"
      }
    ]
  }
}
```

### `query_retention_report`

```json
{
  "cohorts": [
    {
      "date": "2023-06-01",
      "size": 1250,
      "retention": [100, 45.2, 32.8, 28.1, 25.6, 22.4, 20.9]
    },
    {
      "date": "2023-06-02",
      "size": 980,
      "retention": [100, 42.8, 34.5, 29.3, 26.8, 23.5, 21.2]
    }
  ],
  "cohort_sizes": [1250, 980],
  "dates": ["2023-06-01", "2023-06-02"],
  "stats": {
    "avg_retention": [100, 44.0, 33.7, 28.7, 26.2, 23.0, 21.1]
  }
}
```

### `query_segmentation_report`

```json
{
  "legend_size": 3,
  "data": {
    "series": [
      "2023-06-01",
      "2023-06-02",
      "2023-06-03",
      "2023-06-04"
    ],
    "values": {
      "United States": {
        "2023-06-01": 4872,
        "2023-06-02": 5123,
        "2023-06-03": 4921,
        "2023-06-04": 5032
      },
      "United Kingdom": {
        "2023-06-01": 1872,
        "2023-06-02": 1923,
        "2023-06-03": 2021,
        "2023-06-04": 1945
      },
      "Germany": {
        "2023-06-01": 1245,
        "2023-06-02": 1356,
        "2023-06-03": 1298,
        "2023-06-04": 1322
      }
    }
  }
}
```

### `query_frequency_report`

```json
{
  "data": {
    "series": ["0", "1", "2", "3-5", "6-10", "11+"],
    "values": {
      "Week of Jun 1": {
        "0": 45821,
        "1": 15432,
        "2": 8763,
        "3-5": 6543,
        "6-10": 3211,
        "11+": 1987
      },
      "Week of Jun 8": {
        "0": 44532,
        "1": 16321,
        "2": 9012,
        "3-5": 6732,
        "6-10": 3421,
        "11+": 2109
      }
    }
  }
}
```

## Reference Tools

### `list_saved_cohorts`

```json
[
  {
    "id": 12345,
    "name": "High Value Customers",
    "description": "Users with 5+ purchases"
  },
  {
    "id": 12346,
    "name": "New Users Last 30 Days",
    "description": "Users who signed up in the last month"
  },
  {
    "id": 12347,
    "name": "Dormant Users",
    "description": "Users inactive for 60+ days"
  }
]
```

### `list_saved_funnels`

```json
[
  {
    "id": "23456",
    "name": "Purchase Funnel",
    "description": "Main conversion path to purchase"
  },
  {
    "id": "23457",
    "name": "Signup Flow",
    "description": "User registration process"
  },
  {
    "id": "23458",
    "name": "Content Engagement",
    "description": "Blog content engagement flow"
  }
]
```

### `top_event_properties`

```json
[
  "$browser",
  "$os",
  "$country",
  "$city",
  "page_name",
  "user_type",
  "referrer",
  "screen_size",
  "utm_source",
  "utm_medium"
]
```

### `top_event_property_values`

```json
{
  "$browser": {
    "Chrome": 45.2,
    "Safari": 28.7,
    "Firefox": 12.5,
    "Edge": 10.1,
    "Other": 3.5
  }
}
```

### `custom_jql`

```json
[
  {
    "user_type": "new",
    "count": 1245
  },
  {
    "user_type": "returning",
    "count": 3567
  },
  {
    "user_type": "lapsed",
    "count": 892
  }
]
```

## Note on Response Formatting

The above examples are simplified for clarity. Actual responses may contain additional metadata and fields. The MCP tools return these JSON responses wrapped in a content object:

```json
{
  "content": [
    {
      "type": "text",
      "text": "THE_JSON_RESPONSE_AS_STRING"
    }
  ]
}
```

In case of errors, the response will include an `isError` field:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error fetching Mixpanel events: HTTP error! status: 401 - Unauthorized"
    }
  ],
  "isError": true
}
```
