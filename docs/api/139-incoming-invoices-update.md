# incomingInvoices.update

> Source: https://developer.focus.teamleader.eu/docs/api/incoming-invoices-update

-   [](/)
-   [API Reference](/docs/api)
-   Expenses
-   [Incoming Invoices](/docs/api/incoming-invoices)
-   incomingInvoices.update

# incomingInvoices.update

POST 

## https://api.focus.teamleader.eu/incomingInvoices.update

Updates an incoming invoice.

## Request[​](#request "Direct link to Request")

-   application/json

### Body

**id**stringrequired

**title**string

**supplier\_id**stringnullable

**document\_number**stringnullable

**invoice\_date**stringnullable

**due\_date**stringnullable

**currency** object

**code**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**Example:** `EUR`

**total** object

**tax\_exclusive** objectnullable

**amount**numberrequired

**tax\_inclusive** objectnullable

**amount**numberrequired

**company\_entity\_id**string

**file\_id**stringnullable

**payment\_reference**stringnullable

**iban\_number**stringnullable

## Responses[​](#responses "Direct link to Responses")

-   204

No Content

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
var client = new HttpClient();var request = new HttpRequestMessage(HttpMethod.Post, "https://api.focus.teamleader.eu/incomingInvoices.update");request.Headers.Add("Authorization", "Bearer <token>");var content = new StringContent("{\n  \"id\": \"string\",\n  \"title\": \"string\",\n  \"supplier_id\": \"string\",\n  \"document_number\": \"string\",\n  \"invoice_date\": \"string\",\n  \"due_date\": \"string\",\n  \"currency\": {\n    \"code\": \"EUR\"\n  },\n  \"total\": {\n    \"tax_exclusive\": {\n      \"amount\": 0\n    },\n    \"tax_inclusive\": {\n      \"amount\": 0\n    }\n  },\n  \"company_entity_id\": \"string\",\n  \"file_id\": \"string\",\n  \"payment_reference\": \"string\",\n  \"iban_number\": \"string\"\n}", null, "application/json");request.Content = content;var response = await client.SendAsync(request);response.EnsureSuccessStatusCode();Console.WriteLine(await response.Content.ReadAsStringAsync());
```

Request Collapse all

Base URL

Edit

https://api.focus.teamleader.eu

Auth

Bearer Token

Body

-   Example (from schema)
-   Example

{
  "id": "string",  "title": "string",  "supplier\_id": "string",  "document\_number": "string",  "invoice\_date": "string",  "due\_date": "string",  "currency": {    "code": "EUR"  },  "total": {    "tax\_exclusive": {      "amount": 0    },    "tax\_inclusive": {      "amount": 0    }  },  "company\_entity\_id": "string",  "file\_id": "string",  "payment\_reference": "string",  "iban\_number": "string"
}
Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

[

Previous

incomingInvoices.sendToBookkeeping

](/docs/api/incoming-invoices-send-to-bookkeeping)[

Next

incomingInvoices.updatePayment

](/docs/api/incoming-invoices-update-payment)