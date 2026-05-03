# invoices.creditPartially

> Source: https://developer.focus.teamleader.eu/docs/api/invoices-credit-partially

-   [](/)
-   [API Reference](/docs/api)
-   Invoicing
-   [Invoices](/docs/api/invoices)
-   invoices.creditPartially

# invoices.creditPartially

POST 

## https://api.focus.teamleader.eu/invoices.creditPartially

Credit an invoice partially.

## Request[​](#request "Direct link to Request")

-   application/json

### Body**required**

**id**stringrequired

**Example:** `d885e5d5-bacb-4607-bde9-abc4a04a901b`

**credit\_note\_date**string

**Example:** `2016-02-04`

**grouped\_lines** object\[\]required

-   Array \[
    

**section** object

**title**stringrequired

**line\_items** object\[\]required

-   Array \[
    

**quantity**numberrequired

**Example:** `3`

**description**stringrequired

**Example:** `An awesome product`

**extended\_description**stringnullable

Uses Markdown formatting

**Example:** `Some more information about this awesome product`

**unit\_of\_measure\_id**stringnullable

**Example:** `f79d3e04-b8dc-0637-8f18-ca7c8fc63b71`

**unit\_price** object

**amount**numberrequired

**Example:** `123.3`

**tax**stringrequired

**Possible values:** \[`excluding`\]

**Example:** `excluding`

**tax\_rate\_id**stringrequired

**Example:** `c0c03f1e-77e3-402c-a713-30ea1c585823`

**discount** object

**value**numberrequired

**Example:** `10`

**type**stringrequired

Values between 0 and 100

**Possible values:** \[`percentage`\]

**Example:** `percentage`

**product\_id**string

**Example:** `d905ff57-e866-0f59-9d1e-1fd4538bfae1`

**withholding\_tax\_rate\_id**string

**Example:** `c0c03f1e-77e3-402c-a713-30ea1c585824`

**product\_category\_id**string

**Example:** `e2314517-3cab-4aa9-8471-450e73449041`

-   \]
    

-   \]
    

**discounts** object\[\]

-   Array \[
    

**type**string

Values between 0 and 100

**Possible values:** \[`percentage`\]

**Example:** `percentage`

**value**number

**Example:** `15.5`

**description**string

**Example:** `winter promotion`

-   \]
    

## Responses[​](#responses "Direct link to Responses")

-   201

**Response Headers**

-   application/json

-   Schema
-   Example (auto)
-   Example

**Schema**

**data** object

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

```
{  "data": {    "type": "creditNote",    "id": "d885e5d5-bacb-4607-bde9-abc4a04a901c"  }}
```

```
{  "data": {    "type": "creditNote",    "id": "d885e5d5-bacb-4607-bde9-abc4a04a901c"  }}
```

#### Authorization: http

**name:** [httpBearer](/docs/api/teamleader-api#authentication)**type:** http**scheme:** bearer

-   csharp
-   curl
-   dart
-   go
-   http
-   java
-   javascript
-   kotlin
-   c
-   nodejs
-   objective-c
-   ocaml
-   php
-   powershell
-   python
-   r
-   ruby
-   rust
-   shell
-   swift

-   HTTPCLIENT
-   RESTSHARP

```
var client = new HttpClient();var request = new HttpRequestMessage(HttpMethod.Post, "https://api.focus.teamleader.eu/invoices.creditPartially");request.Headers.Add("Accept", "application/json");request.Headers.Add("Authorization", "Bearer <token>");var content = new StringContent("{\n  \"id\": \"d885e5d5-bacb-4607-bde9-abc4a04a901b\",\n  \"credit_note_date\": \"2016-02-04\",\n  \"grouped_lines\": [\n    {\n      \"section\": {\n        \"title\": \"\"\n      },\n      \"line_items\": [\n        {\n          \"quantity\": 3,\n          \"description\": \"An awesome product\",\n          \"extended_description\": \"Some more information about this awesome product\",\n          \"unit_of_measure_id\": \"f79d3e04-b8dc-0637-8f18-ca7c8fc63b71\",\n          \"unit_price\": {\n            \"amount\": 123.3,\n            \"tax\": \"excluding\"\n          },\n          \"tax_rate_id\": \"c0c03f1e-77e3-402c-a713-30ea1c585823\",\n          \"withholding_tax_rate_id\": \"c0c03f1e-77e3-402c-a713-30ea1c585824\",\n          \"discount\": {\n            \"value\": 10,\n            \"type\": \"percentage\"\n          },\n          \"product_category_id\": \"e2314517-3cab-4aa9-8471-450e73449041\",\n          \"product_id\": \"d905ff57-e866-0f59-9d1e-1fd4538bfae1\"\n        }\n      ]\n    }\n  ],\n  \"discounts\": [\n    {\n      \"type\": \"percentage\",\n      \"value\": 15.5,\n      \"description\": \"winter promotion\"\n    }\n  ]\n}", null, "application/json");request.Content = content;var response = await client.SendAsync(request);response.EnsureSuccessStatusCode();Console.WriteLine(await response.Content.ReadAsStringAsync());
```

Request Collapse all

Base URL

Edit

https://api.focus.teamleader.eu

Auth

Bearer Token

Body required

-   Example (from schema)
-   Example

{
  "id": "d885e5d5-bacb-4607-bde9-abc4a04a901b",  "credit\_note\_date": "2016-02-04",  "grouped\_lines": \[    {      "section": {        "title": ""      },      "line\_items": \[        {          "quantity": 3,          "description": "An awesome product",          "extended\_description": "Some more information about this awesome product",          "unit\_of\_measure\_id": "f79d3e04-b8dc-0637-8f18-ca7c8fc63b71",          "unit\_price": {            "amount": 123.3,            "tax": "excluding"          },          "tax\_rate\_id": "c0c03f1e-77e3-402c-a713-30ea1c585823",          "withholding\_tax\_rate\_id": "c0c03f1e-77e3-402c-a713-30ea1c585824",          "discount": {            "value": 10,            "type": "percentage"          },          "product\_category\_id": "e2314517-3cab-4aa9-8471-450e73449041",          "product\_id": "d905ff57-e866-0f59-9d1e-1fd4538bfae1"        }      \]    }  \],  "discounts": \[    {      "type": "percentage",      "value": 15.5,      "description": "winter promotion"    }  \]
}
Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

[

Previous

invoices.credit

](/docs/api/invoices-credit)[

Next

invoices.send

](/docs/api/invoices-send)