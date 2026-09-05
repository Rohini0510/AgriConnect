---
name: API contract generation quirks
description: Compatibility notes for the generated Zod validation layer in this workspace
---

The generated API Zod layer currently targets the Zod 3 runtime, so OpenAPI integer schemas can emit unsupported `zod.int()` calls. Use numeric schemas for demo counters unless the workspace Zod/generator versions are upgraded together.

**Why:** Code generation succeeded but the shared library typecheck failed until the integer fields were normalized.

**How to apply:** When adding OpenAPI contracts, run codegen immediately and keep integer-heavy fields as numbers unless the generated output is confirmed compatible.