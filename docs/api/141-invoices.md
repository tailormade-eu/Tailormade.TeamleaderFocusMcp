# Invoices

> Source: https://developer.focus.teamleader.eu/docs/api/invoices

-   [](/)
-   [API Reference](/docs/api)
-   Invoicing
-   Invoices

# Invoices

Teamleader provides a whole set of endpoints to make it easy to develop integrations with invoices. New invoices are created in accordance with this flow: `invoice.draft` → `invoice.book`. Invoices can also be updated, deleted or credited.

_**Required scopes:**_ `invoices`

[

## 📄️ invoices.list

Get a list of invoices.

](/docs/api/invoices-list)

[

## 📄️ invoices.info

Get details for a single invoice.

](/docs/api/invoices-info)

[

## 📄️ invoices.download

Download an invoice in a specific format.

](/docs/api/invoices-download)

[

## 📄️ invoices.draft

Draft a new invoice.

](/docs/api/invoices-draft)

[

## 📄️ invoices.update

Update a draft invoice. Booked invoices cannot be updated.

](/docs/api/invoices-update)

[

## 📄️ invoices.updateBooked

Update a booked invoice. Only available when editing booked invoices is allowed through the settings.

](/docs/api/invoices-update-booked)

[

## 📄️ invoices.copy

Creates a new draft invoice based on another invoice.

](/docs/api/invoices-copy)

[

## 📄️ invoices.book

Book a draft invoice.

](/docs/api/invoices-book)

[

## 📄️ invoices.delete

Delete an existing invoice. Only possible for draft invoices or the last booked invoice.

](/docs/api/invoices-delete)

[

## 📄️ invoices.registerPayment

Register a payment for an invoice.

](/docs/api/invoices-register-payment)

[

## 📄️ invoices.removePayments

Marks an invoice as unpaid and removes all linked payments. This will also trigger a re-rendering of the invoice PDF.

](/docs/api/invoices-remove-payments)

[

## 📄️ invoices.credit

Credit an invoice completely.

](/docs/api/invoices-credit)

[

## 📄️ invoices.creditPartially

Credit an invoice partially.

](/docs/api/invoices-credit-partially)

[

## 📄️ invoices.send

Send an invoice via e-mail.

](/docs/api/invoices-send)

[

## 📄️ invoices.sendViaPeppol

Send an invoice via the Peppol network.

](/docs/api/invoices-send-via-peppol)

[

Previous

activityTypes.list

](/docs/api/activity-types-list)[

Next

invoices.list

](/docs/api/invoices-list)