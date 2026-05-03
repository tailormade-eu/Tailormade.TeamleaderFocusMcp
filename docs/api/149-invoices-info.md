# invoices.info

> Source: https://developer.focus.teamleader.eu/docs/api/invoices-info

-   [](/)
-   [API Reference](/docs/api)
-   Invoicing
-   [Invoices](/docs/api/invoices)
-   invoices.info

# invoices.info

POST 

## https://api.focus.teamleader.eu/invoices.info

Get details for a single invoice.

## Request[​](#request "Direct link to Request")

-   application/json

### Body**required**

**id**string

**Example:** `27300f09-6250-4a23-8557-d84c52f99ecf`

**includes**string

when used, the response will include `totals.due_incasso_inclusive`, `totals.fixed_late_fee` and `totals.interest`

**Example:** `late_fees`

## Responses[​](#responses "Direct link to Responses")

-   200

**Response Headers**

-   application/json

-   Schema
-   Example (auto)

**Schema**

**data** object

**id**string

**Example:** `e540fe7e-dce2-459e-bf7e-24e605fc18b3`

**department** object

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

**invoice\_number**stringnullable

**Example:** `2017 / 5`

**invoice\_date**stringnullable

**Example:** `2016-02-04`

**status**string

**Possible values:** \[`draft`, `outstanding`, `matched`\]

**Example:** `matched`

**due\_on**stringnullable

**Example:** `2016-03-03`

**paid**boolean

**Example:** `true`

**paid\_at**stringnullable

**Example:** `2016-02-04T16:44:33+00:00`

**sent**boolean

**Example:** `true`

**purchase\_order\_number**stringnullable

**Example:** `000023`

**invoicee** object

**name**string

**Example:** `De Rode Duivels`

**vat\_number**stringnullable

**Example:** `BE0899623035`

**customer** object

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

**for\_attention\_of** objectnullable

**name**stringnullable

**Example:** `Radja Nainggolan`

**contact** objectnullable

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

**email**stringnullable

**Example:** `duivels@test.com`

**national\_identification\_number**stringnullable

**Example:** `123`

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
    

**grouped\_lines** object\[\]

-   Array \[
    

**section** object

**title**string

**line\_items** object\[\]

-   Array \[
    

**product** objectnullable

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

**quantity**number

**Example:** `3`

**description**string

**Example:** `An awesome product`

**extended\_description**stringnullable

Uses Markdown formatting

**Example:** `Some more information about this awesome product`

**unit** objectnullable

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

**unit\_price** object

**amount**numberrequired

**Example:** `123.3`

**tax**stringrequired

**Possible values:** \[`excluding`\]

**Example:** `excluding`

**tax** object

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

**discount** objectnullable

**value**number

**Example:** `10`

**type**string

Values between 0 and 100

**Possible values:** \[`percentage`\]

**Example:** `percentage`

**total** object

**tax\_exclusive** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**tax\_exclusive\_before\_discount** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**tax\_inclusive** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**tax\_inclusive\_before\_discount** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**product\_category** objectnullable

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

**withheld\_tax** objectnullable

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

-   \]
    

-   \]
    

**total** object

**tax\_exclusive** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**tax\_exclusive\_before\_discount** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**tax\_inclusive** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**tax\_inclusive\_before\_discount** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**taxes** object\[\]

-   Array \[
    

**rate**number

**Example:** `0.21`

**taxable** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**tax** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

-   \]
    

**withheld\_taxes** object\[\]

-   Array \[
    

**id**string

**Example:** `e2314517-3cab-4aa9-8471-450e73449040`

**taxable** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**withheld** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

-   \]
    

**payable** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**due** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**due\_incasso\_inclusive** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**fixed\_late\_fee** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**interest** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**payment\_term** object

**type**string

**Possible values:** \[`cash`, `end_of_month`, `after_invoice_date`\]

**days**number

Modifier "X" for the above statements. Not required when type is 'cash'.

**payments** object\[\]

-   Array \[
    

**paid\_at**string

**Example:** `2016-03-03T16:44:33+00:00`

**payment** object

**amount**numberrequired

**Example:** `123.3`

**currency**CurrencyCode (string)required

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

-   \]
    

**payment\_reference**stringnullable

**Example:** `+++084/2613/66074+++`

**note**stringnullable

plaintext

**Example:** `'Some extra remarks about the invoice'`

**currency**string

**Example:** `USD`

**currency\_exchange\_rate** object

**from**CurrencyCode (string)

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**Example:** `USD`

**to**CurrencyCode (string)

**Possible values:** \[`BAM`, `CAD`, `CHF`, `CLP`, `CNY`, `COP`, `CZK`, `DKK`, `EUR`, `GBP`, `INR`, `ISK`, `JPY`, `MAD`, `MXN`, `NOK`, `PEN`, `PLN`, `RON`, `SEK`, `TRY`, `USD`, `ZAR`\]

**Example:** `EUR`

**rate**number

**Example:** `1.1234`

**expected\_payment\_method** objectnullable

oneOf

-   With method & reference
-   With method only

**method**string

**Possible values:** \[`sepa_direct_debit`, `direct_debit`, `credit_card`\]

**Example:** `sepa_direct_debit`

**reference**stringnullable

**Example:** `AB1234`

**method**string

**Possible values:** \[`cash`, `cheque`, `bankers_draft`, `bank_transfer`, `payment_card`\]

**Example:** `cash`

**file** objectnullable

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

**deal** objectnullable

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

**project** objectnullable

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

**on\_hold\_since**stringnullable

**Example:** `2016-02-01`

**custom\_fields** object\[\]

-   Array \[
    

**definition** object

**type**string

**Example:** `customFieldDefinition`

**id**string

**Example:** `bf6765de-56eb-40ec-ad14-9096c5dc5fe1`

**value** object

oneOf

-   string
-   numbers
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

For multiple selection fields

**Example:** `foo`

-   \]
    

boolean

For Yes/No fields

**Example:** `true`

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

For related Teamleader objects

**Possible values:** \[`company`, `contact`, `product`, `user`\]

**Example:** `company`

-   \]
    

**created\_at**string

**Example:** `2016-02-04T16:44:33+00:00`

**updated\_at**string

**Example:** `2016-02-05T16:44:33+00:00`

**document\_template** object

**id**string

**Example:** `eab232c6-49b2-4b7e-a977-5e1148dad471`

**type**string

**delivery\_date**stringnullable

**Example:** `2025-12-08`

**peppol\_status**PeppolStatus (string)nullable

**Possible values:** \[`sending`, `sending_failed`, `sent`, `application_acknowledged`, `application_accepted`, `application_rejected`, `receiver_acknowledged`, `receiver_accepted`, `receiver_rejected`, `receiver_is_processing`, `receiver_awaits_feedback`, `receiver_conditionally_accepted`, `receiver_paid`\]

**Example:** `sent`

```
{  "data": {    "id": "e540fe7e-dce2-459e-bf7e-24e605fc18b3",    "department": {      "id": "eab232c6-49b2-4b7e-a977-5e1148dad471",      "type": "string"    },    "invoice_number": "2017 / 5",    "invoice_date": "2016-02-04",    "status": "matched",    "due_on": "2016-03-03",    "paid": true,    "paid_at": "2016-02-04T16:44:33+00:00",    "sent": true,    "purchase_order_number": "000023",    "invoicee": {      "name": "De Rode Duivels",      "vat_number": "BE0899623035",      "customer": {        "id": "eab232c6-49b2-4b7e-a977-5e1148dad471",        "type": "string"      },      "for_attention_of": {        "name": "Radja Nainggolan",        "contact": {          "id": "eab232c6-49b2-4b7e-a977-5e1148dad471",          "type": "string"        }      },      "email": "duivels@test.com",      "national_identification_number": "123"    },    "discounts": [      {        "type": "percentage",        "value": 15.5,        "description": "winter promotion"      }    ],    "grouped_lines": [      {        "section": {          "title": "string"        },        "line_items": [          {            "product": {              "id": "eab232c6-49b2-4b7e-a977-5e1148dad471",              "type": "string"            },            "quantity": 3,            "description": "An awesome product",            "extended_description": "Some more information about this awesome product",            "unit": {              "id": "eab232c6-49b2-4b7e-a977-5e1148dad471",              "type": "string"            },            "unit_price": {              "amount": 123.3,              "tax": "excluding"            },            "tax": {              "id": "eab232c6-49b2-4b7e-a977-5e1148dad471",              "type": "string"            },            "discount": {              "value": 10,              "type": "percentage"            },            "total": {              "tax_exclusive": {                "amount": 123.3,                "currency": "BAM"              },              "tax_exclusive_before_discount": {                "amount": 123.3,                "currency": "BAM"              },              "tax_inclusive": {                "amount": 123.3,                "currency": "BAM"              },              "tax_inclusive_before_discount": {                "amount": 123.3,                "currency": "BAM"              }            },            "product_category": {              "id": "eab232c6-49b2-4b7e-a977-5e1148dad471",              "type": "string"            },            "withheld_tax": {              "id": "eab232c6-49b2-4b7e-a977-5e1148dad471",              "type": "string"            }          }        ]      }    ],    "total": {      "tax_exclusive": {        "amount": 123.3,        "currency": "BAM"      },      "tax_exclusive_before_discount": {        "amount": 123.3,        "currency": "BAM"      },      "tax_inclusive": {        "amount": 123.3,        "currency": "BAM"      },      "tax_inclusive_before_discount": {        "amount": 123.3,        "currency": "BAM"      },      "taxes": [        {          "rate": 0.21,          "taxable": {            "amount": 123.3,            "currency": "BAM"          },          "tax": {            "amount": 123.3,            "currency": "BAM"          }        }      ],      "withheld_taxes": [        {          "id": "e2314517-3cab-4aa9-8471-450e73449040",          "taxable": {            "amount": 123.3,            "currency": "BAM"          },          "withheld": {            "amount": 123.3,            "currency": "BAM"          }        }      ],      "payable": {        "amount": 123.3,        "currency": "BAM"      },      "due": {        "amount": 123.3,        "currency": "BAM"      },      "due_incasso_inclusive": {        "amount": 123.3,        "currency": "BAM"      },      "fixed_late_fee": {        "amount": 123.3,        "currency": "BAM"      },      "interest": {        "amount": 123.3,        "currency": "BAM"      }    },    "payment_term": {      "type": "cash",      "days": 0    },    "payments": [      {        "paid_at": "2016-03-03T16:44:33+00:00",        "payment": {          "amount": 123.3,          "currency": "BAM"        }      }    ],    "payment_reference": "+++084/2613/66074+++",    "note": "'Some extra remarks about the invoice'",    "currency": "USD",    "currency_exchange_rate": {      "from": "USD",      "to": "EUR",      "rate": 1.1234    },    "expected_payment_method": {      "method": "sepa_direct_debit",      "reference": "AB1234"    },    "file": {      "id": "eab232c6-49b2-4b7e-a977-5e1148dad471",      "type": "string"    },    "deal": {      "id": "eab232c6-49b2-4b7e-a977-5e1148dad471",      "type": "string"    },    "project": {      "id": "eab232c6-49b2-4b7e-a977-5e1148dad471",      "type": "string"    },    "on_hold_since": "2016-02-01",    "custom_fields": [      {        "definition": {          "type": "customFieldDefinition",          "id": "bf6765de-56eb-40ec-ad14-9096c5dc5fe1"        },        "value": "092980616"      }    ],    "created_at": "2016-02-04T16:44:33+00:00",    "updated_at": "2016-02-05T16:44:33+00:00",    "document_template": {      "id": "eab232c6-49b2-4b7e-a977-5e1148dad471",      "type": "string"    },    "delivery_date": "2025-12-08",    "peppol_status": "sent"  }}
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
var client = new HttpClient();var request = new HttpRequestMessage(HttpMethod.Post, "https://api.focus.teamleader.eu/invoices.info");request.Headers.Add("Accept", "application/json");request.Headers.Add("Authorization", "Bearer <token>");var content = new StringContent("{\n  \"id\": \"27300f09-6250-4a23-8557-d84c52f99ecf\",\n  \"includes\": \"late_fees\"\n}", null, "application/json");request.Content = content;var response = await client.SendAsync(request);response.EnsureSuccessStatusCode();Console.WriteLine(await response.Content.ReadAsStringAsync());
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
  "id": "27300f09-6250-4a23-8557-d84c52f99ecf",  "includes": "late\_fees"
}
Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

[

Previous

invoices.list

](/docs/api/invoices-list)[

Next

invoices.download

](/docs/api/invoices-download)