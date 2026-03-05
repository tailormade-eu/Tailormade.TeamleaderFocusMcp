# Audit: contacts.ts + companies.ts vs API docs

Date: 2026-03-05

---

## CONTACTS

### 1. Endpoint coverage

| API endpoint | MCP tool | Status |
|---|---|---|
| contacts.add | teamleader_create_contact | ✅ |
| contacts.delete | teamleader_delete_contact | ✅ |
| contacts.info | teamleader_get_contact | ✅ |
| contacts.linkToCompany | teamleader_link_contact_to_company | ✅ |
| contacts.list | teamleader_list_contacts | ✅ |
| contacts.tag | teamleader_tag_contact | ✅ |
| contacts.unlinkFromCompany | teamleader_unlink_contact_from_company | ✅ |
| contacts.untag | teamleader_untag_contact | ✅ |
| contacts.update | teamleader_update_contact | ✅ |
| contacts.updateCompanyLink | teamleader_update_contact_company_link | ✅ |

**Result: 10/10 endpoints covered.**

### 2. Param coverage

#### teamleader_list_contacts

| API param | In tool? | Notes |
|---|---|---|
| filter.term | ✅ | |
| filter.tags | ✅ | |
| filter.updated_since | ✅ | |
| filter.ids | ❌ | Array of contact IDs |
| filter.email | ❌ | Object `{type: "primary", email}` |
| filter.company_id | ❌ | Filter by linked company |
| filter.status | ❌ | `"active"` / `"deactivated"` |
| filter.marketing_mails_consent | ❌ | Boolean filter |
| sort | ❌ | `[{field, order}]` — field: added_at/name/updated_at |
| includes | ❌ | `"custom_fields,price_list"` |
| page | ✅ | |

#### teamleader_create_contact (contacts.add)

| API param | In tool? | Notes |
|---|---|---|
| first_name | ✅ | |
| last_name | ✅ | |
| emails | ✅ | Via `email` shortcut param |
| telephones | ✅ | Via `phone` + `mobile` params |
| language | ✅ | |
| gender | ⚠️ | Enum only `male`/`female` — missing `non_binary`, `prefers_not_to_say`, `unknown` |
| tags | ✅ | |
| salutation | ❌ | e.g. "Mr" |
| website | ❌ | |
| addresses | ❌ | Full address object array |
| birthdate | ❌ | YYYY-MM-DD |
| iban | ❌ | |
| bic | ❌ | |
| national_identification_number | ❌ | |
| remarks | ❌ | Markdown |
| custom_fields | ❌ | `[{id, value}]` |
| marketing_mails_consent | ❌ | Boolean |

#### teamleader_update_contact (contacts.update)

| API param | In tool? | Notes |
|---|---|---|
| id | ✅ | |
| first_name | ✅ | |
| last_name | ✅ | |
| emails | ✅ | Via `email` shortcut |
| telephones | ✅ | Via `phone` + `mobile` |
| language | ✅ | |
| gender | ⚠️ | Enum incomplete (same as create) |
| tags | ✅ | |
| salutation | ❌ | Nullable |
| website | ❌ | Nullable |
| addresses | ❌ | |
| birthdate | ❌ | Nullable |
| iban | ❌ | Nullable |
| bic | ❌ | Nullable |
| national_identification_number | ❌ | |
| remarks | ❌ | Nullable, Markdown |
| custom_fields | ❌ | |
| marketing_mails_consent | ❌ | |

#### teamleader_get_contact (contacts.info)

| API param | In tool? | Notes |
|---|---|---|
| id | ✅ | |

No missing params — only takes `id`.

#### teamleader_delete_contact (contacts.delete)

| API param | In tool? | Notes |
|---|---|---|
| id | ✅ | |

No missing params.

#### teamleader_link_contact_to_company (contacts.linkToCompany)

| API param | In tool? | Notes |
|---|---|---|
| id | ✅ | |
| company_id | ✅ | |
| position | ✅ | |
| decision_maker | ✅ | |

**All params covered.**

#### teamleader_unlink_contact_from_company (contacts.unlinkFromCompany)

| API param | In tool? | Notes |
|---|---|---|
| id | ✅ | |
| company_id | ✅ | |

**All params covered.**

#### teamleader_tag_contact / teamleader_untag_contact

All params covered (id + tags).

#### teamleader_update_contact_company_link (contacts.updateCompanyLink)

| API param | In tool? | Notes |
|---|---|---|
| id | ✅ | |
| company_id | ✅ | |
| position | ✅ | |
| decision_maker | ✅ | |

**All params covered.**

### 3. describe() coverage

#### teamleader_list_contacts

| Param | Has describe()? | Quality |
|---|---|---|
| page | ✅ | OK |
| page_size | ✅ | OK |
| term | ✅ | OK — could mention it filters on first_name, last_name, email, telephone |
| tags | ✅ | OK |
| updated_since | ✅ | OK |

#### teamleader_create_contact

| Param | Has describe()? | Quality |
|---|---|---|
| first_name | ✅ | OK |
| last_name | ✅ | OK |
| email | ✅ | OK |
| phone | ✅ | OK |
| mobile | ✅ | OK |
| language | ✅ | OK — includes examples |
| gender | ✅ | OK |
| tags | ✅ | OK |

#### teamleader_update_contact

| Param | Has describe()? | Quality |
|---|---|---|
| id | ✅ | OK |
| first_name | ✅ | OK |
| last_name | ✅ | OK |
| email | ✅ | OK |
| phone | ✅ | OK |
| mobile | ✅ | OK |
| language | ✅ | OK |
| gender | ✅ | OK |
| tags | ✅ | POOR — should warn that tags OVERWRITE existing tags |

#### teamleader_get_contact

| Param | Has describe()? | Quality |
|---|---|---|
| id | ✅ | OK |

#### teamleader_delete_contact

| Param | Has describe()? | Quality |
|---|---|---|
| id | ✅ | OK |

#### teamleader_link_contact_to_company

| Param | Has describe()? | Quality |
|---|---|---|
| id | ✅ | OK |
| company_id | ✅ | OK |
| position | ✅ | OK — includes example |
| decision_maker | ✅ | OK |

#### teamleader_unlink_contact_from_company

| Param | Has describe()? | Quality |
|---|---|---|
| id | ✅ | OK |
| company_id | ✅ | OK |

#### teamleader_update_contact_company_link

| Param | Has describe()? | Quality |
|---|---|---|
| id | ✅ | OK |
| company_id | ✅ | OK |
| position | ✅ | OK |
| decision_maker | ✅ | OK |

#### teamleader_tag_contact / teamleader_untag_contact

| Param | Has describe()? | Quality |
|---|---|---|
| id | ✅ | OK |
| tags | ✅ | OK — includes examples |

### 4. llmTip coverage

| Tool | Known quirk | llmTip present? |
|---|---|---|
| teamleader_list_contacts | filter.email is object `{type,email}` not flat string | ❌ N/A (param not implemented) |
| teamleader_list_contacts | filter.tags matches contacts with ALL given tags (AND logic) | ❌ |
| teamleader_list_contacts | list response has `primary_address` (flat), NOT `addresses[]` like info | ❌ |
| teamleader_list_contacts | list does NOT return `companies[]`, `vat_number`, or `remarks` | ❌ |
| teamleader_update_contact | `tags` param OVERWRITES all existing tags (not additive) | ❌ |
| teamleader_update_contact | Use tag/untag for incremental tag changes | ❌ |
| teamleader_create_contact | `first_name` is optional in API (only `last_name` required) | ❌ — tool marks both as required |
| teamleader_create_contact | gender has 5 values, tool only exposes 2 | ❌ |

---

## COMPANIES

### 1. Endpoint coverage

| API endpoint | MCP tool | Status |
|---|---|---|
| companies.add | teamleader_create_company | ✅ |
| companies.delete | — | ❌ MISSING |
| companies.info | teamleader_get_company | ✅ |
| companies.list | teamleader_list_companies | ✅ |
| companies.tag | — | ❌ MISSING |
| companies.untag | — | ❌ MISSING |
| companies.update | teamleader_update_company | ✅ |

**Result: 4/7 endpoints covered. 3 MISSING: delete, tag, untag.**

> Note: CLAUDE.md architecture section claims companies.ts has "delete, tag, untag" but the actual code does not implement them.

### 2. Param coverage

#### teamleader_list_companies

| API param | In tool? | Notes |
|---|---|---|
| filter.term | ✅ | |
| filter.tags | ✅ | |
| filter.vat_number | ✅ | |
| filter.updated_since | ✅ | |
| filter.ids | ❌ | Array of company IDs |
| filter.email | ❌ | Object `{type: "primary", email}` |
| filter.national_identification_number | ❌ | |
| filter.status | ❌ | `"active"` / `"deactivated"` |
| filter.marketing_mails_consent | ❌ | Boolean |
| sort | ❌ | `[{field, order}]` — field: name/added_at/updated_at |
| includes | ❌ | `"custom_fields,price_list"` |
| page | ✅ | |

#### teamleader_create_company (companies.add)

| API param | In tool? | Notes |
|---|---|---|
| name | ✅ | |
| emails | ✅ | Via `email` shortcut |
| telephones | ✅ | Via `phone` shortcut (only phone, no fax) |
| vat_number | ✅ | |
| website | ✅ | |
| language | ✅ | |
| tags | ✅ | |
| business_type_id | ❌ | |
| national_identification_number | ❌ | |
| addresses | ❌ | Full address object array |
| iban | ❌ | |
| bic | ❌ | |
| responsible_user_id | ❌ | |
| remarks | ❌ | Markdown |
| custom_fields | ❌ | `[{id, value}]` |
| marketing_mails_consent | ❌ | |
| preferred_currency | ❌ | |

#### teamleader_update_company (companies.update)

| API param | In tool? | Notes |
|---|---|---|
| id | ✅ | |
| name | ✅ | |
| emails | ✅ | Via `email` shortcut |
| telephones | ✅ | Via `phone` shortcut |
| vat_number | ✅ | |
| website | ✅ | |
| language | ✅ | |
| tags | ✅ | |
| business_type_id | ❌ | Nullable |
| national_identification_number | ❌ | Nullable |
| addresses | ❌ | |
| iban | ❌ | Nullable |
| bic | ❌ | Nullable |
| responsible_user_id | ❌ | Nullable |
| remarks | ❌ | Nullable, Markdown |
| custom_fields | ❌ | |
| marketing_mails_consent | ❌ | |
| preferred_currency | ❌ | Nullable |

#### teamleader_get_company (companies.info)

| API param | In tool? | Notes |
|---|---|---|
| id | ✅ | |
| includes | ❌ | `"related_companies,related_contacts"` |

### 3. describe() coverage

#### teamleader_list_companies

| Param | Has describe()? | Quality |
|---|---|---|
| page | ✅ | OK |
| page_size | ✅ | OK |
| term | ✅ | OK — could mention it filters on name, vat_number, emails, telephones |
| tags | ✅ | OK |
| vat_number | ✅ | OK |
| updated_since | ✅ | OK |

#### teamleader_create_company

| Param | Has describe()? | Quality |
|---|---|---|
| name | ✅ | OK |
| email | ✅ | OK |
| phone | ✅ | OK |
| vat_number | ✅ | OK |
| website | ✅ | OK |
| language | ✅ | OK — includes examples |
| tags | ✅ | OK |

#### teamleader_update_company

| Param | Has describe()? | Quality |
|---|---|---|
| id | ✅ | OK |
| name | ✅ | OK |
| email | ✅ | OK |
| phone | ✅ | OK |
| vat_number | ✅ | OK |
| website | ✅ | OK |
| language | ✅ | OK |
| tags | ✅ | POOR — should warn that tags OVERWRITE existing tags |

#### teamleader_get_company

| Param | Has describe()? | Quality |
|---|---|---|
| id | ✅ | OK |

### 4. llmTip coverage

| Tool | Known quirk | llmTip present? |
|---|---|---|
| teamleader_list_companies | filter.email is object `{type,email}` not flat string | ❌ N/A (param not implemented) |
| teamleader_list_companies | list returns `primary_address` (flat), NOT `addresses[]` like info | ❌ |
| teamleader_list_companies | `custom_fields` only returned when `includes=custom_fields` | ❌ N/A (includes not implemented) |
| teamleader_update_company | `tags` param OVERWRITES all existing tags (not additive) | ❌ |
| teamleader_update_company | Use tag/untag for incremental tag changes | ❌ — tag/untag tools don't exist yet |
| teamleader_get_company | `includes` param available for related_companies/related_contacts | ❌ N/A (param not implemented) |
| teamleader_create_company | Company telephones only support `phone`/`fax` (no `mobile`) | ❌ |

---

## Summary

### Contacts
- **Endpoints:** 10/10 ✅
- **Params:** Many missing — addresses, custom_fields, remarks, birthdate, iban/bic, salutation, website, marketing_mails_consent across add/update; list missing ids, email, company_id, status, sort, includes filters
- **describe():** All params have describe(). Quality issue: update tags should warn about overwrite behavior
- **llmTip:** None present. Key missing tips: tags overwrite on update, first_name is optional in API, gender enum incomplete

### Companies
- **Endpoints:** 4/7 — MISSING delete, tag, untag
- **Params:** Many missing — business_type_id, addresses, iban/bic, responsible_user_id, remarks, custom_fields, marketing_mails_consent, preferred_currency, national_identification_number across add/update; list missing ids, email, national_identification_number, status, sort, includes; info missing includes
- **describe():** All params have describe(). Quality issue: update tags should warn about overwrite behavior
- **llmTip:** None present. Key missing tips: tags overwrite on update, telephones only phone/fax (no mobile)
