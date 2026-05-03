# deals.create

> Source: https://developer.focus.teamleader.eu/docs/api/deals-create

-   [](/)
-   [API Reference](/docs/api)
-   Deals
-   [Deals](/docs/api/deals)
-   deals.create

# deals.create

POST 

## https://api.focus.teamleader.eu/deals.create

Create a new deal for a customer.

## Request[​](#request "Direct link to Request")

-   application/json

### Body**required**

**lead** objectrequired

**customer** objectrequired

**type**stringrequired

**Possible values:** \[`contact`, `company`\]

**Example:** `contact`

**id**stringrequired

**Example:** `f29abf48-337d-44b4-aad4-585f5277a456`

**contact\_person\_id**string

**Example:** `b38ebb9b-6e46-4bf4-a1e2-af747d6b64ae`

**title**stringrequired

**Example:** `Interesting business deal`

**summary**string

**Example:** `Additional information`

**source\_id**string

**Example:** `b38ebb9b-6e46-4bf4-a1e2-af747d6b64ae`

**department\_id**string

**Example:** `6a6343fc-fdd8-4bc0-aa69-3a004c710e87`

**responsible\_user\_id**string

**Example:** `98b2863e-7b01-4232-82f5-ede1f0b9db22`

**phase\_id**string

**Example:** `060687bb-a742-4882-a538-199a5e5feb60`

**estimated\_value** objectnullable

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**estimated\_probability**number

A number between 0 and 1 (inclusive)

**Example:** `0.75`

**estimated\_closing\_date**string

**Example:** `2017-05-09`

**custom\_fields** object\[\]

-   Array \[
    

**id**string

**Example:** `bf6765de-56eb-40ec-ad14-9096c5dc5fe1`

**value** object

oneOf

-   string
-   number
-   multiple selection
-   boolean
-   object

string

For strings

**Example:** `092980616`

number

For integer, number, money and auto-increment fields

**Example:** `123`

-   Array \[
    

string

-   \]
    

boolean

For Yes/No fields

**Example:** `true`

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

**Possible values:** \[`company`, `contact`, `product`, `user`\]

**Example:** `company`

-   \]
    

**currency** object

**code**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**exchange\_rate**numberrequired

**Example:** `1.1238`

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
{  "data": {    "type": "deal",    "id": "65a35860-dcca-4850-9fd6-47ff08469e0c"  }}
```

```
{  "data": {    "type": "deal",    "id": "65a35860-dcca-4850-9fd6-47ff08469e0c"  }}
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
var client = new HttpClient();var request = new HttpRequestMessage(HttpMethod.Post, "https://api.focus.teamleader.eu/deals.create");request.Headers.Add("Accept", "application/json");request.Headers.Add("Authorization", "Bearer <token>");var content = new StringContent("{\n  \"lead\": {\n    \"customer\": {\n      \"type\": \"company\",\n      \"id\": \"09e5d75f-f817-4872-9723-57fbb8ff710d\"\n    },\n    \"contact_person_id\": \"b38ebb9b-6e46-4bf4-a1e2-af747d6b64ae\"\n  },\n  \"title\": \"Interesting business deal\",\n  \"summary\": \"Additional information\",\n  \"source_id\": \"b38ebb9b-6e46-4bf4-a1e2-af747d6b64ae\",\n  \"department_id\": \"6a6343fc-fdd8-4bc0-aa69-3a004c710e87\",\n  \"responsible_user_id\": \"98b2863e-7b01-4232-82f5-ede1f0b9db22\",\n  \"phase_id\": \"060687bb-a742-4882-a538-199a5e5feb60\",\n  \"estimated_value\": {\n    \"amount\": 123.3,\n    \"currency\": \"EUR\"\n  },\n  \"estimated_probability\": 0.75,\n  \"estimated_closing_date\": \"2017-05-09\",\n  \"custom_fields\": [\n    {\n      \"id\": \"bf6765de-56eb-40ec-ad14-9096c5dc5fe1\",\n      \"value\": \"092980616\"\n    }\n  ],\n  \"currency\": {\n    \"code\": \"EUR\",\n    \"exchange_rate\": 1.1238\n  }\n}", null, "application/json");request.Content = content;var response = await client.SendAsync(request);response.EnsureSuccessStatusCode();Console.WriteLine(await response.Content.ReadAsStringAsync());
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
  "lead": {    "customer": {      "type": "company",      "id": "09e5d75f-f817-4872-9723-57fbb8ff710d"    },    "contact\_person\_id": "b38ebb9b-6e46-4bf4-a1e2-af747d6b64ae"  },  "title": "Interesting business deal",  "summary": "Additional information",  "source\_id": "b38ebb9b-6e46-4bf4-a1e2-af747d6b64ae",  "department\_id": "6a6343fc-fdd8-4bc0-aa69-3a004c710e87",  "responsible\_user\_id": "98b2863e-7b01-4232-82f5-ede1f0b9db22",  "phase\_id": "060687bb-a742-4882-a538-199a5e5feb60",  "estimated\_value": {    "amount": 123.3,    "currency": "EUR"  },  "estimated\_probability": 0.75,  "estimated\_closing\_date": "2017-05-09",  "custom\_fields": \[    {      "id": "bf6765de-56eb-40ec-ad14-9096c5dc5fe1",      "value": "092980616"    }  \],  "currency": {    "code": "EUR",    "exchange\_rate": 1.1238  }
}
Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

[

Previous

deals.info

](/docs/api/deals-info)[

Next

deals.update

](/docs/api/deals-update)