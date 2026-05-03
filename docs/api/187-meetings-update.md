# meetings.update

> Source: https://developer.focus.teamleader.eu/docs/api/meetings-update

-   [](/)
-   [API Reference](/docs/api)
-   Calendar
-   [Meetings](/docs/api/meetings)
-   meetings.update

# meetings.update

POST 

## https://api.focus.teamleader.eu/meetings.update

Update a meeting.

## Request[​](#request "Direct link to Request")

-   application/json

### Body**required**

**id**stringrequired

**Example:** `00ed6266-a5bd-4aac-a292-2582017b6400`

**title**string

**Example:** `My meeting`

**starts\_at**string

**Example:** `2023-10-01T09:00:00+01:00`

**ends\_at**string

**Example:** `2023-10-01T10:00:00+01:00`

**description**stringnullable

**Example:** `My meeting description`

**attendees** object\[\]

when provided, at least one user attendee must be present

-   Array \[
    

**type**string

**Possible values:** \[`user`, `contact`\]

**Example:** `user`

**id**string

**Example:** `6ddd2666-65a0-497f-9f01-54c4343ec1a6`

-   \]
    

**customer** objectnullable

**type**stringrequired

**Possible values:** \[`contact`, `company`\]

**Example:** `contact`

**id**stringrequired

**Example:** `f29abf48-337d-44b4-aad4-585f5277a456`

**location** object

oneOf

-   With type string
-   With type & address
-   With type & address
-   With type & id

**type**stringrequired

**Example:** `virtual`

**type**stringrequired

**Possible values:** \[`contact`, `company`\]

**Example:** `contact`

**id**stringrequired

**Example:** `f29abf48-337d-44b4-aad4-585f5277a456`

**address** objectrequired

**line\_1**stringnullablerequired

**Example:** `Dok Noord 3A 101`

**postal\_code**stringnullablerequired

**Example:** `9000`

**city**stringnullablerequired

**Example:** `Ghent`

**country**stringrequired

**Example:** `BE`

**area\_level\_two\_id**string

**Example:** `db232cf8-ad4a-024b-941f-15a7a74f0fd2`

**type**stringrequired

**Example:** `address`

**address** objectrequired

**line\_1**stringnullablerequired

**Example:** `Dok Noord 3A 101`

**postal\_code**stringnullablerequired

**Example:** `9000`

**city**stringnullablerequired

**Example:** `Ghent`

**country**stringrequired

**Example:** `BE`

**area\_level\_two\_id**string

**Example:** `db232cf8-ad4a-024b-941f-15a7a74f0fd2`

**type**stringrequired

**Example:** `calendarResource`

**id**string

**Example:** `4191c526-5e26-0818-8e16-9523215b5081`

**project\_id**stringnullable

Mutually exclusive with `milestone_id`. Required when `group_id` is provided.

**Example:** `49b403be-a32e-0901-9b1c-25214f9027c6`

**group\_id**stringnullable

Requires `project_id`. The group must belong to the specified project.

**Example:** `0185968b-2c9e-73fd-9ce1-a12c0979783b`

**milestone\_id**stringnullable

Mutually exclusive with `project_id`.

**Example:** `32665afd-1818-0ed3-9e18-a603a3a21b95`

**deal\_id**stringnullable

**Example:** `32665afd-1818-0ed3-9e18-a603a3a21b95`

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
    

## Responses[​](#responses "Direct link to Responses")

-   204

**Response Headers**

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
var client = new HttpClient();var request = new HttpRequestMessage(HttpMethod.Post, "https://api.focus.teamleader.eu/meetings.update");request.Headers.Add("Authorization", "Bearer <token>");var content = new StringContent("{\n  \"id\": \"00ed6266-a5bd-4aac-a292-2582017b6400\",\n  \"title\": \"My meeting\",\n  \"starts_at\": \"2023-10-01T09:00:00+01:00\",\n  \"ends_at\": \"2023-10-01T10:00:00+01:00\",\n  \"description\": \"My meeting description\",\n  \"attendees\": [\n    {\n      \"type\": \"user\",\n      \"id\": \"6ddd2666-65a0-497f-9f01-54c4343ec1a6\"\n    }\n  ],\n  \"customer\": {\n    \"type\": \"contact\",\n    \"id\": \"f29abf48-337d-44b4-aad4-585f5277a456\"\n  },\n  \"location\": {\n    \"type\": \"virtual\"\n  },\n  \"project_id\": \"49b403be-a32e-0901-9b1c-25214f9027c6\",\n  \"group_id\": \"0185968b-2c9e-73fd-9ce1-a12c0979783b\",\n  \"milestone_id\": \"32665afd-1818-0ed3-9e18-a603a3a21b95\",\n  \"deal_id\": \"32665afd-1818-0ed3-9e18-a603a3a21b95\",\n  \"custom_fields\": [\n    {\n      \"id\": \"bf6765de-56eb-40ec-ad14-9096c5dc5fe1\",\n      \"value\": \"092980616\"\n    }\n  ]\n}", null, "application/json");request.Content = content;var response = await client.SendAsync(request);response.EnsureSuccessStatusCode();Console.WriteLine(await response.Content.ReadAsStringAsync());
```

Request Collapse all

Base URL

Edit

https://api.focus.teamleader.eu

Auth

Bearer Token

Body required

{
  "id": "00ed6266-a5bd-4aac-a292-2582017b6400",  "title": "My meeting",  "starts\_at": "2023-10-01T09:00:00+01:00",  "ends\_at": "2023-10-01T10:00:00+01:00",  "description": "My meeting description",  "attendees": \[    {      "type": "user",      "id": "6ddd2666-65a0-497f-9f01-54c4343ec1a6"    }  \],  "customer": {    "type": "contact",    "id": "f29abf48-337d-44b4-aad4-585f5277a456"  },  "location": {    "type": "virtual"  },  "project\_id": "49b403be-a32e-0901-9b1c-25214f9027c6",  "group\_id": "0185968b-2c9e-73fd-9ce1-a12c0979783b",  "milestone\_id": "32665afd-1818-0ed3-9e18-a603a3a21b95",  "deal\_id": "32665afd-1818-0ed3-9e18-a603a3a21b95",  "custom\_fields": \[    {      "id": "bf6765de-56eb-40ec-ad14-9096c5dc5fe1",      "value": "092980616"    }  \]
}
Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

[

Previous

meetings.schedule

](/docs/api/meetings-schedule)[

Next

meetings.complete

](/docs/api/meetings-complete)