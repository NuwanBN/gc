---
feature: product-creation
status: approved
generated: 2026-06-03
last_updated: 2026-06-03
layer: ui
source:
  - discovery-session
  - ordino/context.md
---

# Intent
Verify product creation in real GC3 staging through Menu Management GC3 > Products.

# Acceptance Criteria
- [ ] AC-1: User can create a product with required fields and see it in the Products list
- [ ] AC-2: Creating a product with a duplicate name is blocked with a visible error state

# Scenarios

## Happy Path [AC-1]
User logs in, opens Products, creates a product with required fields, saves, and verifies the new product is visible in the Products table.

## Edge Case: Duplicate product name [AC-2]
User attempts to create a product using an existing product name and the system prevents duplicate creation with clear feedback.

# Out of Scope
- Product media upload validations
- Permission matrix checks for create role
- Full field-level validations beyond duplicate name for this iteration

# Change Log
- 2026-06-03: created via discovery session (agent)
