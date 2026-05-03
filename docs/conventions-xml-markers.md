# Convention: XML Semantic Markers in Tool Descriptions

## Purpose

Tool description strings use XML-style semantic markers to help AI models prioritise and understand information without relying on plain-text prefixes like `CRITICAL:`, `WARNING:`, or `NOTE:`.

## Supported markers

| Marker | Use case |
|--------|----------|
| `<CRITICAL>...</CRITICAL>` | Must-know information; ignoring it will cause errors |
| `<WARNING>...</WARNING>` | Important caveat; may cause subtle bugs if ignored |
| `<NOTE>...</NOTE>` | Useful context; does not affect correctness if missed |

## Format rules

- Wrap the full sentence or clause, not just the label.
- No newline inside a marker if it fits on one line.
- Markers may appear anywhere in the description string.
- Multiple markers are allowed per description.

## Examples

```ts
// Before (plain prefix)
"Creates a deal. CRITICAL: pipeline_id is required."

// After (XML marker)
"Creates a deal. <CRITICAL>pipeline_id is required.</CRITICAL>"
```

```ts
// Before
"NOTE: status filtering is exclusion-based only."

// After
"<NOTE>Status filtering is exclusion-based only.</NOTE>"
```

## Scope

Applied project-wide as part of B6.3.1 (description quality batch, v3.5.0).
All tool description strings in `src/tools/*.ts` use this convention from v3.5.0 onward.
